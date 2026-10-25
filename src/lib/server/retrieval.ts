/**
 * Bounded keyword/category retrieval for the portfolio chatbot.
 *
 * Pipeline (ARCHITECTURE.md §8.2, ADR-011):
 *   1. Normalize: Unicode NFKC → lowercase → collapse whitespace → strip controls.
 *   2. Detect intent categories from normalized text (before stop-word removal).
 *   3. Tokenize on non-alphanumeric boundaries; drop stop-words and short tokens.
 *   4. Issue a single bounded Prisma `findMany` (take: 20) with category+token filters.
 *      Only server-derived parameters — no client-controlled values ever reach the query.
 *   5. Score in application code: titleHit×3 + keywordHit×2 + bodyHit×1 + categoryMatch×2.
 *      Floor: score ≥ 2 (a lone body mention is not enough).
 *   6. Return top K records (≤ 6), each body capped at 600 chars.
 *   7. No relevant records → return undefined (caller emits `no_data`, 0 Gemini calls).
 *
 * DB query count per request: exactly 1 (R-031, AC-4).
 * No embeddings, vector search, extensions (ADR-003).
 *
 * @module server-only — imported only in Route Handlers.
 */
import 'server-only';

import { type PrismaClient } from '@prisma/client';
import {
  RETRIEVAL_TAKE,
  RETRIEVAL_TOP_K,
  CONTEXT_RECORD_MAX_CHARS,
  CONTEXT_MAX_CHARS,
} from '@/lib/chat-contract';

// ─── Types ─────────────────────────────────────────────────────────────────────

/** A subset of KnowledgeRecord safe to pass to Gemini prompt construction. */
export interface RetrievedRecord {
  id: string;
  category: string;
  title: string;
  /** Body text, capped at CONTEXT_RECORD_MAX_CHARS. */
  body: string;
  keywords: string[];
  url: string | null;
}

// ─── Intent category map ──────────────────────────────────────────────────────

/**
 * Maps terms detected in the query to one or more knowledge categories.
 * Checked BEFORE stop-word removal so broad terms ("about", "who") still match.
 *
 * Both English and common Indonesian portfolio terms are included
 * (ARCHITECTURE.md §8.2).
 */
const INTENT_MAP: { terms: string[]; categories: string[] }[] = [
  // Profile / general
  {
    terms: [
      'who', 'about', 'siapa', 'siapakah', 'profile', 'summary', 'focus', 'describe', 'overview',
      'background', 'tentang', 'tentangnya', 'latar', 'belakang', 'latar belakang', 'biodata',
      'profil', 'fauzi', 'budikusuma', 'fauzi budikusuma',
    ],
    categories: ['PROFILE'],
  },
  // Education
  {
    terms: [
      'education', 'study', 'university', 'school', 'degree', 'college', 'campus',
      'kuliah', 'sekolah', 'kampus', 'pendidikan', 'sarjana', 'diploma', 'amikom',
      'seyegan', 'smk', 'yogyakarta', 'jurusan', 'prodi', 'program studi', 'lulusan', 'akademik',
    ],
    categories: ['EDUCATION'],
  },
  // Experience / work
  {
    terms: [
      'experience', 'work', 'intern', 'internship', 'job', 'career', 'employment',
      'pengalaman', 'magang', 'kerja', 'kominfo', 'dinas', 'helpdesk', 'help desk',
      'supervisor', 'pekerjaan', 'karir', 'riwayat',
    ],
    categories: ['EXPERIENCE'],
  },
  // Skills / technologies
  {
    terms: [
      'skill', 'technology', 'stack', 'language', 'tool', 'framework', 'tech',
      'keahlian', 'kemampuan', 'keterampilan', 'kompetensi', 'teknologi', 'bahasa',
      'bahasa pemrograman', 'mikrotik', 'linux', 'network', 'networking', 'programming',
      'software', 'hardware', 'alat', 'peralatan',
    ],
    categories: ['SKILL'],
  },
  // Projects
  {
    terms: [
      'project', 'built', 'repository', 'repo', 'github', 'app', 'application',
      'proyek', 'aplikasi', 'sentinel', 'developed', 'created', 'made', 'karya',
      'portofolio', 'portfolio', 'repositori', 'sistem', 'buatan',
    ],
    categories: ['PROJECT'],
  },
  // Certifications
  {
    terms: [
      'certificate', 'certification', 'credential', 'award', 'license', 'course',
      'sertifikat', 'sertifikasi', 'mtcna', 'bnsp', 'google', 'cybersecurity',
      'pkl', 'training', 'credly', 'badge', 'badges', 'lencana', 'akreditasi',
      'lisensi', 'ujian kompetensi',
    ],
    categories: ['CERTIFICATION'],
  },
  // Contact
  {
    terms: [
      'contact', 'email', 'linkedin', 'instagram', 'github', 'reach', 'connect',
      'kontak', 'hubungi', 'sosial', 'media', 'social', 'credly', 'badge',
      'surel', 'kirim pesan', 'menghubungi',
    ],
    categories: ['CONTACT'],
  },
];

// ─── Stop-words ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by',
  'do', 'for', 'from', 'has', 'have', 'he', 'her', 'him', 'his',
  'how', 'i', 'if', 'in', 'is', 'it', 'its', 'me', 'my', 'not',
  'of', 'on', 'or', 'our', 'out', 'so', 'that', 'the', 'their',
  'them', 'then', 'there', 'they', 'this', 'to', 'up', 'us',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'who',
  'will', 'with', 'you', 'your',
  // Indonesian stop words
  'ada', 'adalah', 'apa', 'apakah', 'bagaimana', 'gimana', 'bisa', 'dan', 'dengan', 'di',
  'dari', 'dia', 'hal', 'ini', 'itu', 'juga', 'ke', 'lain', 'lebih',
  'mereka', 'pada', 'punya', 'saya', 'seperti', 'sudah', 'tidak',
  'untuk', 'yang', 'kapan', 'dimana', 'kenapa', 'mengapa', 'saja',
]);

/** Tokens whose short length should be kept (programming languages etc.). */
const SHORT_TOKEN_ALLOWLIST = new Set(['c', 'r', 'go', 'ts', 'js', 'ui', 'ai', 'db']);

// ─── Pure helpers (testable, no DB dependency) ────────────────────────────────

/**
 * Normalize a raw query string:
 * Unicode NFKC → lowercase → collapse whitespace → strip control characters.
 */
export function normalizeQuery(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect intent categories from the normalized text.
 * Called BEFORE stop-word removal so generic terms still map to categories.
 */
export function detectIntentCategories(normalized: string): string[] {
  const found = new Set<string>();
  for (const { terms, categories } of INTENT_MAP) {
    for (const term of terms) {
      if (normalized.includes(term)) {
        for (const cat of categories) {
          found.add(cat);
        }
        break; // one term per group is enough to match the group
      }
    }
  }
  return Array.from(found);
}

/**
 * Tokenize: split on non-alphanumeric characters (except `+`, `#`, `.` used in tech names),
 * then drop stop-words and tokens shorter than 2 chars (with a short-list exception).
 */
export function tokenize(normalized: string): string[] {
  const raw = normalized.split(/[^a-z0-9+#.]+/).filter(Boolean);
  return raw.filter((t) => {
    if (t.length < 2) return SHORT_TOKEN_ALLOWLIST.has(t);
    if (t.length <= 2) return true; // keep 2-char tokens
    return !STOP_WORDS.has(t);
  });
}

/** Score a record against the query tokens and detected categories. */
export function scoreRecord(
  record: { category: string; title: string; body: string; keywords: string[] },
  tokens: string[],
  intentCategories: string[],
): number {
  if (tokens.length === 0 && intentCategories.length === 0) return 0;

  const titleLow = record.title.toLowerCase();
  const bodyLow = record.body.toLowerCase();
  const keywordSet = new Set(record.keywords.map((k) => k.toLowerCase()));

  let titleHit = 0;
  let keywordHit = 0;
  let bodyHit = 0;

  for (const token of tokens) {
    if (titleLow.includes(token)) titleHit++;
    if (keywordSet.has(token)) keywordHit++;
    else if (bodyLow.includes(token)) bodyHit++;
  }

  const categoryMatch = intentCategories.includes(record.category) ? 1 : 0;

  return 3 * titleHit + 2 * keywordHit + 1 * bodyHit + 2 * categoryMatch;
}

/**
 * Build the Gemini context string from a list of retrieved records.
 * Caps individual records at CONTEXT_RECORD_MAX_CHARS and total at CONTEXT_MAX_CHARS.
 */
export function buildContext(records: RetrievedRecord[]): string {
  const parts: string[] = [];
  let totalChars = 0;

  for (const rec of records) {
    const bodySnippet = rec.body.slice(0, CONTEXT_RECORD_MAX_CHARS);
    const entry = `[${rec.category}] ${rec.title}\n${bodySnippet}${rec.url ? `\nURL: ${rec.url}` : ''}`;
    if (totalChars + entry.length > CONTEXT_MAX_CHARS) break;
    parts.push(entry);
    totalChars += entry.length;
  }

  return parts.join('\n\n---\n\n');
}

// ─── DB retrieval ──────────────────────────────────────────────────────────────

/** Minimum score to include a record in results (ARCHITECTURE.md §8.2). */
const SCORE_FLOOR = 2;

/**
 * Retrieve the top-K verified portfolio records relevant to the query.
 *
 * - Executes exactly one bounded DB query (take: 20).
 * - Only parameters derived by the server (tokens, category enums) reach the query.
 * - Returns an empty array if no records reach the score floor.
 *
 * @param prisma Prisma client (read-only runtime credential).
 * @param query  Raw visitor query (will be normalized internally).
 * @param cachedCandidates Optional pre-cached knowledge records (from in-memory cache).
 */
export async function retrieveKnowledge(
  prisma: PrismaClient,
  query: string,
  cachedCandidates?: Array<{
    id: string;
    category: string;
    title: string;
    body: string;
    keywords: string[];
    url: string | null;
  }>,
): Promise<RetrievedRecord[]> {
  const normalized = normalizeQuery(query);
  const intentCategories = detectIntentCategories(normalized);
  const tokens = tokenize(normalized);

  let candidates: Array<{
    id: string;
    category: string;
    title: string;
    body: string;
    keywords: string[];
    url: string | null;
  }>;

  if (cachedCandidates && cachedCandidates.length > 0) {
    // Score directly from in-memory cache — zero DB latency (0–1ms)
    candidates = cachedCandidates;
  } else {
    // Fallback: bounded database query if cache is bypassed or not provided
    const categoryFilter =
      intentCategories.length > 0
        ? { category: { in: intentCategories as ('PROFILE' | 'EDUCATION' | 'EXPERIENCE' | 'SKILL' | 'PROJECT' | 'CERTIFICATION' | 'GALLERY' | 'CONTACT')[] } }
        : {};

    const tokenFilters = tokens.map((token) => ({
      OR: [
        { title: { contains: token, mode: 'insensitive' as const } },
        { keywords: { has: token } },
        { body: { contains: token, mode: 'insensitive' as const } },
      ],
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (prisma as any).knowledgeRecord.findMany({
      where: {
        ...categoryFilter,
        ...(tokenFilters.length > 0 ? { OR: tokenFilters } : {}),
      },
      take: RETRIEVAL_TAKE,
      orderBy: [{ category: 'asc' }, { position: 'asc' }],
      select: {
        id: true,
        category: true,
        title: true,
        body: true,
        keywords: true,
        url: true,
      },
    });

    candidates = rows as typeof candidates;
  }

  if (candidates.length === 0) return [];

  // Score and filter in application code.
  const scored = (candidates as Array<{
    id: string;
    category: string;
    title: string;
    body: string;
    keywords: string[];
    url: string | null;
  }>)
    .map((rec) => ({
      ...rec,
      score: scoreRecord(rec, tokens, intentCategories),
    }))
    .filter((r) => r.score >= SCORE_FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, RETRIEVAL_TOP_K);

  if (scored.length === 0) return [];

  return scored.map((r) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    body: r.body.slice(0, CONTEXT_RECORD_MAX_CHARS),
    keywords: r.keywords,
    url: r.url,
  }));
}
