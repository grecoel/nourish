import { useRef, useState, type ReactNode } from 'react';
import { boxSummary, colorFor, compact, domain, fmt, formatMetric, groupColors, metrics, ordered, pearson, type Metric, type Region } from './v2Model';

export function Panel({ title, subtitle, aside, children, className = '' }: { title: string; subtitle?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`v2-panel ${className}`}><header className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{aside}</header>{children}</section>;
}
export function Empty({ children = 'Tidak ada observasi sesuai filter.' }: { children?: ReactNode }) { return <div className="v2-empty">{children}</div>; }
export function Groups({ rows, chosen, onSelect }: { rows: Region[]; chosen: string; onSelect: (value: string) => void }) {
  const counts = [1, 2, 3, 4, 5, 6].map(g => rows.filter(r => r.ikp_group === g).length), max = Math.max(...counts, 1);
  return <div className="ikp-groups">{counts.map((n, i) => <button key={i} className={chosen === String(i + 1) ? 'selected-group' : ''} onClick={() => onSelect(chosen === String(i + 1) ? '' : String(i + 1))} aria-pressed={chosen === String(i + 1)} aria-label={`Kelompok IKP ${i + 1}, ${n} wilayah. Filter kelompok.`}><span><i style={{ background: groupColors[i] }} />Kelompok {i + 1}</span><span className="group-track"><i style={{ width: `${n / max * 100}%`, background: groupColors[i] }} /></span><strong>{n}</strong></button>)}<p className="chart-note">Jumlah wilayah · kategori 1–6 mengikuti sumber. Klik kelompok untuk memfilter; klik ulang untuk melepas.</p></div>;
}

export function RankedBars({ rows, metric, ascending, selected, count, onSelect, onHover }: { rows: Region[]; metric: Metric; ascending: boolean; selected: string; count: number; onSelect: (code: string) => void; onHover?: (code: string | null) => void }) {
  const items = ordered(rows, metric, ascending).slice(0, count), max = Math.max(...rows.map(r => r[metric] ?? 0), 1);
  return <div className="ranked-bars">{!items.length && <Empty />}{items.map(r => <button className={selected === r.code ? 'bar-selected' : ''} key={r.code} onClick={() => onSelect(r.code)} onMouseEnter={() => onHover?.(r.code)} onMouseLeave={() => onHover?.(null)} onFocus={() => onHover?.(r.code)} onBlur={() => onHover?.(null)} aria-label={`${r.name}, ${formatMetric(r[metric], metric)}. Buka profil.`}><span className="bar-place">{r.name.replace('Kabupaten ', 'Kab. ')}<small>{r.province}</small></span><span className="bar-track"><i style={{ width: `${r[metric]! / max * 100}%`, background: metric === 'undernourished_people' ? '#467fa2' : '#4e806a' }} /></span><strong>{metric === 'undernourished_people' ? compact(r[metric]!) : fmt(r[metric], metrics[metric].digits)}</strong></button>)}<p className="chart-note">Batang dari nol · {metrics[metric].unit} · {items.length} dari {rows.filter(r => r[metric] !== null).length} observasi tersedia.</p></div>;
}

export function DotPlot({ rows, metric, selected, onSelect }: { rows: Region[]; metric: Metric; selected: string; onSelect: (code: string) => void }) {
  const [hover, setHover] = useState<Region | null>(null);
  const items = ordered(rows, metric), max = Math.max(...items.map(r => r[metric]!), 1) * 1.04;
  const x = (v: number) => 242 + v / max * 590;
  return <div className="dotplot-wrap">{!items.length ? <Empty>Indikator ini tidak tersedia pada wilayah pembanding.</Empty> : <div className="dotplot-scroll"><svg viewBox={`0 0 960 ${70 + items.length * 34}`} role="group" aria-label={`Perbandingan ${metrics[metric].label} kabupaten/kota. Semua titik memakai satu skala, nilai tertinggi dahulu.`}>
    {[0, .25, .5, .75, 1].map(t => <g key={t}><line x1={x(max * t)} x2={x(max * t)} y1="30" y2={42 + items.length * 34} className="chart-grid" /><text x={x(max * t)} y="18" textAnchor="middle" className="chart-tick">{metric === 'undernourished_people' ? compact(max * t) : fmt(max * t, 1)}</text></g>)}
    {items.map((r, i) => <g key={r.code} tabIndex={0} role="button" aria-label={`${r.name}, ${formatMetric(r[metric], metric)}`} onClick={() => onSelect(r.code)} onKeyDown={e => { if (e.key === 'Enter') onSelect(r.code); }} onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(r)} onBlur={() => setHover(null)}>
      {r.code === selected && <rect x="0" y={32 + i * 34} width="955" height="30" rx="3" fill="#eff4ec" />}
      <text x="225" y={53 + i * 34} textAnchor="end" className={`chart-tick ${r.code === selected ? 'emphasis' : ''}`}>{r.name.replace('Kabupaten ', 'Kab. ')}</text>
      <circle cx={x(r[metric]!)} cy={48 + i * 34} r={r.code === selected ? 6 : 4} fill={r.code === selected ? '#315f4d' : '#abbcac'} />
      <text x="940" y={53 + i * 34} textAnchor="end" className="chart-tick">{fmt(r[metric], metrics[metric].digits)}</text>
    </g>)}
  </svg></div>}{hover && <div className="v2-tooltip chart-tooltip" role="status"><strong>{hover.name}</strong><span>{formatMetric(hover[metric], metric)} · 2025</span></div>}<p className="chart-note">Posisi pada skala bersama · {metrics[metric].unit}. {rows.length - items.length} observasi tanpa nilai tidak diplot. Klik wilayah untuk mengganti fokus.</p></div>;
}

type Brush = { x1: number; y1: number; x2: number; y2: number };
export function ScatterPlot({ rows, all, xMetric, yMetric, selected, brushed, onBrush, onSelect, onHover, colorGroups = false }: { rows: Region[]; all: Region[]; xMetric: Metric; yMetric: Metric; selected: string; brushed: Set<string>; onBrush: (codes: Set<string>) => void; onSelect: (code: string) => void; onHover?: (code: string | null) => void; colorGroups?: boolean }) {
  const valid = rows.filter(r => r[xMetric] !== null && r[yMetric] !== null), [hover, setHover] = useState<Region | null>(null);
  const [brush, setBrush] = useState<Brush | null>(null); const drawing = useRef(false), moved = useRef(false);
  const xmax = Math.max(domain(all, xMetric)[1], 1) * 1.06, ymax = Math.max(domain(all, yMetric)[1], 1) * 1.06;
  const x = (value: number) => 76 + value / xmax * 670, y = (value: number) => 333 - value / ymax * 281;
  const pointer = (event: React.PointerEvent<SVGSVGElement>) => { const point = event.currentTarget.createSVGPoint(); point.x = event.clientX; point.y = event.clientY; const matrix = event.currentTarget.getScreenCTM(); return matrix ? point.matrixTransform(matrix.inverse()) : point; };
  const ticks = (metric: Metric, n: number) => metric === 'undernourished_people' ? compact(n) : fmt(n, 1);
  return <div className="scatter-container">{!valid.length ? <Empty>Kedua indikator tidak tersedia bersama dalam filter ini.</Empty> : <svg viewBox="0 0 800 390" role="group" aria-label={`Scatterplot ${metrics[xMetric].label} versus ${metrics[yMetric].label}. Geser area kosong untuk memilih beberapa wilayah; titik dapat dipilih dengan keyboard.`}
    onPointerDown={e => { if (e.button !== 0 || (e.target as Element).tagName.toLowerCase() === 'circle') return; const p = pointer(e); drawing.current = true; moved.current = false; setBrush({ x1: p.x, y1: p.y, x2: p.x, y2: p.y }); e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => { if (!drawing.current) return; const p = pointer(e); setBrush(b => b ? { ...b, x2: p.x, y2: p.y } : null); moved.current = true; }}
    onPointerUp={e => { if (!drawing.current) return; drawing.current = false; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); if (brush && moved.current) { const left = Math.min(brush.x1, brush.x2), right = Math.max(brush.x1, brush.x2), top = Math.min(brush.y1, brush.y2), bottom = Math.max(brush.y1, brush.y2); onBrush(new Set(valid.filter(r => x(r[xMetric]!) >= left && x(r[xMetric]!) <= right && y(r[yMetric]!) >= top && y(r[yMetric]!) <= bottom).map(r => r.code))); } setBrush(null); }} onPointerCancel={() => { drawing.current = false; setBrush(null); }}>
    <text x="76" y="23" className="chart-axis">{metrics[yMetric].short} ({metrics[yMetric].unit})</text>
    {[0, .25, .5, .75, 1].map(t => <g key={t}><line x1="76" x2="746" y1={y(ymax * t)} y2={y(ymax * t)} className="chart-grid" /><text x="65" y={y(ymax * t) + 4} textAnchor="end" className="chart-tick">{ticks(yMetric, ymax * t)}</text><text x={x(xmax * t)} y="355" textAnchor="middle" className="chart-tick">{ticks(xMetric, xmax * t)}</text></g>)}
    <text x="746" y="381" textAnchor="end" className="chart-axis">{metrics[xMetric].short} ({metrics[xMetric].unit}) →</text>
    {[...valid].sort((a, b) => Number(a.code === selected) - Number(b.code === selected)).map(r => <g key={r.code}><circle cx={x(r[xMetric]!)} cy={y(r[yMetric]!)} r={r.code === selected ? 6.5 : 4} fill={r.code === selected ? '#b88142' : colorGroups ? groupColors[r.ikp_group - 1] : '#6b9380'} opacity={brushed.size && !brushed.has(r.code) ? .15 : .8} stroke={r.code === selected ? '#533e20' : '#fff'} strokeWidth={r.code === selected ? 1.5 : .7} tabIndex={0} role="button" aria-label={`${r.name}, ${metrics[xMetric].short} ${formatMetric(r[xMetric], xMetric)}, ${metrics[yMetric].short} ${formatMetric(r[yMetric], yMetric)}. Buka profil.`} onMouseEnter={() => { setHover(r); onHover?.(r.code); }} onMouseLeave={() => { setHover(null); onHover?.(null); }} onFocus={() => { setHover(r); onHover?.(r.code); }} onBlur={() => { setHover(null); onHover?.(null); }} onClick={() => onSelect(r.code)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(r.code); } }} />{r.code === selected && <text x={x(r[xMetric]!) > 600 ? x(r[xMetric]!) - 10 : x(r[xMetric]!) + 10} y={y(r[yMetric]!) - 12} textAnchor={x(r[xMetric]!) > 600 ? 'end' : 'start'} className="scatter-label">{r.name.replace('Kabupaten ', 'Kab. ')}</text>}</g>)}
    {brush && <rect x={Math.min(brush.x1, brush.x2)} y={Math.min(brush.y1, brush.y2)} width={Math.abs(brush.x2 - brush.x1)} height={Math.abs(brush.y2 - brush.y1)} fill="#315f4d20" stroke="#315f4d" strokeDasharray="4 3" pointerEvents="none" />}
  </svg>}{hover && <div className="v2-tooltip chart-tooltip" role="status"><strong>{hover.name}</strong><span>{hover.province} · Kelompok IKP {hover.ikp_group}</span><b>{metrics[xMetric].short}: {formatMetric(hover[xMetric], xMetric)}</b><b>{metrics[yMetric].short}: {formatMetric(hover[yMetric], yMetric)}</b><span>Populasi: {fmt(hover.population)} orang · 2025</span></div>}<div className="scatter-footer"><span>{valid.length}/{rows.length} observasi · {rows.length - valid.length} tanpa pasangan nilai</span><span>Skala nasional tetap · pilih titik atau seret area kosong</span></div></div>;
}

const correlationMetrics: Metric[] = ['ikp', 'pou_pct', 'pph', 'energy_kcal_cap_day', 'protein_g_cap_day'];
function corrColor(r: number | null) {
  if (r === null) return '#e7e9e3';
  const base = [247, 245, 239], target = r < 0 ? [164, 105, 54] : [49, 95, 77];
  return `rgb(${base.map((v, i) => Math.round(v + (target[i] - v) * Math.abs(r))).join(',')})`;
}
function corrInk(r: number | null) {
  if (r === null) return '#222821';
  const components = corrColor(r).match(/\d+/g)!.map(Number).map(v => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
  const luminance = .2126 * components[0] + .7152 * components[1] + .0722 * components[2];
  return luminance > .179 ? '#000' : '#fff';
}
export function Correlation({ rows }: { rows: Region[] }) {
  const [hover, setHover] = useState<{ a: Metric; b: Metric; r: number | null; n: number } | null>(null);
  return <div className="correlation-wrap"><div className="correlation-matrix" role="group" aria-label="Matriks korelasi Pearson lima indikator inti"><span />{correlationMetrics.map(m => <span key={m} className="matrix-col">{metrics[m].short}</span>)}{correlationMetrics.map(a => <div className="matrix-row" key={a}><span className="matrix-row-label">{metrics[a].short}</span>{correlationMetrics.map(b => { const result = pearson(rows, a, b); return <button key={b} style={{ background: corrColor(result.r), color: corrInk(result.r) }} onMouseEnter={() => setHover({ a, b, ...result })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ a, b, ...result })} onBlur={() => setHover(null)} aria-label={`${metrics[a].short} dan ${metrics[b].short}, Pearson r ${result.r === null ? 'tidak tersedia' : fmt(result.r, 3)}, n ${result.n}`}>{result.r === null ? '—' : fmt(result.r, 2)}</button>; })}</div>)}</div><div className="correlation-legend"><span>−1</span><i /><span>+1</span></div><p className="chart-note">Pearson r · nol = netral · pasangan lengkap per sel. n berbeda bila ada nilai kosong; korelasi bukan bukti sebab-akibat.</p>{hover && <div className="v2-tooltip chart-tooltip" role="status"><strong>{metrics[hover.a].short} × {metrics[hover.b].short}</strong><span>Pearson r = {fmt(hover.r, 3)} · n = {hover.n}</span>{hover.r === null && <span>Minimal 3 pasangan dan variasi kedua indikator diperlukan.</span>}</div>}</div>;
}

export function BoxPlots({ rows, provinces }: { rows: Region[]; provinces: string[] }) {
  const [hover, setHover] = useState<{ name: string; summary: NonNullable<ReturnType<typeof boxSummary>> } | null>(null);
  const groups = provinces.map(name => ({ name, summary: boxSummary(rows.filter(r => r.province === name && r.ikp !== null).map(r => r.ikp!)) })).filter((g): g is { name: string; summary: NonNullable<ReturnType<typeof boxSummary>> } => g.summary !== null);
  const x = (v: number) => 225 + v / 100 * 610;
  return <div className="boxplot-wrap">{!groups.length ? <Empty>Tidak ada provinsi pembanding dalam filter aktif.</Empty> : <svg viewBox={`0 0 930 ${70 + groups.length * 48}`} role="group" aria-label="Box plot distribusi IKP kabupaten/kota per provinsi; skala indeks 0 sampai 100">
    {[0, 25, 50, 75, 100].map(n => <g key={n}><text x={x(n)} y="18" textAnchor="middle" className="chart-tick">{n}</text><line x1={x(n)} x2={x(n)} y1="30" y2={40 + groups.length * 48} className="chart-grid" /></g>)}
    {groups.map(({ name, summary: s }, index) => { const y = 53 + index * 48; return <g key={name} tabIndex={0} aria-label={`${name}, n ${s.n}, median ${fmt(s.median, 2)}, Q1 ${fmt(s.q1, 2)}, Q3 ${fmt(s.q3, 2)}`} onMouseEnter={() => setHover({ name, summary: s })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ name, summary: s })} onBlur={() => setHover(null)}><text x="210" y={y + 5} textAnchor="end" className="chart-tick">{name}</text><line x1={x(s.low)} x2={x(s.high)} y1={y} y2={y} stroke="#71866d" /><line x1={x(s.low)} x2={x(s.low)} y1={y - 6} y2={y + 6} stroke="#71866d" /><line x1={x(s.high)} x2={x(s.high)} y1={y - 6} y2={y + 6} stroke="#71866d" /><rect x={x(s.q1)} width={Math.max(1, x(s.q3) - x(s.q1))} y={y - 11} height="22" fill="#d1dfca" stroke="#71866d" /><line x1={x(s.median)} x2={x(s.median)} y1={y - 11} y2={y + 11} stroke="#254d36" strokeWidth="2" />{s.outliers.map((v, i) => <circle key={i} cx={x(v)} cy={y} r="3" fill="#b88142" />)}<text x="910" y={y + 5} textAnchor="end" className="chart-tick">n={s.n}</text></g>; })}
  </svg>}<p className="chart-note">Kotak = Q1–Q3 · garis = median · whisker = observasi terjauh dalam 1,5×IQR · titik = observasi di luar whisker. Statistik kabupaten/kota, bukan IKP resmi provinsi.</p>{hover && <div className="v2-tooltip chart-tooltip" role="status"><strong>{hover.name} · n={hover.summary.n}</strong><span>Median {fmt(hover.summary.median, 2)} · Q1 {fmt(hover.summary.q1, 2)} · Q3 {fmt(hover.summary.q3, 2)}</span><span>Whisker {fmt(hover.summary.low, 2)}–{fmt(hover.summary.high, 2)}</span></div>}</div>;
}
