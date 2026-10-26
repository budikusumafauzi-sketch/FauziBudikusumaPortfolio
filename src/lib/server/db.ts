import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Returns a lazy singleton PrismaClient instance.
 * Instantiation occurs on first request invocation, preventing build-time DB evaluation.
 */
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = new PrismaClient({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Cleanly intercept closed-connection events to prevent raw unformatted dumps
    client.$on('error', (e: { message?: string; target?: string }) => {
      const msg = e.message ?? '';
      if (msg.includes('Closed') || msg.includes('kind: Closed') || msg.includes('Connection closed')) {
        console.warn(`[CHAT:DB] chat.db_closed_connection_recovered [target: ${e.target ?? 'pg_connection'}]`);
      } else {
        console.error(`[CHAT:DB] chat.db_error [target: ${e.target ?? 'unknown'}]`);
      }
    });

    globalForPrisma.prisma = client;
  }
  return globalForPrisma.prisma;
}

/**
 * Proxy export for ergonomic `prisma.<model>` access with lazy initialization.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
