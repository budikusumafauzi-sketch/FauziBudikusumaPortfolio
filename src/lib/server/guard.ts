/**
 * Deterministic scope guard — pre-retrieval, pre-Gemini.
 *
 * Catches messages that are obviously out-of-scope, hostile, or private-data
 * probes BEFORE any database query or AI call. This is a cheap first filter —
 * the real security boundaries are the strict prompt contract, read-only DB
 * role, and absence of Gemini tools (ARCHITECTURE.md §8.1).
 *
 * All patterns are tested deterministically. No Gemini calls occur when this
 * guard returns true (R-031).
 *
 * @module server-only — imported only in Route Handlers.
 */
import 'server-only';

// ─── Pattern lists ─────────────────────────────────────────────────────────────

/**
 * Prompt-injection / jailbreak / system-override phrases.
 * Matched case-insensitively after normalizing the message.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|rules?|prompts?)/i,
  /forget\s+(all\s+)?(instructions?|rules?|prompts?|everything)/i,
  /abaikan\s+(semua\s+)?(instruksi|aturan|perintah|petunjuk)/i,
  /lupakan\s+(semua\s+)?(instruksi|aturan|perintah|semuanya)/i,
  /you\s+are\s+now\s+(DAN|GPT|a\s+different|no\s+longer)/i,
  /kamu\s+sekarang\s+adalah/i,
  /\bDAN\b/,
  /jailbreak/i,
  /system\s+prompt/i,
  /prompt\s+sistem/i,
  /developer\s+message/i,
  /disregard\s+(previous|prior|all)\s+(instructions?|rules?)/i,
  /act\s+as\s+(if\s+you\s+(are|were)\s+|an?\s+)(unrestricted|uncensored|evil|different)/i,
  /bertindak(lah)?\s+sebagai/i,
  /pretend\s+(you\s+are|to\s+be)\s+(not|a\s+different)/i,
  /pura-?pura\s+(menjadi|sebagai)/i,
  /override\s+(your\s+)?(instructions?|rules?|guidelines?)/i,
  /\bdo\s+anything\s+now\b/i,
  /(repeat|show|print|reveal|tell)\s+(me\s+)?(your\s+|the\s+)?(exact\s+|full\s+|complete\s+)?system/i,
  /(tampilkan|bocorkan|sebutkan|tuliskan)\s+(prompt|instruksi|aturan)\s+sistem/i,
  /\bbase64\b/i,
  /roleplay\s+as/i,
  /bermain\s+peran\s+sebagai/i,
  /simulate\s+(being|a)/i,
  /simulasikan\s+(menjadi|sebagai)/i,
  /act\s+if\s+(you\s+were|i\s+were)\s+(uncensored|unrestricted|free|jailbroken)/i,
  /uncensored\s+mode/i,
  /mode\s+tanpa\s+sensor/i,
];

/** Secret / credential exfiltration attempts. */
const SECRET_PATTERNS: RegExp[] = [
  /GEMINI_API_KEY/i,
  /DATABASE_URL/i,
  /MIGRATION_DATABASE_URL/i,
  /api[_\s]?key/i,
  /kunci\s+api/i,
  /\bpassword\b/i,
  /kata\s+sandi/i,
  /kredensial/i,
  /connection\s+string/i,
  /\.env/i,
  /process\.env/i,
  /\brahasia\b/i,
];

/** Database mutation / code execution attempts. */
const MUTATION_PATTERNS: RegExp[] = [
  /\bDROP\s+TABLE\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bUPDATE\s+\w+\s+SET\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bTRUNCATE\s+TABLE\b/i,
  /\bCREATE\s+TABLE\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bSELECT\s+.*\bFROM\b/i, // SQL select injections
  /\bEXEC(UTE)?\s*\(/i,
  /;\s*--/, // SQL comment-escape pattern
  /or\s+['"]?1['"]?\s*=\s*['"]?1/i, // classic SQL injection tautology
  /\bxp_cmdshell\b/i,
  /add\s+a\s+new\s+(project|record|entry)\s+to\s+fauzi/i,
  /tambah(kan)?\s+(proyek|catatan|data)\s+baru/i,
  /edit\s+(the\s+)?website/i,
  /ubah\s+(situs|website|database|basis\s+data)/i,
  /update\s+(the\s+)?portfolio/i,
  /perbarui\s+portofolio/i,
  /modify\s+(the\s+)?database/i,
  /hapus\s+(data|tabel|basis\s+data)/i,
];

/** Private / unverified personal data probes. */
const PRIVATE_DATA_PATTERNS: RegExp[] = [
  /\b(home|house|residential)\s+address/i,
  /\balamat\s+(rumah|tinggal|pribadi)\b/i,
  /\bstreet\s+address/i,
  /\bphone\s+number\b/i,
  /\bwhatsapp\s+number\b/i,
  /\bhandphone\b/i,
  /\bnomor\s+(hp|wa|handphone|telepon|ponsel)\b/i,
  /\bno\s+(hp|wa|telp)\b/i,
  /\bNIK\b/,
  /\bnational\s+id\b/i,
  /\bktp\b/i,
  /\bagama\b/i,
  /\breligion\b/i,
  /\bfamily\s+members?\b/i,
  /\banggota\s+keluarga\b/i,
  /\bbank\s+account\b/i,
  /\bnomor\s+rekening\b/i,
  /\bsalary\s+expectation\b/i,
  /\brekening\b/i,
  /\bgaji\b/i,
  /\bpenghasilan\b/i,
  /\bpassport\s+number\b/i,
  /\bnomor\s+paspor\b/i,
];

/** Clearly off-topic general queries. */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\brecipe\b/i,
  /\bcooking\b/i,
  /\bweather\b.*\bin\b/i,
  /\bhoroscope\b/i,
  /\bhoroskop\b/i,
  /\bwho\s+will\s+win\b/i,
  /\belection\b/i,
  /\bstocks?\s+price\b/i,
  /\bcrypto\b.*\bprice\b/i,
  /\bwrite\s+.*(essay|article|story|fiction|poem)\b/i,
  /\bfiction\b/i,
  /\btranslate\s+this\b/i,
  /\bmath\s+homework\b/i,
  /\bcoding\s+homework\b/i,
  /\bmedical\s+advice\b/i,
  /\bsaran\s+kesehatan\b/i,
  /\bhukum\b.*\bnasional\b/i,
  /\bfinancial\s+advice\b/i,
  /\bberita\s+(terkini|terbaru)\b/i, // "latest news" in Indonesian
  /\bbreaking\s+news\b/i,
  /\blatest\s+news\b/i,
];

// All patterns grouped for ordered evaluation.
const ALL_PATTERN_GROUPS: { label: string; patterns: RegExp[] }[] = [
  { label: 'injection', patterns: INJECTION_PATTERNS },
  { label: 'secret', patterns: SECRET_PATTERNS },
  { label: 'mutation', patterns: MUTATION_PATTERNS },
  { label: 'private_data', patterns: PRIVATE_DATA_PATTERNS },
  { label: 'off_topic', patterns: OFF_TOPIC_PATTERNS },
];

export interface GuardResult {
  /** Whether the message was caught by the guard. */
  blocked: boolean;
  /** Short log code (e.g. 'chat.guard.injection'). No message content. */
  logCode?: string;
}

/**
 * Evaluate a normalized (trimmed, lower-cased) visitor message against the
 * deterministic scope guard.
 *
 * Returns `{ blocked: true, logCode }` if caught, or `{ blocked: false }`.
 * Never calls Gemini or touches the database (R-031).
 *
 * @param message Raw or normalized message string.
 */
export function checkGuard(message: string): GuardResult {
  // Normalize for pattern matching: Unicode NFKC, lowercase, collapse whitespace.
  const normalized = message
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  for (const { label, patterns } of ALL_PATTERN_GROUPS) {
    for (const pattern of patterns) {
      if (pattern.test(normalized) || pattern.test(message)) {
        return { blocked: true, logCode: `chat.guard.${label}` };
      }
    }
  }

  return { blocked: false };
}
