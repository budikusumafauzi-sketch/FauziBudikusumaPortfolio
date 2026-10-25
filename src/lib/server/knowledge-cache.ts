import 'server-only';
import { type PrismaClient } from '@prisma/client';
import { prisma } from './db';

export interface CachedKnowledgeRecord {
  id: string;
  category: string;
  title: string;
  body: string;
  keywords: string[];
  url: string | null;
  position: number;
}

export interface KnowledgeCacheResult {
  records: CachedKnowledgeRecord[];
  cacheHit: boolean;
  dbMs: number;
  stale?: boolean;
}

/** 10 minutes cache TTL in milliseconds */
export const KNOWLEDGE_CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheState {
  records: CachedKnowledgeRecord[] | null;
  cachedAt: number;
}

const globalForCache = globalThis as unknown as {
  __knowledgeCacheState?: CacheState;
};

function getCacheState(): CacheState {
  if (!globalForCache.__knowledgeCacheState) {
    globalForCache.__knowledgeCacheState = {
      records: null,
      cachedAt: 0,
    };
  }
  return globalForCache.__knowledgeCacheState;
}

/**
 * Executes a resilient database query to fetch all verified knowledge records.
 * Supports at most ONE retry for transient connection errors (kind: Closed) per R-034.
 */
async function fetchRecordsFromDatabase(
  client: PrismaClient,
): Promise<CachedKnowledgeRecord[]> {
  let attempt = 0;
  const maxAttempts = 2; // initial + at most 1 retry per R-034

  while (attempt < maxAttempts) {
    attempt++;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = await (client as any).knowledgeRecord.findMany({
        orderBy: [{ category: 'asc' }, { position: 'asc' }],
        select: {
          id: true,
          category: true,
          title: true,
          body: true,
          keywords: true,
          url: true,
          position: true,
        },
      });

      return rows as CachedKnowledgeRecord[];
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isClosedConnection =
        errMsg.includes('Closed') ||
        errMsg.includes('kind: Closed') ||
        errMsg.includes('Connection terminated') ||
        errMsg.includes('ECONNRESET');

      if (attempt < maxAttempts && isClosedConnection) {
        if (process.env.NODE_ENV !== 'test') {
          console.warn('chat.db_reconnect_retry');
        }
        // Small pause before retry
        await new Promise((resolve) => setTimeout(resolve, 150));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Database query exhausted retries');
}

/**
 * Retrieves knowledge records from in-memory cache (10-minute TTL).
 * If expired or cold, fetches from PostgreSQL and updates the cache.
 * If database query fails but existing cached records exist, serves stale records (stale-while-error).
 */
export async function getOrUpdateKnowledgeCache(
  client: PrismaClient = prisma,
): Promise<KnowledgeCacheResult> {
  const state = getCacheState();
  const now = Date.now();
  const isFresh = state.records !== null && now - state.cachedAt < KNOWLEDGE_CACHE_TTL_MS;

  if (isFresh && state.records) {
    return {
      records: state.records,
      cacheHit: true,
      dbMs: 0,
    };
  }

  const startDb = Date.now();
  try {
    const fetched = await fetchRecordsFromDatabase(client);
    state.records = fetched;
    state.cachedAt = Date.now();
    const dbMs = Date.now() - startDb;

    return {
      records: fetched,
      cacheHit: false,
      dbMs,
    };
  } catch (err: unknown) {
    const dbMs = Date.now() - startDb;

    // Stale-While-Error resilience: Serve existing cached records if available
    if (state.records && state.records.length > 0) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('chat.db_stale_fallback');
      }
      return {
        records: state.records,
        cacheHit: true,
        dbMs,
        stale: true,
      };
    }

    // Cold failure with no stale data available
    throw err;
  }
}

/**
 * Lightweight warm-up when visitor opens the chat panel (Item 36, R-037).
 * Pre-populates the in-memory cache and warms Neon DB connection.
 * Strictly NEVER calls Gemini (0 AI calls, 0 cost).
 */
export async function warmKnowledgeCache(
  client: PrismaClient = prisma,
): Promise<{ warmed: boolean; dbMs: number; count: number }> {
  try {
    const res = await getOrUpdateKnowledgeCache(client);
    return {
      warmed: true,
      dbMs: res.dbMs,
      count: res.records.length,
    };
  } catch {
    return { warmed: false, dbMs: 0, count: 0 };
  }
}

/**
 * For test harness: Invalidate or reset cache state.
 */
export function resetKnowledgeCacheForTesting(
  initialRecords: CachedKnowledgeRecord[] | null = null,
  cachedAt = 0,
): void {
  const state = getCacheState();
  state.records = initialRecords;
  state.cachedAt = cachedAt;
}
