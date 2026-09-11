import type { District } from "./scenarioEngine";

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
      ).map(([label, aValue, bValue]) => (
        <div className="paired-bars" key={label}>
          <strong>{label}</strong>
          <span>
            {a.name}
            <i style={{ width: `${(Number(aValue) / 503) * 100}%` }} />
            #{aValue}
          </span>
          <span>
            {b.name}
            <i style={{ width: `${(Number(bValue) / 503) * 100}%` }} />
            #{bValue}
          </span>
        </div>
      ))}
    </section>
  );
}
