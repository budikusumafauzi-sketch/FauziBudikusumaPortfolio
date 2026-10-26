import 'server-only';
import { type PrismaClient } from '@prisma/client';
import { prisma } from './db';
import {
  getOrUpdateKnowledgeCache,
  type CachedKnowledgeRecord,
} from './knowledge-cache';
import { TOTAL_KNOWLEDGE_MAX_CHARS } from '@/lib/chat-contract';

export interface LoadedKnowledge {
  records: CachedKnowledgeRecord[];
  contextString: string;
  validIds: Set<string>;
  charCount: number;
  dbMs: number;
  cacheHit: boolean;
  source: 'cache' | 'db' | 'snapshot';
  stale?: boolean;
}

/**
 * Formats a single verified record compactly:
 * [id] CATEGORY | title
 * body
 * URL: url (optional)
 */
export function formatRecord(record: CachedKnowledgeRecord): string {
  const parts = [`[${record.id}] ${record.category} | ${record.title}`, record.body];
  if (record.url) {
    parts.push(`URL: ${record.url}`);
  }
  return parts.join('\n');
}

/**
 * Builds the complete serialized verified knowledge context string.
 * Strictly enforces the 40,000-character hard cap (Item 42 / SCHEMA.md).
 */
export function buildFullKnowledgeContext(
  records: CachedKnowledgeRecord[],
): { contextString: string; validIds: Set<string>; charCount: number } {
  const validIds = new Set<string>();
  const blocks: string[] = [];

  for (const rec of records) {
    validIds.add(rec.id);
    blocks.push(formatRecord(rec));
  }

  const contextString = blocks.join('\n\n---\n\n');
  const charCount = contextString.length;

  if (charCount > TOTAL_KNOWLEDGE_MAX_CHARS) {
    throw new Error(
      `Serialized verified knowledge context (${charCount} chars) exceeds the hard limit of ${TOTAL_KNOWLEDGE_MAX_CHARS} characters.`,
    );
  }

  return { contextString, validIds, charCount };
}

/**
 * Loads the complete verified portfolio knowledge set backed by in-memory cache (12-hour TTL, SWR, snapshot fallback).
 * Replaces keyword-matching retrieval (Item 41, ADR-013, ADR-015).
 */
export async function loadKnowledge(
  client: PrismaClient = prisma,
): Promise<LoadedKnowledge> {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const enableCacheInTest = Boolean(
    (globalThis as unknown as { __ENABLE_TEST_CACHE__?: boolean }).__ENABLE_TEST_CACHE__,
  );

  let records: CachedKnowledgeRecord[];
  let dbMs = 0;
  let cacheHit = false;
  let source: 'cache' | 'db' | 'snapshot' = 'db';
  let stale = false;

  if (isTestEnv && !enableCacheInTest) {
    try {
      const start = Date.now();
      const rows = await client.knowledgeRecord.findMany({
        select: {
          id: true,
          category: true,
          title: true,
          body: true,
          keywords: true,
          url: true,
          position: true,
        },
        orderBy: { id: 'asc' },
      });
      dbMs = Date.now() - start;
      records = rows;
      source = 'db';
    } catch {
      // Invariant I-1: If database query times out or fails in test, fall back to snapshot
      const cacheRes = await getOrUpdateKnowledgeCache(client);
      records = cacheRes.records;
      dbMs = cacheRes.dbMs;
      source = cacheRes.source ?? 'snapshot';
    }
  } else {
    const cacheRes = await getOrUpdateKnowledgeCache(client);
    records = cacheRes.records;
    dbMs = cacheRes.dbMs;
    cacheHit = cacheRes.cacheHit ?? false;
    source = cacheRes.source ?? (cacheHit ? 'cache' : 'db');
    stale = cacheRes.stale ?? false;
  }

  const { contextString, validIds, charCount } = buildFullKnowledgeContext(records);

  return {
    records,
    contextString,
    validIds,
    charCount,
    dbMs,
    cacheHit,
    source,
    stale,
  };
}
