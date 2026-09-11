import fs from 'node:fs';
import path from 'node:path';

const prototypeRoot = path.resolve(import.meta.dirname, '..');
const dataRoot = path.resolve(prototypeRoot, '..');
const readCsv = (file) => {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  const parse = (line) => {
    const cells = []; let current = ''; let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') { current += '"'; i += 1; } else quoted = !quoted;
      } else if (char === ',' && !quoted) { cells.push(current); current = ''; } else current += char;
    }
    cells.push(current); return cells;
  };
  const keys = parse(header);
  return lines.filter(Boolean).map((line) => Object.fromEntries(keys.map((key, i) => [key, parse(line)[i] ?? ''])));
};
const numberOrNull = (value) => value === '' || value === undefined ? null : Number(value);
const join = readCsv(path.join(dataRoot, 'data/clean/20_indonesia_district_join_preview.csv'));
const crosswalk = readCsv(path.join(dataRoot, 'metadata/indonesia_admin_crosswalk.csv'));
const persistence = readCsv(path.join(dataRoot, 'data/analysis/district_priority_persistence.csv'));
const labels = new Map(crosswalk.filter((row) => row.source_id === 'IDN-01').map((row) => [row.canonical_kab_code, row.source_kab_original]));
const persist = new Map(persistence.map((row) => [row.district_key, row]));
const valid = join.filter((row) => row.pou_pct !== '' && row.undernourished_people !== '');
const ranked = (column) => [...valid].sort((a, b) => Number(b[column]) - Number(a[column]) || String(a.kab_code).localeCompare(String(b.kab_code)));
const severityRank = new Map(ranked('pou_pct').map((row, index) => [row.kab_code, index + 1]));
const scaleRank = new Map(ranked('undernourished_people').map((row, index) => [row.kab_code, index + 1]));
const n = valid.length;
const districts = join.map((row) => {
  const severity = severityRank.get(row.kab_code) ?? null;
  const scale = scaleRank.get(row.kab_code) ?? null;
  const history = persist.get(row.kab_code);
  return {
    id: `id-${row.kab_code}`,
    code: row.kab_code,
    name: labels.get(row.kab_code) ?? row.kab_kota,
    province: row.province.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' '),
    pouPct: numberOrNull(row.pou_pct),
    population: numberOrNull(row.population),
    undernourishedPeople: numberOrNull(row.undernourished_people),
    severityRank: severity,
    scaleRank: scale,
    severityPercentile: severity === null ? null : (n - severity) / (n - 1),
    scalePercentile: scale === null ? null : (n - scale) / (n - 1),
    persistenceSeverity: history ? numberOrNull(history.severity_top15_count) : null,
    persistenceScale: history ? numberOrNull(history.scale_top15_count) : null,
    severityTop15Years: history?.severity_top15_years ? history.severity_top15_years.split(';') : [],
    scaleTop15Years: history?.scale_top15_years ? history.scale_top15_years.split(';') : [],
    pph: numberOrNull(row.pph),
    energyKcalCapDay: numberOrNull(row.energy_kcal_cap_day),
    proteinGCapDay: numberOrNull(row.protein_g_cap_day),
    ikp: numberOrNull(row.ikp),
    riskSignals: Object.fromEntries([['Poverty signal', row.kemiskinan_parsed], ['No permanent market signal', row.tidak_ada_pasar_permanen_parsed], ['Disaster signal', row.kejadian_bencana_parsed], ['No stunting-service signal', row.tidak_ada_pelayanan_stunting_parsed]].filter(([, value]) => value !== '').map(([label, value]) => [label, Number(value)]))
  };
});
if (new Set(districts.map((district) => district.id)).size !== districts.length) throw new Error('Duplicate district IDs.');
if (valid.length !== 503) throw new Error(`Expected 503 valid districts, found ${valid.length}.`);
fs.mkdirSync(path.join(prototypeRoot, 'app-data'), { recursive: true });
fs.writeFileSync(path.join(prototypeRoot, 'app-data/districts_2025.json'), JSON.stringify(districts, null, 2) + '\n');
console.log(`Wrote ${districts.length} districts; ${valid.length} valid for priority rankings.`);
