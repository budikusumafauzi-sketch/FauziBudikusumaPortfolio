import 'server-only';
import { z } from 'zod';

const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('models/gemini-3.8-flash'),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

export interface EnvValidationResult {
  valid: boolean;
  env?: ServerEnv;
  error?: string;
}

/**
 * Validates server environment variables lazily at request time.
 * Never called at build time, ensuring static build resilience.
 */
export function getServerEnv(): EnvValidationResult {
  const env = process.env;
  const parsed = ServerEnvSchema.safeParse({
    DATABASE_URL: env['DATABASE_URL'],
    GEMINI_API_KEY: env['GEMINI_API_KEY'],
    GEMINI_MODEL: env['GEMINI_MODEL'] || 'models/gemini-3.8-flash',
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const missingKey = issues.some((i) => i.path.includes('GEMINI_API_KEY'));
    const missingDb = issues.some((i) => i.path.includes('DATABASE_URL'));

    if (missingKey) {
      return { valid: false, error: 'chat.no_key' };
    }
    if (missingDb) {
      return { valid: false, error: 'chat.no_db' };
    }
    return { valid: false, error: 'chat.env_invalid' };
  }

  return { valid: true, env: parsed.data };
}
