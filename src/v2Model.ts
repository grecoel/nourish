export type Metric = 'ikp' | 'pou_pct' | 'undernourished_people' | 'pph' | 'energy_kcal_cap_day' | 'protein_g_cap_day';
export type MapMetric = Metric | 'ikp_group';
export type Region = { code: string; provinceCode: string; name: string; province: string; ikp_group: number; ikp_rank: number; population: number | null; years: Record<string, number>; qualityNotes: string[] } & Record<Metric, number | null>;
export const metrics: Record<Metric, { label: string; short: string; unit: string; digits: number; meaning: string }> = {
  ikp: { label: 'Indeks Ketahanan Pangan', short: 'IKP', unit: 'indeks', digits: 2, meaning: 'Nilai indeks ketahanan pangan; lebih tinggi menunjukkan ketahanan pangan yang lebih baik. Bukan persentase penduduk.' },
  pou_pct: { label: 'Prevalensi ketidakcukupan pangan', short: 'PoU', unit: '%', digits: 2, meaning: 'Proporsi penduduk dengan konsumsi energi di bawah kebutuhan minimum. Lebih tinggi berarti proporsi terdampak lebih besar.' },
  undernourished_people: { label: 'Penduduk terdampak', short: 'Jumlah terdampak', unit: 'orang', digits: 0, meaning: 'Estimasi penduduk dengan ketidakcukupan konsumsi pangan, sekitar PoU/100 × populasi. Bukan jumlah penerima bantuan.' },
  pph: { label: 'Pola Pangan Harapan', short: 'PPH', unit: 'skor', digits: 1, meaning: 'Skor keragaman dan komposisi konsumsi pangan; bukan persentase penduduk.' },
  energy_kcal_cap_day: { label: 'Konsumsi energi', short: 'Energi', unit: 'kkal/kapita/hari', digits: 0, meaning: 'Rata-rata konsumsi energi per kapita per hari. Kenaikan tidak otomatis berarti perbaikan tanpa acuan kebutuhan.' },
  protein_g_cap_day: { label: 'Konsumsi protein', short: 'Protein', unit: 'g/kapita/hari', digits: 1, meaning: 'Rata-rata konsumsi protein per kapita per hari; tidak membuktikan sebab-akibat maupun dampak intervensi.' },
};
export const fmt = (n: number | null | undefined, digits = 0) => n == null || !Number.isFinite(n) ? 'Data tidak tersedia' : new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(n);
export const compact = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
export const labelFor = (m: MapMetric) => m === 'ikp_group' ? 'Kelompok IKP' : metrics[m].label;
export const unitFor = (m: MapMetric) => m === 'ikp_group' ? 'kelompok 1–6' : metrics[m].unit;
export const formatMetric = (n: number | null, m: MapMetric) => n === null ? 'Data tidak tersedia' : `${fmt(n, m === 'ikp_group' ? 0 : metrics[m].digits)} ${m === 'ikp_group' ? '' : metrics[m].unit}`.trim();
export const groupColors = ['#e4eadf', '#c7dac5', '#a0c4ab', '#76a389', '#4e806a', '#27553f'];
export function domain(rows: Region[], key: MapMetric): [number, number] {
  const values = rows.map(r => r[key]).filter((n): n is number => n !== null);
  if (!values.length) return [0, 1];
  return [Math.min(...values), Math.max(...values)];
}
export function colorFor(value: number | null, metric: MapMetric, extent: [number, number]): string {
  if (value === null) return '#D8DAD4';
  if (metric === 'ikp_group') return groupColors[Math.max(0, Math.min(5, value - 1))];
  const t = Math.max(0, Math.min(1, (value - extent[0]) / (extent[1] - extent[0] || 1)));
  const from = metric === 'undernourished_people' ? [229, 240, 246] : [232, 239, 225];
  const to = metric === 'undernourished_people' ? [45, 103, 139] : [39, 85, 63];
  return `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * t)).join(',')})`;
}
export function filterRegions(rows: Region[], province: string, group: string, search: string): Region[] {
  const q = search.trim().toLocaleLowerCase('id');
  return rows.filter(r => (!province || r.province === province) && (!group || String(r.ikp_group) === group) && (!q || `${r.name} ${r.province} ${r.code}`.toLocaleLowerCase('id').includes(q)));
}
export function quantile(values: number[], p: number) {
  if (!values.length) return null;
  const a = [...values].sort((x, y) => x - y), index = (a.length - 1) * p, low = Math.floor(index);
  return a[low] + (a[Math.ceil(index)] - a[low]) * (index - low);
}
export function pearson(rows: Region[], a: Metric, b: Metric): { r: number | null; n: number } {
  const valid = rows.filter(d => d[a] !== null && d[b] !== null), n = valid.length;
  if (n < 3) return { r: null, n };
  const ax = valid.reduce((s, d) => s + d[a]!, 0) / n, by = valid.reduce((s, d) => s + d[b]!, 0) / n;
  let sum = 0, xx = 0, yy = 0;
  for (const d of valid) { const x = d[a]! - ax, y = d[b]! - by; sum += x * y; xx += x * x; yy += y * y; }
  return { r: xx > 0 && yy > 0 ? Math.max(-1, Math.min(1, sum / Math.sqrt(xx * yy))) : null, n };
}
export function boxSummary(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b), q1 = quantile(sorted, .25)!, q3 = quantile(sorted, .75)!, med = quantile(sorted, .5)!, iqr = q3 - q1;
  const inside = sorted.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
  return { n: sorted.length, q1, q3, median: med, low: inside[0], high: inside[inside.length - 1], outliers: sorted.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr) };
}
export function ordered(rows: Region[], metric: Metric, ascending = false) {
  return rows.filter(d => d[metric] !== null).sort((a, b) => (ascending ? 1 : -1) * (a[metric]! - b[metric]!) || a.code.localeCompare(b.code));
}
