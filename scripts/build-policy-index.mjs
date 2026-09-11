import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const prototypeRoot = path.resolve(import.meta.dirname, '..');
const policyRoot = path.resolve(prototypeRoot, '../data/raw/policy');
const documents = [
  ['policy_01_asean_2045.pdf', 'ASEAN 2045: Our Shared Future'],
  ['policy_02_aec_strategic_plan_2026_2030.pdf', 'ASEAN Economic Community Strategic Plan 2026–2030'],
  ['policy_03_ascc_strategic_plan.pdf', 'ASEAN Socio-Cultural Community Strategic Plan']
];
const chunks = [];
for (const [file, sourceTitle] of documents) {
  const fullPath = path.join(policyRoot, file);
  const result = spawnSync('pdftotext', ['-layout', fullPath, '-'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Could not extract ${file}: ${result.stderr}`);
  result.stdout.split('\f').forEach((pageText, pageIndex) => {
    const normalized = pageText.replace(/\s+/g, ' ').trim();
    for (let start = 0, index = 0; start < normalized.length; start += 850, index += 1) {
      const text = normalized.slice(start, start + 1000).trim();
      if (text.length >= 120) chunks.push({ id: `${file}-p${pageIndex + 1}-c${index + 1}`, sourceTitle, sourceFile: file, page: pageIndex + 1, text });
    }
  });
}
fs.writeFileSync(path.join(prototypeRoot, 'app-data/policy-index.json'), JSON.stringify(chunks, null, 2) + '\n');
console.log(`Indexed ${chunks.length} curated chunks from ${documents.length} local policy documents.`);
