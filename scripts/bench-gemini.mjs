import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envPath = path.join(rootDir, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

function extractEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) return '';
  let val = match[1].trim();
  val = val.replace(/\r/g, '').replace(/^["']|["']$/g, '').trim();
  return val;
}

const apiKey = extractEnv('GEMINI_API_KEY');
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

export const ai = new GoogleGenAI({ apiKey });

export const testPrompt = `=== REFERENCE FACTS (VERIFIED PORTFOLIO DATA) ===
Fauzi Budikusuma holds the MikroTik Certified Network Associate (MTCNA) certification.
He completed an IT Support and Networking internship at Dinas Komunikasi dan Informatika (Kominfo) DIY.
=== END REFERENCE FACTS ===

=== VISITOR QUESTION (UNTRUSTED INPUT) ===
What certifications and internship experience does Fauzi Budikusuma have?
=== END VISITOR QUESTION ===
Produce JSON conforming strictly to schema: {"kind": "answer"|"greeting"|"no_data", "answer": string, "citations": string[]}.`;

export async function testOneModel(m) {
  const start = Date.now();
  try {
    const res = await ai.models.generateContent({
      model: m,
      contents: 'Say OK',
      config: { maxOutputTokens: 5, thinkingConfig: { thinkingBudget: 0 } },
    });
    console.log(`[TEST] ${m}: SUCCESS in ${Date.now() - start}ms -> "${res.text?.trim()}"`);
  } catch (e) {
    console.log(`[TEST] ${m}: FAILED in ${Date.now() - start}ms -> ${e.message}`);
  }
}

export async function listAvailableModels() {
  console.log('\n=== LISTING MODELS AVAILABLE TO KEY ===');
  try {
    const list = await ai.models.list();
    const result = [];
    for await (const m of list) {
      if (m.name && m.name.includes('gemini')) {
        result.push({
          name: m.name,
          displayName: m.displayName || '',
          description: (m.description || '').slice(0, 80),
        });
      }
    }
    return result;
  } catch (err) {
    console.error('Failed to list models:', err.message);
    return [];
  }
}

/**
 * E2 — Raw HTTP (curl) vs SDK
 */
export async function runE2_RawVsSdk(model = 'models/gemini-2.5-flash') {
  console.log('\n========================================');
  console.log('E2: Raw HTTP (curl.exe) vs SDK');
  console.log('========================================');

  // 1. Raw HTTP via curl.exe
  const cleanModel = model.replace('models/', '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: 'Respond with OK.' }] }],
    generationConfig: { maxOutputTokens: 10 },
  });

  const tempDir = os.tmpdir().replace(/\\/g, '/');
  const payloadPath = `${tempDir}/bench_payload.json`;
  fs.writeFileSync(payloadPath, payload, 'utf8');

  const curlFormat = 'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s total:%{time_total}s http:%{http_code}\\n';
  
  let curlOut = '';
  try {
    const cmd = `curl.exe --max-time 15 -s -o NUL -w "${curlFormat}" -H "Content-Type: application/json" -d "@${payloadPath}" "${url}"`;
    curlOut = execSync(cmd, { encoding: 'utf8' }).trim();
    console.log(`curl.exe [${cleanModel}]: ${curlOut}`);
  } catch (e) {
    const safeMsg = (e.message || '').replace(new RegExp(apiKey, 'g'), '[REDACTED]');
    console.error('curl.exe error:', safeMsg);
  } finally {
    if (fs.existsSync(payloadPath)) fs.unlinkSync(payloadPath);
  }

  // 2. SDK call at the same moment
  const startSdk = Date.now();
  try {
    const res = await ai.models.generateContent({
      model: model,
      contents: 'Respond with OK.',
      config: { maxOutputTokens: 10 },
    });
    const sdkMs = Date.now() - startSdk;
    console.log(`SDK call [${model}]: totalMs=${sdkMs} text="${res.text?.trim()}"`);
  } catch (e) {
    const sdkMs = Date.now() - startSdk;
    console.error(`SDK call [${model}] FAILED after ${sdkMs}ms:`, e.message);
  }
}

/**
 * E3 — Model Benchmark
 */
export async function runQuickCompare() {
  console.log('\n========================================');
  console.log('Comparing candidate models (1 structured call each)');
  console.log('========================================');
  const candidates = [
    'models/gemini-3.8-flash',
    'models/gemini-3.5-flash',
    'models/gemini-3.1-flash-lite',
    'models/gemini-flash-latest',
    'models/gemini-flash-lite-latest',
  ];

  for (const m of candidates) {
    const start = Date.now();
    try {
      const config = {
        maxOutputTokens: 256,
        temperature: 0.2,
      };
      if (!m.includes('3.5')) {
        config.thinkingConfig = { thinkingBudget: 0 };
      }
      const res = await ai.models.generateContent({
        model: m,
        contents: 'In one sentence, what is networking?',
        config,
      });
      const elapsed = Date.now() - start;
      console.log(`[PASS] ${m.padEnd(35)}: ${elapsed}ms | text: "${(res.text || '').trim().slice(0, 60)}..."`);
    } catch (e) {
      const elapsed = Date.now() - start;
      console.log(`[FAIL] ${m.padEnd(35)}: ${elapsed}ms | error: ${e.message.slice(0, 100)}`);
    }
  }
}

export async function runE3_ModelBench() {
  console.log('\n========================================');
  console.log('E3: Model Benchmark (Latencies & Quality)');
  console.log('========================================');
  const candidateModels = [
    'models/gemini-3.5-flash',
    'models/gemini-3.1-flash-lite',
    'models/gemini-3.5-flash-lite',
  ];

  const results = [];

  for (const m of candidateModels) {
    const numIters = m.includes('flash-lite') && m.includes('3.5') ? 1 : 3;
    console.log(`\nTesting candidate: ${m} (${numIters} iterations)...`);
    const times = [];
    let failures = 0;
    let lastError = '';

    for (let i = 1; i <= numIters; i++) {
      const start = Date.now();
      try {
        const config = {
          systemInstruction: 'Answer strictly using verified facts in plain text.',
          maxOutputTokens: 256,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kind: { type: Type.STRING, enum: ['answer', 'greeting', 'no_data'] },
              answer: { type: Type.STRING },
              citations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['kind', 'answer', 'citations'],
          },
        };

        if (!m.includes('3.5')) {
          config.thinkingConfig = { thinkingBudget: 0 };
        }

        const res = await ai.models.generateContent({
          model: m,
          contents: testPrompt,
          config,
        });
        const elapsed = Date.now() - start;
        times.push(elapsed);
        const parsed = JSON.parse(res.text || '{}');
        console.log(`  [iter ${i}] ${elapsed}ms -> kind: ${parsed.kind}`);
      } catch (err) {
        const elapsed = Date.now() - start;
        failures++;
        lastError = err.message || String(err);
        console.log(`  [iter ${i}] FAILED after ${elapsed}ms: ${lastError.slice(0, 100)}`);
      }
    }

    times.sort((a, b) => a - b);
    const min = times.length > 0 ? times[0] : null;
    const p50 = times.length > 0 ? times[Math.floor(times.length / 2)] : null;
    const max = times.length > 0 ? times[times.length - 1] : null;

    results.push({
      model: m,
      minMs: min,
      p50Ms: p50,
      maxMs: max,
      failures,
      lastError: lastError ? lastError.slice(0, 60) : 'none',
    });
  }

  console.log('\n--- MODEL BENCH RESULTS SUMMARY ---');
  console.table(results);
  return results;
}

/**
 * E4 — Timeout Semantics: client abort vs server deadline
 */
export async function runE4_TimeoutSemantics() {
  console.log('\n========================================');
  console.log('E4: Timeout Semantics (Client Abort vs SDK)');
  console.log('========================================');

  // Test 1: AbortController abort after 1500ms
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  const start = Date.now();
  try {
    await ai.models.generateContent({
      model: 'models/gemini-3.5-flash',
      contents: testPrompt,
      config: { abortSignal: controller.signal },
    });
    clearTimeout(timer);
    console.log(`Test 1: unexpectedly succeeded in ${Date.now() - start}ms`);
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    console.log(`Test 1 (local AbortController): caught after ${elapsed}ms:`);
    console.log(`  name: ${err.name}`);
    console.log(`  constructor: ${err.constructor?.name}`);
    console.log(`  message: ${err.message}`);
    console.log(`  status: ${err.status}`);
  }

  // Test 2: Check whether SDK has httpOptions timeout
  const start2 = Date.now();
  try {
    const aiWithTimeout = new GoogleGenAI({
      apiKey,
      httpOptions: { timeout: 1500 },
    });
    await aiWithTimeout.models.generateContent({
      model: 'models/gemini-3.5-flash',
      contents: testPrompt,
    });
    console.log(`Test 2: unexpectedly succeeded in ${Date.now() - start2}ms`);
  } catch (err) {
    const elapsed = Date.now() - start2;
    console.log(`Test 2 (SDK httpOptions.timeout): caught after ${elapsed}ms:`);
    console.log(`  name: ${err.name}`);
    console.log(`  constructor: ${err.constructor?.name}`);
    console.log(`  message: ${err.message}`);
    console.log(`  status: ${err.status}`);
  }
}

/**
 * E5 — Connection Policy (Keep-Alive vs fresh connection)
 */
export async function runE5_ConnectionPolicy() {
  console.log('\n========================================');
  console.log('E5: Connection Policy (Keep-Alive vs Fresh)');
  console.log('========================================');

  // Run 2 sequential calls with default client
  const s1 = Date.now();
  await ai.models.generateContent({
    model: 'models/gemini-3.5-flash',
    contents: 'Say 1',
    config: { maxOutputTokens: 5 },
  });
  const t1 = Date.now() - s1;

  const s2 = Date.now();
  await ai.models.generateContent({
    model: 'models/gemini-3.5-flash',
    contents: 'Say 2',
    config: { maxOutputTokens: 5 },
  });
  const t2 = Date.now() - s2;

  console.log(`Sequential calls on same client: call 1 = ${t1}ms, call 2 = ${t2}ms (socket reused: ${t2 < t1})`);

  // Run call with fresh client instance
  const aiFresh = new GoogleGenAI({ apiKey });
  const s3 = Date.now();
  await aiFresh.models.generateContent({
    model: 'models/gemini-3.5-flash',
    contents: 'Say 3',
    config: { maxOutputTokens: 5 },
  });
  const t3 = Date.now() - s3;
  console.log(`Fresh client call: call 3 = ${t3}ms`);
}

async function main() {
  const arg = process.argv[2];
  const targetModel = process.argv[3];
  if (arg === 'e2') {
    await runE2_RawVsSdk(targetModel || 'models/gemini-3.8-flash');
  } else if (arg === 'test') {
    await testOneModel(targetModel || 'models/gemini-2.5-flash-lite');
  } else if (arg === 'quick') {
    await runQuickCompare();
  } else if (arg === 'e3') {
    await runE3_ModelBench();
  } else if (arg === 'e4') {
    await runE4_TimeoutSemantics();
  } else if (arg === 'e5') {
    await runE5_ConnectionPolicy();
  } else if (arg === 'all') {
    await runE2_RawVsSdk(targetModel || 'models/gemini-3.8-flash');
    await runE3_ModelBench();
    await runE4_TimeoutSemantics();
    await runE5_ConnectionPolicy();
  } else {
    await listAvailableModels();
  }
}

if (process.argv[1] && process.argv[1].endsWith('bench-gemini.mjs')) {
  main().catch(console.error);
}
