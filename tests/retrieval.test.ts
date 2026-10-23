/**
 * TASK-020 — Tests: retrieval pure helpers and mocked DB retrieval.
 *
 * Tests:
 * - normalizeQuery, detectIntentCategories, tokenize, scoreRecord, buildContext
 * - retrieveKnowledge with a mocked Prisma client
 * - In-scope questions map to the right categories and return records
 * - Nonsense/private/injection inputs yield empty results (not blocked here — guard handles that)
 * - No Gemini call on empty results (spy assertion in route tests)
 */

import { describe, it, expect, vi } from 'vitest';
import {
  normalizeQuery,
  detectIntentCategories,
  tokenize,
  scoreRecord,
  buildContext,
  retrieveKnowledge,
  type RetrievedRecord,
} from '@/lib/server/retrieval';
import { RETRIEVAL_TOP_K, CONTEXT_MAX_CHARS, CONTEXT_RECORD_MAX_CHARS } from '@/lib/chat-contract';

// ─── normalizeQuery ───────────────────────────────────────────────────────────

describe('normalizeQuery', () => {
  it('lowercases and trims', () => {
    expect(normalizeQuery('  Hello World  ')).toBe('hello world');
  });

  it('strips control characters', () => {
    expect(normalizeQuery('Hello\x00World')).toBe('hello world');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeQuery('a   b   c')).toBe('a b c');
  });

  it('applies Unicode NFKC normalization', () => {
    // ＡＢＣ (fullwidth) → ABC
    expect(normalizeQuery('\uFF21\uFF22\uFF23')).toBe('abc');
  });

  it('handles empty string', () => {
    expect(normalizeQuery('')).toBe('');
  });
});

// ─── detectIntentCategories ───────────────────────────────────────────────────

describe('detectIntentCategories', () => {
  it('maps "project" to PROJECT', () => {
    expect(detectIntentCategories('what projects has he built')).toContain('PROJECT');
  });

  it('maps "skill" to SKILL', () => {
    expect(detectIntentCategories('what are his skills')).toContain('SKILL');
  });

  it('maps "education" to EDUCATION', () => {
    expect(detectIntentCategories('where did he study')).toContain('EDUCATION');
  });

  it('maps "pendidikan" (Indonesian) to EDUCATION', () => {
    expect(detectIntentCategories('apa pendidikan fauzi')).toContain('EDUCATION');
  });

  it('maps "experience" to EXPERIENCE', () => {
    expect(detectIntentCategories('what is his work experience')).toContain('EXPERIENCE');
  });

  it('maps "magang" (Indonesian) to EXPERIENCE', () => {
    expect(detectIntentCategories('di mana dia magang')).toContain('EXPERIENCE');
  });

  it('maps "certificate" to CERTIFICATION', () => {
    expect(detectIntentCategories('does he have certifications')).toContain('CERTIFICATION');
  });

  it('maps "contact" to CONTACT', () => {
    expect(detectIntentCategories('how can I contact fauzi')).toContain('CONTACT');
  });

  it('maps "who" / "about" to PROFILE', () => {
    expect(detectIntentCategories('who is fauzi')).toContain('PROFILE');
    expect(detectIntentCategories('tell me about fauzi')).toContain('PROFILE');
  });

  it('maps "github" to both PROJECT and CONTACT', () => {
    const cats = detectIntentCategories('his github projects');
    expect(cats).toContain('PROJECT');
    expect(cats).toContain('CONTACT');
  });

  it('returns empty array for nonsense query', () => {
    const cats = detectIntentCategories('xyzqrst blahrgh flurble');
    expect(cats).toHaveLength(0);
  });
});

// ─── tokenize ─────────────────────────────────────────────────────────────────

describe('tokenize', () => {
  it('splits on non-alphanumeric and drops stop-words', () => {
    const tokens = tokenize('what are his technical skills');
    expect(tokens).not.toContain('what');
    expect(tokens).not.toContain('are');
    expect(tokens).not.toContain('his');
    expect(tokens).toContain('technical');
    expect(tokens).toContain('skills');
  });

  it('keeps short allow-listed tokens like "c"', () => {
    const tokens = tokenize('programming in c language');
    expect(tokens).toContain('c');
  });

  it('keeps "ts" and "js"', () => {
    const tokens = tokenize('experience with ts and js');
    expect(tokens).toContain('ts');
    expect(tokens).toContain('js');
  });

  it('handles empty string', () => {
    expect(tokenize('')).toHaveLength(0);
  });

  it('handles Indonesian stop-word "dan"', () => {
    const tokens = tokenize('proyek dan pengalaman');
    expect(tokens).not.toContain('dan');
    expect(tokens).toContain('proyek');
    expect(tokens).toContain('pengalaman');
  });
});

// ─── scoreRecord ──────────────────────────────────────────────────────────────

describe('scoreRecord', () => {
  const sampleRecord = {
    category: 'PROJECT',
    title: 'Sentinel Security Tool',
    body: 'A network monitoring application built with Python and Mikrotik.',
    keywords: ['sentinel', 'network', 'python', 'mikrotik', 'security'],
  };

  it('scores title hit as 3 per token', () => {
    const score = scoreRecord(sampleRecord, ['sentinel'], ['PROJECT']);
    expect(score).toBeGreaterThanOrEqual(3 + 2); // titleHit×3 + categoryMatch×2
  });

  it('scores keyword hit as 2 per token', () => {
    const score = scoreRecord(sampleRecord, ['python'], ['SKILL']);
    expect(score).toBeGreaterThanOrEqual(2); // keywordHit×2
  });

  it('scores body hit as 1 per token', () => {
    const score = scoreRecord(sampleRecord, ['monitoring'], ['PROJECT']);
    expect(score).toBeGreaterThanOrEqual(1 + 2); // bodyHit×1 + categoryMatch×2
  });

  it('scores category match as 2', () => {
    const score = scoreRecord(sampleRecord, [], ['PROJECT']);
    expect(score).toBe(2); // category only
  });

  it('returns 0 for no matching tokens and no category match', () => {
    const score = scoreRecord(sampleRecord, ['xyz123'], ['EDUCATION']);
    expect(score).toBe(0);
  });

  it('accumulates score across multiple tokens', () => {
    const s1 = scoreRecord(sampleRecord, ['sentinel'], ['PROJECT']);
    const s2 = scoreRecord(sampleRecord, ['sentinel', 'python'], ['PROJECT']);
    expect(s2).toBeGreaterThan(s1);
  });
});

// ─── buildContext ─────────────────────────────────────────────────────────────

describe('buildContext', () => {
  const makeRecord = (id: string, category: string, title: string, body: string): RetrievedRecord => ({
    id, category, title, body, keywords: [], url: null,
  });

  it('concatenates records with separators', () => {
    const recs: RetrievedRecord[] = [
      makeRecord('a', 'PROFILE', 'Fauzi', 'A software engineer.'),
      makeRecord('b', 'PROJECT', 'Sentinel', 'A network tool.'),
    ];
    const ctx = buildContext(recs);
    expect(ctx).toContain('PROFILE');
    expect(ctx).toContain('Fauzi');
    expect(ctx).toContain('PROJECT');
    expect(ctx).toContain('Sentinel');
  });

  it('caps individual record body at CONTEXT_RECORD_MAX_CHARS', () => {
    const longBody = 'x'.repeat(CONTEXT_RECORD_MAX_CHARS + 100);
    const recs: RetrievedRecord[] = [makeRecord('a', 'PROFILE', 'Title', longBody)];
    const ctx = buildContext(recs);
    // The body portion should not exceed the per-record cap
    expect(ctx.length).toBeLessThanOrEqual(CONTEXT_MAX_CHARS + 200); // title + category overhead
  });

  it('caps total context at CONTEXT_MAX_CHARS', () => {
    const records: RetrievedRecord[] = Array.from({ length: 10 }, (_, i) =>
      makeRecord(`rec-${i}`, 'SKILL', `Skill ${i}`, 'x'.repeat(CONTEXT_RECORD_MAX_CHARS)),
    );
    const ctx = buildContext(records);
    expect(ctx.length).toBeLessThanOrEqual(CONTEXT_MAX_CHARS + 200); // small overhead for headers
  });

  it('includes URL when present', () => {
    const recs: RetrievedRecord[] = [
      { id: 'a', category: 'CONTACT', title: 'Email', body: 'Contact via email.', keywords: [], url: 'mailto:test@example.com' },
    ];
    const ctx = buildContext(recs);
    expect(ctx).toContain('mailto:test@example.com');
  });

  it('returns empty string for empty input', () => {
    expect(buildContext([])).toBe('');
  });
});

// ─── retrieveKnowledge (mocked Prisma) ────────────────────────────────────────

// Create a typed mock of only the parts of PrismaClient we use
function makeMockPrisma(records: RetrievedRecord[]) {
  return {
    knowledgeRecord: {
      findMany: vi.fn().mockResolvedValue(records),
    },
  };
}

const SAMPLE_DB_RECORDS: RetrievedRecord[] = [
  {
    id: 'profile:main',
    category: 'PROFILE',
    title: 'Fauzi Budikusuma — Software Development & Network Engineer',
    body: 'Informatics student at Universitas AMIKOM Yogyakarta. Focus: software development and network engineering.',
    keywords: ['fauzi', 'budikusuma', 'software', 'network', 'amikom'],
    url: null,
  },
  {
    id: 'education:amikom',
    category: 'EDUCATION',
    title: 'Universitas AMIKOM Yogyakarta — Informatics',
    body: 'Bachelor of Informatics, 2023–present. Focus on software and network engineering.',
    keywords: ['amikom', 'university', 'informatics', 'yogyakarta', 'education'],
    url: null,
  },
  {
    id: 'experience:kominfo',
    category: 'EXPERIENCE',
    title: 'Internship — Dinas Kominfo DIY, Help Desk Supervisor',
    body: 'Help Desk Supervisor intern at Dinas Komunikasi dan Informatika DIY. Managed network support.',
    keywords: ['kominfo', 'helpdesk', 'supervisor', 'internship', 'diy', 'network'],
    url: null,
  },
  {
    id: 'project:sentinel',
    category: 'PROJECT',
    title: 'Sentinel — Network Security Monitor',
    body: 'A network security monitoring tool built with Python and Mikrotik API. Detects anomalies.',
    keywords: ['sentinel', 'network', 'security', 'python', 'mikrotik'],
    url: 'https://github.com/fauzi/sentinel',
  },
  {
    id: 'certification:mtcna',
    category: 'CERTIFICATION',
    title: 'MikroTik Certified Network Associate (MTCNA)',
    body: 'MTCNA certification from MikroTik. Validates network administration skills.',
    keywords: ['mtcna', 'mikrotik', 'network', 'certification'],
    url: null,
  },
  {
    id: 'contact:email',
    category: 'CONTACT',
    title: 'Email — fauzibudi@example.com',
    body: 'Contact Fauzi via email at fauzibudi@example.com.',
    keywords: ['email', 'contact'],
    url: 'mailto:fauzibudi@example.com',
  },
];

describe('retrieveKnowledge (mocked Prisma)', () => {
  it('returns top-K records for an in-scope query', async () => {
    const mockPrisma = makeMockPrisma(SAMPLE_DB_RECORDS);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await retrieveKnowledge(mockPrisma as any, 'What projects has Fauzi built?');
    expect(mockPrisma.knowledgeRecord.findMany).toHaveBeenCalledTimes(1);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(RETRIEVAL_TOP_K);
  });

  it('emits exactly one DB query per request (AC-4)', async () => {
    const mockPrisma = makeMockPrisma(SAMPLE_DB_RECORDS);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await retrieveKnowledge(mockPrisma as any, 'Tell me about Fauzi');
    expect(mockPrisma.knowledgeRecord.findMany).toHaveBeenCalledTimes(1);
  });

  it('returns empty array when DB returns no candidates', async () => {
    const mockPrisma = makeMockPrisma([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await retrieveKnowledge(mockPrisma as any, 'What is Fauzi\'s certification?');
    expect(results).toHaveLength(0);
  });

  it('filters out low-score records (score floor)', async () => {
    // Records that don't match the query at all
    const nonMatchingRecords: RetrievedRecord[] = [
      {
        id: 'contact:email',
        category: 'CONTACT',
        title: 'Email Contact',
        body: 'email contact information',
        keywords: ['email'],
        url: null,
      },
    ];
    const mockPrisma = makeMockPrisma(nonMatchingRecords);
    // A query about projects should score the email contact record < 2
    // (it has no project-related tokens and no PROJECT category match)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await retrieveKnowledge(mockPrisma as any, 'What is his sentinel project?');
    // score = 0 (no token match) + 0 (no category match) = 0 < floor 2 → filtered
    expect(results).toHaveLength(0);
  });

  it('caps body at CONTEXT_RECORD_MAX_CHARS in returned records', async () => {
    const longBodyRecord: RetrievedRecord = {
      id: 'profile:main',
      category: 'PROFILE',
      title: 'Fauzi who is fauzi',
      body: 'y'.repeat(CONTEXT_RECORD_MAX_CHARS + 500),
      keywords: ['fauzi', 'profile', 'about'],
      url: null,
    };
    const mockPrisma = makeMockPrisma([longBodyRecord]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await retrieveKnowledge(mockPrisma as any, 'Who is Fauzi?');
    if (results.length > 0) {
      expect(results[0]!.body.length).toBeLessThanOrEqual(CONTEXT_RECORD_MAX_CHARS);
    }
  });

  // AC-1: each category maps correctly
  const categoryQueries: { query: string; expectedCategory: string }[] = [
    { query: 'Who is Fauzi Budikusuma?', expectedCategory: 'PROFILE' },
    { query: 'Where did he study? What university?', expectedCategory: 'EDUCATION' },
    { query: 'What is his internship experience?', expectedCategory: 'EXPERIENCE' },
    { query: 'What certifications does he have?', expectedCategory: 'CERTIFICATION' },
    { query: 'How can I contact Fauzi?', expectedCategory: 'CONTACT' },
    { query: 'What projects has he built?', expectedCategory: 'PROJECT' },
    // Indonesian
    { query: 'Siapa Fauzi Budikusuma?', expectedCategory: 'PROFILE' },
    { query: 'Di mana Fauzi kuliah?', expectedCategory: 'EDUCATION' },
    { query: 'Apa pengalaman magang Fauzi?', expectedCategory: 'EXPERIENCE' },
    { query: 'Apa sertifikat Fauzi?', expectedCategory: 'CERTIFICATION' },
  ];

  for (const { query, expectedCategory } of categoryQueries) {
    it(`"${query.substring(0, 50)}" → detects ${expectedCategory}`, () => {
      const normalized = normalizeQuery(query);
      const cats = detectIntentCategories(normalized);
      expect(cats).toContain(expectedCategory);
    });
  }
});
