import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildKnowledgeRecords } from '../src/data/chatbot-knowledge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'src', 'lib', 'server', 'knowledge.snapshot.json');

export function generateSnapshot(): void {
  const records = buildKnowledgeRecords();
  // Sort deterministically to match DB query order: category asc, position asc
  records.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.position - b.position;
  });

  const payload = JSON.stringify(records, null, 2);
  fs.writeFileSync(outputPath, payload, 'utf8');
  console.log(`[SNAPSHOT] Generated verified knowledge snapshot with ${records.length} records (${Buffer.byteLength(payload)} bytes) at ${outputPath}`);
}

generateSnapshot();
