import 'server-only';
import { type PrismaClient } from '@prisma/client';
import { prisma } from './db';

import snapshotRecords from './knowledge.snapshot.json';

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
  source: 'cache' | 'db' | 'snapshot';
  dbMs: number;
  stale?: boolean;
}

/** 12 hours cache TTL in milliseconds (ADR-015) */
export const KNOWLEDGE_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

/** Cold instance database load race timeout (ADR-015) */
export const COLD_DB_RACE_TIMEOUT_MS = 600;

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
 * Retrieves knowledge records from in-memory cache (12-hour TTL).
 * If in memory (fresh or stale), serves immediately (0ms db wait). Expired records trigger async background refresh.
 * If cold, races DB against 600ms timer; falls back to build-time snapshot if DB is sleeping or closed (ADR-015).
 */
export async function getOrUpdateKnowledgeCache(
  client: PrismaClient = prisma,
): Promise<KnowledgeCacheResult> {
  const state = getCacheState();
  const now = Date.now();

  // 1. SWR Cache Hit (Fresh or Stale): Serve in-memory immediately without waiting on DB
  if (state.records && state.records.length > 0) {
    const isFresh = now - state.cachedAt < KNOWLEDGE_CACHE_TTL_MS;
    if (!isFresh) {
      // Asynchronous background revalidation (non-blocking)
      fetchRecordsFromDatabase(client)
        .then((fetched) => {
          state.records = fetched;
          state.cachedAt = Date.now();
        })
        .catch(() => {
          // Keep serving stale data
        });
    }

    return {
      records: state.records,
      cacheHit: true,
      source: 'cache',
      dbMs: 0,
      stale: !isFresh,
    };
  }

  // 2. Cold Cache: Race PostgreSQL against short 600ms timer
  const startDb = Date.now();
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) => {
    timer = setTimeout(() => resolve({ isTimeout: true }), COLD_DB_RACE_TIMEOUT_MS);
  });

  const dbPromise = fetchRecordsFromDatabase(client)
    .then((fetched) => ({ isTimeout: false as const, records: fetched, error: null }))
    .catch((err: unknown) => ({ isTimeout: false as const, records: null, error: err }));

  const outcome = await Promise.race([dbPromise, timeoutPromise]);
  clearTimeout(timer);

  if (!outcome.isTimeout && outcome.records && outcome.records.length > 0) {
    state.records = outcome.records;
    state.cachedAt = Date.now();
    return {
      records: outcome.records,
      cacheHit: false,
      source: 'db',
      dbMs: Date.now() - startDb,
    };
  }

  // 3. 600ms timer fired first OR DB errored -> Immediately serve build-time snapshot
  const snapshot = snapshotRecords as CachedKnowledgeRecord[];
  state.records = snapshot;
  state.cachedAt = Date.now();

  // Let background DB fetch finish asynchronously to populate cache once awake
  dbPromise.then((res) => {
    if (!res.isTimeout && res.records && res.records.length > 0) {
      state.records = res.records;
      state.cachedAt = Date.now();
    }
  }).catch(() => {});

  return {
    records: snapshot,
    cacheHit: false,
    source: 'snapshot',
    dbMs: Date.now() - startDb,
  };
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
