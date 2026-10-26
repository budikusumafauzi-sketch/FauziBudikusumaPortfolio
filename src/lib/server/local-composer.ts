import 'server-only';
import { type CachedKnowledgeRecord } from './knowledge-cache';
import { getFixedCopy, ANSWER_MAX_CHARS, type Source } from '@/lib/chat-contract';
import { normalizeQuery } from './local-matcher';

export interface ComposedAnswerResult {
  status: 'degraded' | 'no_data';
  answer: string;
  caption?: string;
  sources?: Source[];
}

const STOP_WORDS = new Set([
  // English structural stop words
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from',
  'up', 'down', 'of', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can',
  'will', 'just', 'should', 'now', 'does', 'did', 'do', 'me', 'my', 'him',
  'his', 'her', 'their', 'them',

  // Indonesian structural stop words
  'ada', 'adalah', 'adanya', 'adapun', 'agak', 'agar', 'akan', 'akankah',
  'akhir', 'akhiri', 'akhirnya', 'aku', 'akulah', 'amat', 'amatlah', 'anda',
  'andalah', 'antar', 'antara', 'antaranya', 'apa', 'apaan', 'apabila',
  'apakah', 'apalagi', 'apatah', 'atau', 'ataukah', 'ataupun', 'bagai',
  'bagaikan', 'bagaimana', 'bagaimanakah', 'bagaimanapun', 'bagi', 'bahkan',
  'bahwa', 'bahwasanya', 'baik', 'banyak', 'beberapa', 'belum', 'belumlah',
  'benar', 'benarkah', 'benar-benar', 'berada', 'berapa', 'berapakah',
  'berapalah', 'berapapun', 'berikut', 'berikutnya', 'bersama', 'betul',
  'biasa', 'bisa', 'bisakah', 'boleh', 'bolehkah', 'buat', 'bukan',
  'bukankah', 'bukanlah', 'dan', 'dapat', 'dari', 'daripada', 'dengan',
  'di', 'dia', 'dialah', 'didapat', 'ini', 'itu', 'juga', 'kami', 'kamu',
  'karena', 'ke', 'pada', 'saya', 'secara', 'sudah',
  'tersebut', 'untuk', 'yang', 'nya',
]);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  PROFILE: [
    'profile', 'profil', 'about', 'tentang', 'who', 'siapa', 'tell', 'ceritakan',
    'fauzi', 'fauzis', 'budikusuma', 'background', 'latar', 'belakang',
    'philosophy', 'filosofi', 'working', 'style', 'gaya', 'kerja',
    'available', 'ketersediaan', 'availability', 'opportunity', 'peluang',
    'residence', 'lokasi', 'location', 'yogyakarta', 'surakarta', 'biodata',
  ],
  SKILL: [
    'skill', 'skills', 'keahlian', 'kemampuan', 'tech', 'technology', 'teknologi',
    'stack', 'competency', 'kompetensi', 'network', 'networking', 'jaringan',
    'mikrotik', 'cisco', 'routeros', 'ospf', 'bgp', 'vlan', 'wireguard', 'vpn',
    'firewall', 'snmp', 'telemetry', 'language', 'languages', 'bahasa',
    'pemrograman', 'typescript', 'javascript', 'python', 'php', 'cpp', 'c++',
    'sql', 'frontend', 'react', 'nextjs', 'tailwind', 'vue', 'backend',
    'node', 'express', 'fastapi', 'prisma', 'database', 'caching', 'postgres',
    'postgresql', 'neon', 'mysql', 'redis', 'devops', 'tools', 'docker', 'linux',
    'ubuntu', 'debian', 'git', 'github', 'nginx',
  ],
  PROJECT: [
    'project', 'projects', 'proyek', 'app', 'apps', 'aplikasi', 'build', 'built',
    'built-with', 'repo', 'repository', 'github', 'software', 'dashboard',
    'monitoring', 'network-monitoring', 'stacklab', 'sentinel', 'cybersecurity',
    'intelligence', 'simulation', 'simulasi', 'datacenter', 'enterprise',
  ],
  CERTIFICATION: [
    'certification', 'certifications', 'certificate', 'certificates', 'sertifikat',
    'sertifikasi', 'credential', 'credentials', 'kredensial', 'badge', 'lencana',
    'mtcna', 'cybersecurity', 'google', 'ai', 'kompetensi', 'uji', 'bnsp', 'lsp',
    'ukk', 'nilai', 'pkl', 'accreditation', 'akreditasi',
  ],
  EXPERIENCE: [
    'experience', 'pengalaman', 'work', 'kerja', 'intern', 'internship', 'magang',
    'pkl', 'job', 'career', 'kominfo', 'dinas', 'provinsi', 'helpdesk', 'incident',
  ],
  EDUCATION: [
    'education', 'pendidikan', 'study', 'kuliah', 'sekolah', 'university',
    'universitas', 'degree', 'sarjana', 'bachelor', 'amikom', 'smk', 'seyegan',
    'tkj', 'informatics', 'informatika',
  ],
  CONTACT: [
    'contact', 'kontak', 'hubungi', 'reach', 'email', 'gmail', 'linkedin',
    'github', 'instagram', 'credly', 'hire', 'collab', 'collaboration',
    'channel', 'saluran', 'message', 'pesan',
  ],
};

function extractFirstSentences(text: string, count = 2): string {
  // Split on sentence boundaries: periods, exclamation marks, question marks followed by space/end
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences || sentences.length === 0) {
    return text.slice(0, 300).trim();
  }
  return sentences.slice(0, count).join('').trim();
}

/**
 * Tier 3: Deterministic Local Answer Composer (Item 18 / CR-014).
 * Pure, deterministic, instant (< 50ms) retrieval and composition from verified portfolio records.
 * Acts as the safety net when AI is busy, times out, or fails.
 * Invariant I-1/I-2: never returns "unavailable" as long as knowledge is loaded.
 */
export function composeLocalAnswer(
  question: string,
  language: 'en' | 'id',
  records: CachedKnowledgeRecord[],
): ComposedAnswerResult {
  const normalized = normalizeQuery(question);
  if (!normalized) {
    return {
      status: 'no_data',
      answer: getFixedCopy('no_data', language),
    };
  }

  const isId = language === 'id';
  const queryTokens = normalized
    .split(' ')
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

  // 1. Detect Intent Category from Query Tokens
  const categoryScores: Record<string, number> = {};
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let catScore = 0;
    for (const token of queryTokens) {
      if (keywords.includes(token)) {
        catScore += 4;
      }
    }
    if (catScore > 0) {
      categoryScores[cat] = catScore;
    }
  }

  // 2. Score and Rank Records
  interface ScoredRecord {
    record: CachedKnowledgeRecord;
    score: number;
  }

  const scoredRecords: ScoredRecord[] = [];

  for (const record of records) {
    let score = 0;

    // A. Category matching bonus
    if (categoryScores[record.category]) {
      score += categoryScores[record.category];
    }

    // B. Title matching
    const titleToMatch = isId && record.titleId ? record.titleId : record.title;
    const normTitle = normalizeQuery(titleToMatch);
    for (const token of queryTokens) {
      if (normTitle.includes(token)) {
        score += 3;
      }
    }

    // C. Keywords matching
    for (const token of queryTokens) {
      if (record.keywords.some((kw) => kw.includes(token) || token.includes(kw))) {
        score += 2;
      }
    }

    // D. Body matching
    const bodyToMatch = isId && record.bodyId ? record.bodyId : record.body;
    const normBody = normalizeQuery(bodyToMatch);
    for (const token of queryTokens) {
      if (normBody.includes(token)) {
        score += 1;
      }
    }

    if (score > 0) {
      scoredRecords.push({ record, score });
    }
  }

  // 3. Fallback to no_data copy if zero records matched
  if (scoredRecords.length === 0) {
    return {
      status: 'no_data',
      answer: getFixedCopy('no_data', language),
    };
  }

  // 4. Sort by score descending and select top 2 to 5 records
  scoredRecords.sort((a, b) => b.score - a.score);
  const selected = scoredRecords.slice(0, 4).map((sr) => sr.record);

  // 5. Compose Plain-Text Grounded Answer
  const answerLines: string[] = [];
  let currentChars = 0;
  const maxCharsBudget = ANSWER_MAX_CHARS - 100; // Leave room for margins

  for (const rec of selected) {
    const title = isId ? (rec.titleId || rec.title) : rec.title;
    const fullBody = isId ? (rec.bodyId || rec.body) : rec.body;
    const snippet = extractFirstSentences(fullBody, 2);

    const block = `• ${title}: ${snippet}`;
    if (currentChars + block.length > maxCharsBudget && answerLines.length >= 2) {
      break;
    }

    answerLines.push(block);
    currentChars += block.length + 2;
  }

  const finalAnswer = answerLines.join('\n\n').slice(0, ANSWER_MAX_CHARS).trim();

  const sources: Source[] = selected.map((rec) => ({
    slug: rec.id,
    title: isId ? (rec.titleId || rec.title) : rec.title,
    category: rec.category,
  }));

  return {
    status: 'degraded',
    answer: finalAnswer,
    caption: getFixedCopy('degraded_caption', language),
    sources,
  };
}
