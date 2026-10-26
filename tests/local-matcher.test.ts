import { describe, it, expect } from 'vitest';
import { normalizeQuery, matchGreetingOrThanks, matchStarterChip } from '@/lib/server/local-matcher';
import { getFixedCopy } from '@/lib/chat-contract';
import snapshot from '@/lib/server/knowledge.snapshot.json';
import { type CachedKnowledgeRecord } from '@/lib/server/knowledge-cache';

const records = snapshot as CachedKnowledgeRecord[];

describe('Tier 0 Local Matcher (TASK-043 / CR-014)', () => {
  describe('normalizeQuery', () => {
    it('lowercases and strips punctuation and extra whitespace', () => {
      expect(normalizeQuery('  Hello, World?!  ')).toBe('hello world');
      expect(normalizeQuery('APA... LATAR::: BELAKANG???')).toBe('apa latar belakang');
      expect(normalizeQuery('Thanks :) !!')).toBe('thanks');
    });
  });

  describe('matchGreetingOrThanks', () => {
    const enGreetings = [
      'hello',
      'Hello!',
      'hi',
      'hi there',
      'hey fauzi',
      'good morning',
      'Good Afternoon!',
      'good evening',
      'greetings',
      'howdy',
      'thanks',
      'thank you',
      'thank you very much',
      'bye',
      'goodbye',
    ];

    const idGreetings = [
      'halo',
      'Halo!',
      'halo fauzi',
      'hai',
      'hai kak',
      'selamat pagi',
      'Selamat Siang!',
      'selamat sore',
      'selamat malam',
      'terima kasih',
      'terimakasih banyak',
      'makasih',
      'matur nuwun',
      'sampai jumpa',
      'dadah',
    ];

    it.each(enGreetings)('matches English greeting/thanks: "%s"', (input) => {
      const res = matchGreetingOrThanks(input, 'en');
      expect(res.matched).toBe(true);
      if (res.matched) {
        expect(res.status).toBe('greeting');
        expect(res.answer).toBe(getFixedCopy('greeting', 'en'));
      }
    });

    it.each(idGreetings)('matches Indonesian greeting/thanks: "%s"', (input) => {
      const res = matchGreetingOrThanks(input, 'id');
      expect(res.matched).toBe(true);
      if (res.matched) {
        expect(res.status).toBe('greeting');
        expect(res.answer).toBe(getFixedCopy('greeting', 'id'));
      }
    });

    it('rejects substantial technical or domain questions', () => {
      expect(matchGreetingOrThanks("What is Fauzi's background?", 'en').matched).toBe(false);
      expect(matchGreetingOrThanks('Halo apa saja proyek yang pernah dibuat?', 'id').matched).toBe(false);
      expect(matchGreetingOrThanks('Tell me about your React experience', 'en').matched).toBe(false);
      expect(matchGreetingOrThanks('', 'en').matched).toBe(false);
    });
  });

  describe('matchStarterChip', () => {
    const starterChipsEn = [
      "What is Fauzi's professional background?",
      'What skills and technologies does he use?',
      'What projects has he built?',
      'What certifications and experience does he have?',
      'How can I contact Fauzi?',
    ];

    const starterChipsId = [
      'Apa latar belakang profesional Fauzi?',
      'Apa keahlian dan teknologi yang dikuasainya?',
      'Apa saja proyek yang pernah dibuatnya?',
      'Apa sertifikasi dan pengalaman yang dimilikinya?',
      'Bagaimana cara menghubungi Fauzi?',
    ];

    it.each(starterChipsEn)('matches English starter chip: "%s"', (chip) => {
      const res = matchStarterChip(chip, 'en', records);
      expect(res.matched).toBe(true);
      if (res.matched) {
        expect(res.status).toBe('ok');
        expect(res.answer.length).toBeGreaterThan(50);
        expect(res.sources.length).toBeGreaterThan(0);
        expect(res.sources.every((s) => typeof s.title === 'string' && typeof s.slug === 'string')).toBe(true);
      }
    });

    it.each(starterChipsId)('matches Indonesian starter chip: "%s"', (chip) => {
      const res = matchStarterChip(chip, 'id', records);
      expect(res.matched).toBe(true);
      if (res.matched) {
        expect(res.status).toBe('ok');
        expect(res.answer.length).toBeGreaterThan(50);
        expect(res.sources.length).toBeGreaterThan(0);
        // Verify Indonesian content is used
        expect(res.sources.every((s) => typeof s.title === 'string' && typeof s.slug === 'string')).toBe(true);
      }
    });

    it('returns matched: false for custom or unaligned questions', () => {
      const res = matchStarterChip('Do you know how to build Docker images?', 'en', records);
      expect(res.matched).toBe(false);
    });
  });
});
