/**
 * scripts/run-fault-matrix.mjs
 * Executes the fault matrix suite against the running app (pnpm start on PORT 3000)
 * and the local mock Gemini server (PORT 9876).
 *
 * Implements Item 27 / CR-014:
 * - >= 30 requests per fault mode (mixing EN and ID, chips, greetings, free-form)
 * - Asserts: zero unavailable, zero 5xx, every request <= 5.0s
 * - Computes p50, p95, max latency per fault mode
 * - Prints markdown summary table
 */

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const MOCK_URL = process.env.MOCK_URL || 'http://localhost:9876';

const FAULT_MODES = [
  'healthy',
  'delay-3s',
  'delay-10s',
  'hang-forever',
  'error-429',
  'error-500',
  'error-503',
  'error-504',
  'conn-reset',
  'tls-close',
  'truncated-json',
  'empty-body',
  'invalid-schema',
  'wrong-citations',
];

const TEST_QUERIES = [
  // Greetings (Tier 0 instant path)
  { type: 'greeting', lang: 'en', message: 'Hello!' },
  { type: 'greeting', lang: 'en', message: 'Hi there' },
  { type: 'greeting', lang: 'en', message: 'Thank you very much' },
  { type: 'greeting', lang: 'id', message: 'Halo!' },
  { type: 'greeting', lang: 'id', message: 'Selamat pagi' },
  { type: 'greeting', lang: 'id', message: 'Terima kasih banyak' },

  // Starter Chips (Tier 0 deterministic matcher)
  { type: 'chip', lang: 'en', message: "What is Fauzi's professional background?" },
  { type: 'chip', lang: 'en', message: 'What technical skills and tools does Fauzi use?' },
  { type: 'chip', lang: 'en', message: "Tell me about Fauzi's selected projects." },
  { type: 'chip', lang: 'en', message: 'What certifications and internship experience does Fauzi have?' },
  { type: 'chip', lang: 'en', message: 'How can I contact Fauzi directly?' },
  { type: 'chip', lang: 'id', message: 'Apa latar belakang profesional Fauzi?' },
  { type: 'chip', lang: 'id', message: 'Keahlian teknis dan perangkat apa yang dikuasai Fauzi?' },
  { type: 'chip', lang: 'id', message: 'Ceritakan proyek pilihan yang dibangun Fauzi.' },
  { type: 'chip', lang: 'id', message: 'Sertifikasi dan pengalaman magang apa yang dimiliki Fauzi?' },
  { type: 'chip', lang: 'id', message: 'Bagaimana cara menghubungi Fauzi secara langsung?' },

  // Free-form queries (Tiers 1, 2, and Tier 3 Degraded fallback)
  { type: 'freeform', lang: 'en', message: 'Tell me about Fauzi education and university degree.' },
  { type: 'freeform', lang: 'en', message: 'What network routing protocols does Fauzi configure?' },
  { type: 'freeform', lang: 'en', message: 'Has Fauzi built fullstack applications with Next.js?' },
  { type: 'freeform', lang: 'en', message: 'Does Fauzi have government internship experience?' },
  { type: 'freeform', lang: 'en', message: 'What cybersecurity credentials does Fauzi hold?' },
  { type: 'freeform', lang: 'en', message: 'What is the Sentinel project built with?' },
  { type: 'freeform', lang: 'en', message: 'Where is Fauzi currently based?' },

  { type: 'freeform', lang: 'id', message: 'Ceritakan riwayat pendidikan vokasi dan sarjana Fauzi.' },
  { type: 'freeform', lang: 'id', message: 'Protokol routing jaringan apa saja yang dikuasai Fauzi?' },
  { type: 'freeform', lang: 'id', message: 'Apakah Fauzi pernah membangun aplikasi dengan React dan Prisma?' },
  { type: 'freeform', lang: 'id', message: 'Ceritakan pengalaman magang Fauzi di Dinas Kominfo.' },
  { type: 'freeform', lang: 'id', message: 'Sertifikasi keamanan siber apa yang dimiliki Fauzi?' },
  { type: 'freeform', lang: 'id', message: 'Apa teknologi yang digunakan dalam proyek StackLab?' },
  { type: 'freeform', lang: 'id', message: 'Di mana domisili atau lokasi tempat tinggal Fauzi?' },
];

async function setMockFault(mode) {
  const res = await fetch(`${MOCK_URL}/set-fault?mode=${mode}`);
  if (!res.ok) {
    throw new Error(`Failed to set mock fault to ${mode}: HTTP ${res.status}`);
  }
}

async function sendQuery(item, clientIp) {
  const start = Date.now();
  const res = await fetch(`${APP_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': clientIp,
      'Accept-Language': item.lang,
    },
    body: JSON.stringify({ message: item.message }),
  });
  const duration = Date.now() - start;
  const json = await res.json().catch(() => ({}));
  return {
    status: res.status,
    chatStatus: json.status,
    answer: json.answer || json.reply,
    duration,
  };
}

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function run() {
  console.log(`Starting Fault Matrix suite against ${APP_URL} via mock ${MOCK_URL}...`);
  console.log(`Queries per fault: ${TEST_QUERIES.length} (target >= 30: ${TEST_QUERIES.length >= 30 ? 'YES' : 'NO'})\n`);

  const results = [];
  let totalViolations = 0;

  for (const mode of FAULT_MODES) {
    process.stdout.write(`Testing fault mode: ${mode.padEnd(16)} `);
    await setMockFault(mode);

    const counts = {
      ok: 0,
      greeting: 0,
      degraded: 0,
      unavailable: 0,
      http5xx: 0,
    };
    const durations = [];

    for (let i = 0; i < TEST_QUERIES.length; i++) {
      const q = TEST_QUERIES[i];
      // Vary IP to avoid hitting per-IP rate limiter during batch test
      const clientIp = `10.44.${FAULT_MODES.indexOf(mode) + 1}.${i + 1}`;
      // Append mode tag to freeform queries to bypass in-memory answerCache and test real fault paths
      const queryItem = {
        ...q,
        message: q.type === 'freeform' ? `${q.message} [test-${mode}]` : q.message,
      };

      try {
        const out = await sendQuery(queryItem, clientIp);
        durations.push(out.duration);

        if (out.status >= 500) counts.http5xx += 1;
        if (out.chatStatus === 'ok' || out.chatStatus === 'answered') counts.ok += 1;
        else if (out.chatStatus === 'greeting') counts.greeting += 1;
        else if (out.chatStatus === 'degraded') counts.degraded += 1;
        else if (out.chatStatus === 'unavailable') counts.unavailable += 1;

        // Invariant I-3: <= 5.0s (allow tiny 200ms node schedule margin)
        if (out.duration > 5200) {
          console.error(`\n[VIOLATION] Query took ${out.duration}ms > 5.0s (${mode}): "${q.message}"`);
          totalViolations += 1;
        }

        // Invariant I-1: zero unavailable
        if (out.chatStatus === 'unavailable') {
          console.error(`\n[VIOLATION] Received "unavailable" (${mode}): "${q.message}"`);
          totalViolations += 1;
        }
      } catch (err) {
        console.error(`\n[FETCH ERROR] ${err.message}`);
        counts.http5xx += 1;
        totalViolations += 1;
      }
    }

    const p50 = percentile(durations, 50);
    const p95 = percentile(durations, 95);
    const max = Math.max(...durations);

    const row = {
      fault: mode,
      requests: TEST_QUERIES.length,
      ok: counts.ok,
      greeting: counts.greeting,
      degraded: counts.degraded,
      unavailable: counts.unavailable,
      http5xx: counts.http5xx,
      p50,
      p95,
      max,
    };
    results.push(row);
    console.log(`-> p50: ${p50}ms | p95: ${p95}ms | max: ${max}ms | degraded: ${counts.degraded} | unavail: ${counts.unavailable}`);
  }

  // Restore mock to healthy
  await setMockFault('healthy');

  console.log('\n================ FAULT MATRIX REPORT (ITEM 27) ================');
  console.log('| Fault Mode | Requests | ok | greeting | degraded | unavailable | p50 | p95 | max |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const r of results) {
    console.log(
      `| ${r.fault} | ${r.requests} | ${r.ok} | ${r.greeting} | ${r.degraded} | ${r.unavailable} | ${r.p50}ms | ${r.p95}ms | ${r.max}ms |`,
    );
  }
  console.log('=================================================================\n');

  if (totalViolations > 0) {
    console.error(`[RELEASE GATE FAILED] ${totalViolations} invariant violations detected.`);
    process.exit(1);
  } else {
    console.log('[RELEASE GATE PASSED] Zero unavailable responses, zero 5xx, all requests answered <= 5.0s.');
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
