import { useEffect, useId, useMemo, useRef, useState } from 'react';
import geography from '../app-data/v2-map.json';
import { colorFor, domain, formatMetric, labelFor, unitFor, fmt, type MapMetric, type Region } from './v2Model';

type View = [number, number, number, number];
const shapes = geography.shapes;
const fullView: View = [0, -15, 965, 385];
function fit(codes: Set<string>): View {
  const found = shapes.filter(s => codes.has(s.code));
  if (!found.length) return fullView;
  const x = Math.min(...found.map(s => s.bbox[0])), y = Math.min(...found.map(s => s.bbox[1]));
  const right = Math.max(...found.map(s => s.bbox[2])), bottom = Math.max(...found.map(s => s.bbox[3]));
  const width = Math.max(right - x + 6, (bottom - y + 6) * 2.2, 12), height = width / 2.2;
  return [(x + right - width) / 2, (y + bottom - height) / 2, width, height];
}

export default function V2Map({ all, visible, metric, selected, highlighted, onSelect, onHover, focusProvince, compact = false }: {
  all: Region[]; visible: Region[]; metric: MapMetric; selected: string; highlighted?: Set<string>;
  onSelect: (code: string) => void; onHover?: (code: string | null) => void; focusProvince?: string; compact?: boolean;
}) {
  const pattern = useId().replaceAll(':', '');
  const byCode = useMemo(() => new Map(all.map(r => [r.code, r])), [all]);
  const visibleCodes = useMemo(() => new Set(visible.map(r => r.code)), [visible]);
  const extent = useMemo(() => metric === 'ikp_group' ? [1, 6] as [number, number] : domain(all, metric), [all, metric]);
  const base = useMemo(() => focusProvince ? fit(new Set(all.filter(r => r.province === focusProvince).map(r => r.code))) : fullView, [focusProvince, all]);
  const [view, setView] = useState<View>(base);
  const [hover, setHover] = useState<Region | null>(null);
  const drag = useRef<{ x: number; y: number; view: View } | null>(null);
  const dragged = useRef(false);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => setView(base), [base]);
  const zoom = (factor: number) => setView(v => {
    const width = Math.max(5, Math.min(1450, v[2] * factor)), height = width * v[3] / v[2];
    return [v[0] + (v[2] - width) / 2, v[1] + (v[3] - height) / 2, width, height];
  });
  const enter = (r: Region) => { setHover(r); onHover?.(r.code); };
  const leave = () => { setHover(null); onHover?.(null); };
  const chosen = shapes.find(s => s.code === selected);
  const valid = visible.filter(r => r[metric] !== null).length;
  return <div className={`v2-map ${compact ? 'map-compact' : ''}`}>
    <div className="map-topline"><span><i />{focusProvince || 'INDONESIA'}<b> / {labelFor(metric)}</b></span><span>2025 · {valid}/{visible.length} tersedia</span></div>
    <div className="map-stage">
      <div className="map-buttons" aria-label="Kontrol peta"><button onClick={() => zoom(.65)} aria-label="Perbesar peta">+</button><button onClick={() => zoom(1.5)} aria-label="Perkecil peta">−</button><button onClick={() => setView(base)} aria-label="Reset posisi peta">↺</button><button onClick={() => setView(fit(new Set([selected])))} disabled={!chosen} aria-label="Fokus wilayah terpilih">⌖</button></div>
      <svg ref={svg} viewBox={view.join(' ')} role="group" aria-label={`Peta kabupaten/kota ${focusProvince || 'Indonesia'}, indikator ${labelFor(metric)}. Geser untuk pan; tombol untuk zoom.`} tabIndex={0}
        onKeyDown={e => { if (e.target !== e.currentTarget) return; if (e.key === '+' || e.key === '=') zoom(.65); else if (e.key === '-') zoom(1.5); else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); setView(v => [v[0] + (e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0) * v[2] * .1, v[1] + (e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0) * v[3] * .1, v[2], v[3]]); } }}
        onPointerDown={e => { if (e.button !== 0) return; dragged.current = false; drag.current = { x: e.clientX, y: e.clientY, view }; }}
        onPointerMove={e => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) < 5 && !dragged.current) return; dragged.current = true; e.currentTarget.setPointerCapture(e.pointerId); const rect = e.currentTarget.getBoundingClientRect(); const scale = Math.max(d.view[2] / rect.width, d.view[3] / rect.height); setView([d.view[0] - dx * scale, d.view[1] - dy * scale, d.view[2], d.view[3]]); leave(); }}
        onPointerUp={e => { drag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }} onPointerCancel={() => { drag.current = null; }}>
        <defs><pattern id={pattern} width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#d8dad4" /><path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke="#aeb4aa" strokeWidth="1" /></pattern></defs>
        {shapes.map(shape => {
          const region = byCode.get(shape.code)!; const included = visibleCodes.has(shape.code); const value = region[metric];
          return <path key={shape.code} d={shape.path} fill={value === null ? `url(#${pattern})` : colorFor(value, metric, extent)} fillRule="evenodd" stroke="#fff" strokeWidth=".45" vectorEffect="non-scaling-stroke" opacity={!included ? .13 : highlighted?.size && !highlighted.has(shape.code) ? .35 : 1}
            tabIndex={included ? 0 : -1} role="button" aria-disabled={!included} aria-label={`${region.name}, ${region.province}, ${formatMetric(value, metric)}. Buka District Lens.`}
            onPointerEnter={() => included && !drag.current && enter(region)} onPointerLeave={leave} onFocus={() => included && enter(region)} onBlur={leave}
            onClick={() => { if (included && !dragged.current) { leave(); onSelect(shape.code); } }} onKeyDown={e => { if (included && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(shape.code); } }} />;
        })}
        {chosen && (visibleCodes.has(selected) || focusProvince) && <path d={chosen.path} fill="none" stroke="#141f18" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none" />}
        {highlighted && shapes.filter(s => highlighted.has(s.code)).map(s => <path key={`highlight${s.code}`} d={s.path} fill="none" stroke="#b88142" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none" />)}
      </svg>
      {!visible.length && <div className="map-empty">Tidak ada wilayah sesuai filter.</div>}
      {byCode.has(selected) && (visibleCodes.has(selected) || focusProvince) && <div className="map-selected-label"><span>WILAYAH FOKUS</span><strong>{byCode.get(selected)!.name}</strong></div>}
      {hover && <div className="v2-tooltip map-tooltip" role="status"><strong>{hover.name}</strong><span>{hover.province}</span><b>{labelFor(metric)}: {formatMetric(hover[metric], metric)}</b><span>IKP {fmt(hover.ikp, 2)} · Kelompok {hover.ikp_group} · Peringkat #{hover.ikp_rank}</span>{hover[metric] === null && <em>Nilai valid tidak tersedia pada dataset olahan.</em>}</div>}
      <div className="map-caption"><span aria-hidden="true">⌁</span> {focusProvince ? `Konteks ${focusProvince} · batas kabupaten/kota` : 'Batas kabupaten/kota · proyeksi equirectangular'}<span>Geser peta untuk pan</span></div>
    </div>
    <div className="map-legend"><div><strong>{labelFor(metric)}</strong><span>{unitFor(metric)} · skala nasional tetap</span></div>{metric === 'ikp_group' ? <div className="group-legend">{[1, 2, 3, 4, 5, 6].map(g => <span key={g}><i style={{ background: colorFor(g, metric, extent) }} />{g}</span>)}</div> : <div className="continuous-legend"><div style={{ background: `linear-gradient(90deg,${colorFor(extent[0], metric, extent)},${colorFor(extent[1], metric, extent)})` }} /><div>{[0, .25, .5, .75, 1].map(t => <span key={t}>{metric === 'undernourished_people' ? new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(extent[0] + (extent[1] - extent[0]) * t) : fmt(extent[0] + (extent[1] - extent[0]) * t, 1)}</span>)}</div></div>}<span className="missing-key"><i />Data tidak tersedia ({visible.length - valid})</span></div>
  </div>;
}
