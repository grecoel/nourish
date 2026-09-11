import type { District, Portfolio } from "./scenarioEngine";
export function RankScatter({
  districts,
  selected,
  onSelect,
}: {
  districts: District[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const valid = districts.filter((d) => d.severityRank && d.scaleRank);
  return (
    <section className="chart-card chart-wide">
      <div className="chart-title">
        <div>
          <h2>Severity–Reach rank reversal</h2>
          <p>
            Each point is a district. Distance from the diagonal shows how much
            its priority changes.
          </p>
        </div>
        <span>Click to select</span>
      </div>
      <svg viewBox="0 0 680 300">
        <line x1="52" y1="250" x2="630" y2="34" className="reference" />
        <line x1="52" y1="250" x2="630" y2="250" />
        <line x1="52" y1="24" x2="52" y2="250" />
        {valid.map((d) => (
          <circle
            key={d.id}
            cx={52 + ((d.scaleRank! - 1) / 502) * 578}
            cy={24 + ((d.severityRank! - 1) / 502) * 226}
            r={selected === d.id ? 5 : 2.7}
            className={selected === d.id ? "selected-dot" : ""}
            onClick={() => onSelect(d.id)}
          >
            <title>
              {d.name}: Severity #{d.severityRank}, Reach #{d.scaleRank}
            </title>
          </circle>
        ))}
        <text x="265" y="286">
          Reach rank → lower priority
        </text>
        <text x="10" y="170" transform="rotate(-90 10 170)">
          Severity rank → lower priority
        </text>
      </svg>
    </section>
  );
}
export function DistributionChart({
  districts,
  metric,
}: {
  districts: District[];
  metric: "pouPct" | "undernourishedPeople";
}) {
  const raw = districts
    .map((d) => d[metric])
    .filter((v): v is number => v !== null);
  const values =
    metric === "undernourishedPeople" ? raw.map((v) => Math.log10(v + 1)) : raw;
  const min = Math.min(...values),
    max = Math.max(...values),
    bins = Array(14).fill(0);
  values.forEach(
    (v) =>
      bins[Math.min(13, Math.floor(((v - min) / (max - min || 1)) * 14))]++,
  );
  const peak = Math.max(...bins);
  return (
    <section className="chart-card">
      <div className="chart-title">
        <div>
          <h2>
            {metric === "pouPct"
              ? "PoU distribution"
              : "Affected population distribution"}
          </h2>
          <p>
            {metric === "pouPct"
              ? "Prevalence across valid districts."
              : "Log scale keeps large districts readable."}
          </p>
        </div>
      </div>
      <div className="histogram">
        {bins.map((v, i) => (
          <i
            key={i}
            style={{ height: `${8 + (82 * v) / peak}%` }}
            title={`${v} districts in interval ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
export function PortfolioCharts({ portfolio }: { portfolio: Portfolio }) {
  const province = new Map<string, number>();
  portfolio.districts.forEach((d) =>
    province.set(d.province, (province.get(d.province) || 0) + 1),
  );
  const top = [...province].sort((a, b) => b[1] - a[1]).slice(0, 7),
    max = Math.max(...top.map((x) => x[1]));
  return (
    <section className="chart-row">
      <section className="chart-card">
        <div className="chart-title">
          <div>
            <h2>Portfolio by province</h2>
            <p>Selected district count—not impact.</p>
          </div>
        </div>
        <div className="bar-list">
          {top.map(([name, value]) => (
            <div key={name}>
              <span>{name}</span>
              <i style={{ width: `${(value / max) * 100}%` }}></i>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="chart-card">
        <div className="chart-title">
          <div>
            <h2>Selected rank profile</h2>
            <p>Lines compare both national ranks.</p>
          </div>
        </div>
        <svg className="rank-lines" viewBox="0 0 500 230">
          {portfolio.districts.map((d, i) => (
            <line
              key={d.id}
              x1={40 + (d.severityRank! / 503) * 180}
              y1={15 + i * 10}
              x2={280 + (d.scaleRank! / 503) * 180}
              y2={15 + i * 10}
            >
              <title>
                {d.name}: S #{d.severityRank}, R #{d.scaleRank}
              </title>
            </line>
          ))}
          <text x="40" y="225">
            Severity
          </text>
          <text x="280" y="225">
            Reach
          </text>
        </svg>
      </section>
    </section>
  );
}
export function DistrictRankChart({ a, b }: { a: District; b: District }) {
  return (
    <section className="chart-card district-chart">
      <div className="chart-title">
        <div>
          <h2>National rank contrast</h2>
          <p>Shorter bars mean stronger national priority.</p>
        </div>
      </div>
      {(
        [
          ["Severity", a.severityRank, b.severityRank],
          ["Reach", a.scaleRank, b.scaleRank],
        ] as const
      ).map(([label, av, bv]) => (
        <div className="paired-bars" key={label}>
          <strong>{label}</strong>
          <span>
            {a.name}
            <i style={{ width: `${(Number(av) / 503) * 100}%` }}></i>#{av}
          </span>
          <span>
            {b.name}
            <i style={{ width: `${(Number(bv) / 503) * 100}%` }}></i>#{bv}
          </span>
        </div>
      ))}
    </section>
  );
}
