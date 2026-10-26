import 'server-only';
import { type ChatResponse } from '@/lib/chat-contract';

export interface CachedAnswerEntry {
  response: ChatResponse;
  cachedAt: number;
}

export const ANSWER_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
export const ANSWER_CACHE_MAX_ENTRIES = 200; // LRU cap

class AnswerCache {
  private cache = new Map<string, CachedAnswerEntry>();

  public normalizeKey(language: string, message: string): string {
    const lang = (language || 'en').toLowerCase().trim();
    const msg = message
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s]/gu, '') // remove punctuation
      .replace(/\s+/g, ' '); // normalize spaces
    return `${lang}::${msg}`;
  }

  public get(language: string, message: string): ChatResponse | null {
    const key = this.normalizeKey(language, message);
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.cachedAt > ANSWER_CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.response;
  }

  public set(language: string, message: string, response: ChatResponse): void {
    // Strictly cache only validated answered or no_data responses
    if (response.status !== 'answered' && response.status !== 'no_data') {
      return;
    }

    const key = this.normalizeKey(language, message);

    // Enforce max entries via oldest eviction
    if (this.cache.size >= ANSWER_CACHE_MAX_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      response,
      cachedAt: Date.now(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

const globalForAnswerCache = globalThis as unknown as {
  __answerCacheInstance?: AnswerCache;
};

export function getAnswerCache(): AnswerCache {
  if (!globalForAnswerCache.__answerCacheInstance) {
    globalForAnswerCache.__answerCacheInstance = new AnswerCache();
  }
  return globalForAnswerCache.__answerCacheInstance;
}

export const answerCache = getAnswerCache();
