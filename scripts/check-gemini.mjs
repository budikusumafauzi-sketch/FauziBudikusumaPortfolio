import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

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
const ai = new GoogleGenAI({ apiKey });

const candidates = [
  'models/gemini-3.5-flash-lite',
  'models/gemini-3.1-flash-lite',
];

const testPrompt = `=== REFERENCE FACTS (VERIFIED PORTFOLIO DATA) ===
Fauzi Budikusuma holds the MikroTik Certified Network Associate (MTCNA) certification.
He completed an IT Support and Networking internship at Dinas Komunikasi dan Informatika (Kominfo) DIY.
=== END REFERENCE FACTS ===

=== VISITOR QUESTION (UNTRUSTED INPUT) ===
What certifications and internship experience does Fauzi Budikusuma have?
=== END VISITOR QUESTION ===

Produce JSON conforming strictly to schema: {"kind": "answer"|"greeting"|"no_data", "answer": string, "citations": string[]}.`;

async function testGrounded() {
  console.log('[CHECK:GEMINI] Testing structured prompt on candidates...');
  for (const m of candidates) {
    const start = Date.now();
    try {
      const config = {
        systemInstruction: 'Answer strictly using verified facts in plain text.',
        maxOutputTokens: 512,
        temperature: 0.2,
        responseMimeType: 'application/json',
      };
      if (m.includes('3.1') || m.includes('2.5') || m.includes('2.0')) {
        config.thinkingConfig = { thinkingBudget: 0 };
      }
      const res = await ai.models.generateContent({
        model: m,
        contents: testPrompt,
        config,
      });
      const latency = Date.now() - start;
      console.log(`\nModel: ${m} (${latency}ms)`);
      console.log('Result:\n', res.text?.trim());
    } catch (e) {
      const latency = Date.now() - start;
      console.log(`\nModel ${m} FAILED (${latency}ms):`, e.message);
    }
  }
}


testGrounded();
