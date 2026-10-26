import { describe, it, expect } from 'vitest';
import { composeLocalAnswer } from '@/lib/server/local-composer';
import { getFixedCopy, ANSWER_MAX_CHARS } from '@/lib/chat-contract';
import snapshot from '@/lib/server/knowledge.snapshot.json';
import { type CachedKnowledgeRecord } from '@/lib/server/knowledge-cache';

const records = snapshot as CachedKnowledgeRecord[];

describe('Tier 3 Local Composer (TASK-043 / CR-014)', () => {
  it('composes degraded answer for profile questions in English and Indonesian', () => {
    const en = composeLocalAnswer('Tell me about Fauzi background and profile', 'en', records);
    expect(en.status).toBe('degraded');
    expect(en.answer.length).toBeGreaterThan(50);
    expect(en.answer.length).toBeLessThanOrEqual(ANSWER_MAX_CHARS);
    expect(en.caption).toBe(getFixedCopy('degraded_caption', 'en'));
    expect(en.sources && en.sources.length).toBeGreaterThan(0);

    const id = composeLocalAnswer('Ceritakan tentang profil dan latar belakang Fauzi', 'id', records);
    expect(id.status).toBe('degraded');
    expect(id.answer.length).toBeGreaterThan(50);
    expect(id.answer.length).toBeLessThanOrEqual(ANSWER_MAX_CHARS);
    expect(id.caption).toBe(getFixedCopy('degraded_caption', 'id'));
    expect(id.sources && id.sources.length).toBeGreaterThan(0);
  });

  it('composes degraded answer for skills and technologies', () => {
    const res = composeLocalAnswer('What technologies and programming languages does he use?', 'en', records);
    expect(res.status).toBe('degraded');
    expect(res.answer).toMatch(/TypeScript|React|Next\.js|MikroTik|Linux/i);
    expect(res.caption).toBe(getFixedCopy('degraded_caption', 'en'));
  });

  it('composes degraded answer for projects', () => {
    const res = composeLocalAnswer('What projects has Fauzi built?', 'en', records);
    expect(res.status).toBe('degraded');
    expect(res.answer).toMatch(/Network|Monitoring|StackLab|Sentinel/i);
    expect(res.sources?.some((s) => s.slug.startsWith('project:'))).toBe(true);
  });

  it('composes degraded answer for certifications and internship', () => {
    const res = composeLocalAnswer('Tell me about his certifications and internship experience', 'en', records);
    expect(res.status).toBe('degraded');
    expect(res.answer).toMatch(/MTCNA|Cybersecurity|Kominfo/i);
    expect(res.sources?.some((s) => s.slug.startsWith('certification:') || s.slug.startsWith('experience:'))).toBe(true);
  });

  it('composes degraded answer for contact info', () => {
    const res = composeLocalAnswer('How to email or contact Fauzi?', 'en', records);
    expect(res.status).toBe('degraded');
    expect(res.answer).toMatch(/budikusumafauzi@gmail\.com|LinkedIn|GitHub/i);
  });

  it('respects the 1,200 character budget (ANSWER_MAX_CHARS)', () => {
    const longQueries = [
      'Tell me everything about all projects and all skills and all certifications and education and background',
      'Ceritakan semua keahlian, sertifikasi, proyek, dan kontak fauzi secara lengkap',
    ];

    for (const q of longQueries) {
      const res = composeLocalAnswer(q, 'en', records);
      expect(res.answer.length).toBeLessThanOrEqual(ANSWER_MAX_CHARS);
    }
  });

  it('returns status: no_data with helpful copy on unmatchable nonsense query', () => {
    const res = composeLocalAnswer('qwertyuiop asdfghjkl zxcvbnm 1234567890', 'en', records);
    expect(res.status).toBe('no_data');
    expect(res.answer).toBe(getFixedCopy('no_data', 'en'));
    expect(res.caption).toBeUndefined();
    expect(res.sources).toBeUndefined();

    const resId = composeLocalAnswer('qwertyuiop asdfghjkl zxcvbnm 1234567890', 'id', records);
    expect(resId.status).toBe('no_data');
    expect(resId.answer).toBe(getFixedCopy('no_data', 'id'));
  });

  it('strictly adheres to verified records with no hallucination (I-5 / R-010 / R-030)', () => {
    const res = composeLocalAnswer('Tell me about MikroTik routing and VLAN experience', 'en', records);
    expect(res.status).toBe('degraded');
    // Ensure all returned sources match an existing record in the snapshot
    for (const source of res.sources || []) {
      const found = records.find((r) => r.id === source.slug);
      expect(found).toBeDefined();
    }
  });
});
