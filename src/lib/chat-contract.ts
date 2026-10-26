/**
 * Chat API contract — shared by server (Route Handler) and client (chat widget).
 * All limits, status codes and fixed visitor copy are defined here.
 *
 * IMPORTANT: This file must NOT import server-only modules. It is used
 * by both the server Route Handler and client-side code.
 */
import { z } from 'zod';

// ─── Hard limits (OD-08 finalized in TASK-019, updated in TASK-038) ───────────────

/** Maximum character length of a visitor message (trimmed). */
export const MAX_MESSAGE_LENGTH = 300;

/** Maximum request body size in bytes (increased to 6 KB in TASK-038 for history support). */
export const MAX_BODY_BYTES = 6144; // 6 KB

/** Rate limit: maximum requests per rolling window per IP. */
export const RATE_LIMIT_MAX = 10;

/** Rate limit window in milliseconds (1 minute). */
export const RATE_LIMIT_WINDOW_MS = 60_000;

/** Maximum records returned by retrieval query (K). */
export const RETRIEVAL_TOP_K = 6;

/** Maximum candidate records fetched from DB before scoring. */
export const RETRIEVAL_TAKE = 20;

/** Maximum total characters sent to Gemini as context. */
export const CONTEXT_MAX_CHARS = 40_000;

/** Total serialized verified knowledge hard cap (Item 42 / SCHEMA.md). */
export const TOTAL_KNOWLEDGE_MAX_CHARS = 40_000;

/** Maximum characters per individual record body sent to Gemini. */
export const CONTEXT_RECORD_MAX_CHARS = 2_000;

/** Maximum output tokens from Gemini. */
export const GEMINI_MAX_OUTPUT_TOKENS = 512;

/** Gemini call temperature — low for factual determinism. */
export const GEMINI_TEMPERATURE = 0.2;

/** Gemini call timeout in milliseconds. */
export const GEMINI_TIMEOUT_MS = 8_000;

/** DB query timeout in milliseconds (app-level; DB role also has statement_timeout). */
export const DB_TIMEOUT_MS = 2_000;

/** Maximum answer length (characters) for sanitized model output. */
export const ANSWER_MAX_CHARS = 1_200;

// ─── Status codes ─────────────────────────────────────────────────────────────

export const ChatStatusSchema = z.enum([
  'ok',
  'answered',
  'no_data',
  'out_of_scope',
  'invalid_request',
  'too_large',
  'unsupported_media_type',
  'rate_limited',
  'unavailable',
  'error',
]);
export type ChatStatus = z.infer<typeof ChatStatusSchema>;

// ─── History & Request schemas ────────────────────────────────────────────────

export const ChatMessageRoleSchema = z.enum(['user', 'assistant']);
export type ChatMessageRole = z.infer<typeof ChatMessageRoleSchema>;

export const ChatHistoryItemSchema = z
  .object({
    role: ChatMessageRoleSchema,
    content: z
      .string()
      .trim()
      .min(1, 'History turn content must not be empty')
      .max(MAX_MESSAGE_LENGTH, `History turn content must be at most ${MAX_MESSAGE_LENGTH} characters`)
      .transform((s) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim()),
  })
  .strict();
export type ChatHistoryItem = z.infer<typeof ChatHistoryItemSchema>;

/**
 * Strict Zod schema for POST /api/chat request body.
 * .strict() rejects any unknown keys — the client can NEVER pass
 * model, table names, filters, SQL, or extra parameters (R-036).
 */
export const ChatRequestSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, 'Message must not be empty')
      .max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters`)
      .transform((s) =>
        // Strip control characters (keep printable + whitespace)
        s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim(),
      )
      .refine((s) => s.length >= 1, 'Message must not be empty after sanitization'),
    language: z.enum(['id', 'en']).default('en'),
    history: z.array(ChatHistoryItemSchema).max(6, 'At most 6 previous conversation turns allowed').optional(),
  })
  .strict(); // ← rejects unknown fields (AC-2, R-036)

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ─── Structured model output schema (R-031, Item 47) ──────────────────────────

export const StructuredChatOutputSchema = z.object({
  kind: z.enum(['answer', 'greeting', 'no_data']),
  answer: z.string(),
  citations: z.array(z.string()),
});
export type StructuredChatOutput = z.infer<typeof StructuredChatOutputSchema>;

// ─── Source record (verified portfolio reference) ─────────────────────────────

export const SourceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
});
export type Source = z.infer<typeof SourceSchema>;

// ─── Response shapes ──────────────────────────────────────────────────────────

export const ChatResponseSchema = z.union([
  // Grounded answer
  z.object({
    status: z.union([z.literal('ok'), z.literal('answered')]),
    answer: z.string(),
    reply: z.string().optional(),
    sources: z.array(SourceSchema),
  }),
  // Deterministic no-data or out-of-scope (no Gemini call)
  z.object({
    status: z.union([z.literal('no_data'), z.literal('out_of_scope')]),
    answer: z.string(),
  }),
  // Client error
  z.object({
    status: z.union([
      z.literal('invalid_request'),
      z.literal('too_large'),
      z.literal('unsupported_media_type'),
    ]),
    answer: z.string(),
  }),
  // Rate limited — includes retryAfterSeconds
  z.object({
    status: z.literal('rate_limited'),
    answer: z.string(),
    retryAfterSeconds: z.number().int().positive(),
  }),
  // Server errors
  z.object({
    status: z.union([z.literal('unavailable'), z.literal('error')]),
    answer: z.string(),
  }),
]);

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// ─── Fixed visitor copy (constants — never AI-generated, R-039) ───────────────

export const COPY_EN = {
  no_data:
    "I don't have that specific detail in Fauzi's verified portfolio records yet. However, I can tell you about his software & network engineering projects, 35 technical skills, internship experience at Dinas Kominfo DIY, education at Universitas AMIKOM Yogyakarta, verified certifications, or how to contact him directly via Gmail, LinkedIn, GitHub, Instagram, or Credly.",
  out_of_scope:
    "I can only answer questions about Fauzi's public portfolio, so I can't help with that request.",
  unavailable:
    'The assistant is temporarily unavailable. The rest of the portfolio works as usual — please try again later.',
  rate_limited: 'Too many questions in a short time. Please wait a moment and try again.',
  invalid_request: `Please enter a question between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
  error: 'Something went wrong. Please try again later.',
  too_large: 'Request body is too large.',
  unsupported_media_type: 'Only application/json requests are accepted.',
} as const satisfies Record<string, string>;

export const COPY_ID = {
  no_data:
    'Detail spesifik tersebut belum tercantum di dalam data portofolio terverifikasi Fauzi. Namun, Anda dapat bertanya mengenai proyek rekayasa perangkat lunak & jaringan, 35 keahlian teknis, pengalaman magang di Dinas Kominfo DIY, pendidikan di Universitas AMIKOM Yogyakarta, sertifikasi resmi, atau cara menghubungi Fauzi secara langsung melalui Gmail, LinkedIn, GitHub, Instagram, maupun Credly.',
  out_of_scope:
    'Saya hanya dapat menjawab pertanyaan seputar portofolio publik Fauzi, sehingga saya tidak dapat membantu permintaan tersebut.',
  unavailable:
    'Asisten untuk sementara waktu tidak tersedia. Bagian portofolio lainnya tetap berfungsi normal — silakan coba kembali beberapa saat lagi.',
  rate_limited: 'Terlalu banyak pertanyaan dalam waktu singkat. Harap tunggu sejenak dan coba lagi.',
  invalid_request: `Harap masukkan pertanyaan antara 1 hingga ${MAX_MESSAGE_LENGTH} karakter.`,
  error: 'Terjadi kendala teknis. Silakan coba kembali nanti.',
  too_large: 'Ukuran data permintaan terlalu besar.',
  unsupported_media_type: 'Hanya permintaan bertipe application/json yang diterima.',
} as const satisfies Record<string, string>;

export const COPY = COPY_EN;

export function getFixedCopy(key: keyof typeof COPY_EN, lang: 'en' | 'id' = 'en'): string {
  return lang === 'id' ? COPY_ID[key] : COPY_EN[key];
}
