/**
 * In-memory sliding-window rate limiter.
 *
 * Security notes:
 * - IP is trusted from headers only in production/documented hosting
 *   environments (ARCHITECTURE.md §9; TASK-026 verifies this).
 * - Locally / untrusted context: uses a fixed fallback key so the
 *   limiter is still exercised but does not rely on spoofable headers.
 * - The map is bounded to prevent unbounded memory growth.
 * - Rate limiting is best-effort (in-memory, per-instance; resets on cold
 *   start — see ADR-009). Other bounds (length, timeout, DB limit) compensate.
 *
 * @module server-only — imported only in Route Handlers.
 */
import 'server-only';

import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/lib/chat-contract';

/** Maximum number of distinct IPs tracked simultaneously. */
const MAX_MAP_SIZE = 5_000;

interface WindowEntry {
  /** Timestamps (ms) of recent requests within the window. */
  timestamps: number[];
}

// Module-level state — shared across requests within one process instance.
let store = new Map<string, WindowEntry>();

/**
 * Derive a client identifier from request headers.
 *
 * Trust model: In a production Next.js deployment behind a reverse proxy
 * (e.g. Vercel), `x-forwarded-for` is injected by the platform and is
 * reliable. Locally or in unknown environments we fall back to a fixed
 * placeholder so the limiter remains deterministic in tests.
 *
 * NEVER trust arbitrary client-supplied forwarding headers beyond the first
 * value in the header (ARCHITECTURE.md §9).
 */
export function getClientKey(headers: Headers): string {
  // In production: trust only the first entry of x-forwarded-for (injected by proxy).
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp && firstIp.length > 0 && firstIp.length < 128) {
      return `ip:${firstIp}`;
    }
  }
  const realIp = headers.get('x-real-ip');
  if (realIp && realIp.trim().length > 0 && realIp.trim().length < 128) {
    return `ip:${realIp.trim()}`;
  }
  // Fallback: all requests share this key locally (safe — limits local testing per ADR-009).
  return 'ip:unknown';
}

export interface RateLimitResult {
  /** Whether the request is allowed. */
  allowed: boolean;
  /** Seconds to wait before the next request is allowed (only set when denied). */
  retryAfterSeconds?: number;
}

/**
 * Check and update the rate limit for the given client key.
 *
 * Uses a sliding-window algorithm: keeps a list of timestamps within the
 * last RATE_LIMIT_WINDOW_MS milliseconds per IP.
 */
export function checkRateLimit(
  clientKey: string,
  now = Date.now(),
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): RateLimitResult {
  const cutoff = now - windowMs;

  // Bounded map: evict oldest entry when full (FIFO approximation).
  if (!store.has(clientKey) && store.size >= MAX_MAP_SIZE) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) {
      store.delete(oldestKey);
    }
  }

  const entry = store.get(clientKey) ?? { timestamps: [] };

  // Prune expired timestamps.
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= max) {
    // Oldest timestamp in window — tells the client when the window clears.
    const oldest = entry.timestamps[0]!;
    const retryAfterMs = oldest + windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1_000));
    store.set(clientKey, entry);
    return { allowed: false, retryAfterSeconds };
  }

  // Allow and record timestamp.
  entry.timestamps.push(now);
  store.set(clientKey, entry);
  return { allowed: true };
}

/**
 * Reset the rate limit store. Exposed for deterministic unit testing only.
 * Do NOT call from production code paths.
 */
export function resetRateLimitStore(): void {
  store = new Map<string, WindowEntry>();
}

/**
 * Returns the current store size (number of tracked IPs).
 * Exposed for unit testing.
 */
export function getRateLimitStoreSize(): number {
  return store.size;
}
