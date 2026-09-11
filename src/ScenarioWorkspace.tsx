import { useMemo, useState } from "react";
import { IndonesiaMap } from "./IndonesiaMap";
import {
  portfolioFor,
  priorityFrontier,
  type District,
} from "./scenarioEngine";
import { useExperience } from "./ExperienceContext";

const compact = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
const pct = (value: number) => `${value.toFixed(1)}%`;

export function ScenarioWorkspace({
  districts,
  navigate,
}: {
  districts: District[];
  navigate: (path: string) => void;
}) {
  const { state, update } = useExperience();
  const [configure, setConfigure] = useState(false),
    [draftCapacity, setDraftCapacity] = useState(state.capacity),
    [draftSeverity, setDraftSeverity] = useState(
      Math.round(state.severityWeight * 100),
    );
  const portfolio = useMemo(
    () => portfolioFor(districts, state.severityWeight, state.capacity),
    [districts, state.severityWeight, state.capacity],
  );
  const frontier = useMemo(
    () => priorityFrontier(districts, state.capacity),
    [districts, state.capacity],
  );
  const selected =
    districts.find((d) => d.id === state.selectedDistrictId) ??
    portfolio.districts[0];
  const provinceCounts = useMemo(() => {
    const map = new Map<string, number>();
    portfolio.districts.forEach((d) =>
      map.set(d.province, (map.get(d.province) || 0) + 1),
    );
    return [...map].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [portfolio]);
  const minX = Math.min(...frontier.map((p) => p.affectedPopulation)),
    maxX = Math.max(...frontier.map((p) => p.affectedPopulation)),
    minY = Math.min(...frontier.map((p) => p.averagePou)),
    maxY = Math.max(...frontier.map((p) => p.averagePou));
  const currentIsSwept = frontier.some(
    (point) =>
      Math.abs(point.severityWeight - state.severityWeight) < 0.001,
  );
  const plotX = (affectedPopulation: number) =>
    55 + ((affectedPopulation - minX) / (maxX - minX || 1)) * 560;
  const plotY = (averagePou: number) =>
    140 - ((averagePou - minY) / (maxY - minY || 1)) * 125;
  const apply = () => {
    update({ capacity: draftCapacity, severityWeight: draftSeverity / 100 });
    setConfigure(false);
  };
  return (
    <main className="scenario-v2">
      <section className="scenario-topbar">
        <div>
          <h1>Scenario Lab</h1>
          <p>
            Compare district portfolios under one explicit capacity and
            objective.
          </p>
        </div>
        <div className="scenario-current">
          <span>
            Capacity <b>{state.capacity}</b>
          </span>
          <span>
            Severity <b>{Math.round(state.severityWeight * 100)}%</b>
          </span>
          <span>
            Reach <b>{Math.round((1 - state.severityWeight) * 100)}%</b>
          </span>
          <button
            className="secondary"
            onClick={() => {
              setDraftCapacity(state.capacity);
              setDraftSeverity(Math.round(state.severityWeight * 100));
              setConfigure(true);
            }}
          >
            Configure scenario
          </button>
          <button className="primary" onClick={() => navigate("/ask")}>
            Ask NOURISH
          </button>
        </div>
      </section>
      <section className="metric-ribbon">
        <article>
          <span>Affected population represented</span>
          <strong>{compact(portfolio.affectedPopulation)}</strong>
          <small>Sum across selected districts</small>
        </article>
        <article>
          <span>Average PoU</span>
          <strong>{pct(portfolio.averagePou)}</strong>
          <small>Mean prevalence</small>
        </article>
        <article>
          <span>Median PoU</span>
          <strong>{pct(portfolio.medianPou)}</strong>
          <small>Middle selected district</small>
        </article>
        <article>
          <span>Coverage</span>
          <strong>{portfolio.provinceCount} provinces</strong>
          <small>
            {portfolio.persistentPriorityCount} previously Top-15 under either
            lens
          </small>
        </article>
      </section>
      <section className="scenario-main">
        <div className="scenario-map">
          <div className="panel-heading">
            <div>
              <h2>Where is the selected portfolio?</h2>
              <p>Green districts are included. Click one to inspect it.</p>
            </div>
            <span className="legend-key">
              <i /> Selected <i /> Context
            </span>
          </div>
          <IndonesiaMap
            districts={districts}
            lens="severity"
            portfolio={new Set(portfolio.districts.map((d) => d.id))}
            selected={selected.id}
            onSelect={(id) => update({ selectedDistrictId: id })}
          />
        </div>
        <aside className="portfolio-panel">
          <div className="panel-heading">
            <div>
              <h2>Which districts are selected?</h2>
              <p>Ordered by the current weighted scenario score.</p>
            </div>
            <b>{portfolio.districts.length}</b>
          </div>
          <div className="portfolio-scroll">
            {portfolio.districts.map((d, i) => (
              <button
                key={d.id}
                className={d.id === selected.id ? "selected" : ""}
                onClick={() => update({ selectedDistrictId: d.id })}
              >
                <b>{i + 1}</b>
                <span>
                  <strong>{d.name}</strong>
                  <small>
                    {d.province} · PoU {d.pouPct?.toFixed(1)}% ·{" "}
                    {compact(d.undernourishedPeople!)} affected
                  </small>
                </span>
                <em>
                  S #{d.severityRank}
                  <br />R #{d.scaleRank}
                </em>
              </button>
            ))}
          </div>
          <div className="portfolio-action">
            <span>
              Focused: <b>{selected.name}</b>{" "}
              <small>
                {portfolio.districts.some((district) => district.id === selected.id)
                  ? "Inside portfolio"
                  : "Outside portfolio"}
              </small>
            </span>
            <button onClick={() => navigate(`/district/${selected.id}`)}>
              Open district →
            </button>
          </div>
        </aside>
      </section>
      <section className="scenario-analysis">
        <article className="frontier-v2">
          <div className="panel-heading">
            <div>
              <h2>What trade-off does the weighting create?</h2>
              <p>
                Right represents more affected people; higher represents greater
                average PoU.
              </p>
            </div>
            <span>
              <i className="active-key" /> Current{" "}
              <i className="efficient-key" /> Efficient
            </span>
          </div>
          <svg viewBox="0 0 640 175" aria-label="Priority Frontier">
            <line x1="55" y1="140" x2="615" y2="140" />
            <line x1="55" y1="15" x2="55" y2="140" />
            {frontier.map((point) => {
              const x = plotX(point.affectedPopulation),
                y = plotY(point.averagePou),
                active =
                  Math.abs(point.severityWeight - state.severityWeight) < 0.001;
              return (
                <circle
                  key={point.key}
                  cx={x}
                  cy={y}
                  r={active ? 6 : point.efficient ? 4 : 3}
                  className={
                    active ? "active" : point.efficient ? "efficient" : ""
                  }
                  onClick={() =>
                    update({ severityWeight: point.severityWeight })
                  }
                >
                  <title>
                    Severity {Math.round(point.severityWeight * 100)}% / Reach{" "}
                    {Math.round(point.reachWeight * 100)}% ·{" "}
                    {compact(point.affectedPopulation)} affected ·{" "}
                    {pct(point.averagePou)} average PoU
                  </title>
                </circle>
              );
            })}
            {!currentIsSwept && (
              <circle
                cx={plotX(portfolio.affectedPopulation)}
                cy={plotY(portfolio.averagePou)}
                r="6"
                className="active"
              >
                <title>
                  Current: Severity {Math.round(portfolio.severityWeight * 100)}%
                  {" / "}Reach {Math.round(portfolio.reachWeight * 100)}% ·{" "}
                  {compact(portfolio.affectedPopulation)} affected ·{" "}
                  {pct(portfolio.averagePou)} average PoU
                </title>
              </circle>
            )}
            <text x="250" y="168">
              Affected population represented →
            </text>
            <text x="12" y="125" transform="rotate(-90 12 125)">
              Average PoU →
            </text>
          </svg>
        </article>
        <article className="province-v2">
          <div className="panel-heading">
            <div>
              <h2>How geographically concentrated is it?</h2>
              <p>
                Number of selected districts in the most represented provinces.
              </p>
            </div>
          </div>
          <div>
            {provinceCounts.map(([name, count]) => (
              <p key={name}>
                <span>{name}</span>
                <i>
                  <b
                    style={{
                      width: `${(count / Math.max(...provinceCounts.map((x) => x[1]))) * 100}%`,
                    }}
                  />
                </i>
                <strong>{count}</strong>
              </p>
            ))}
          </div>
        </article>
      </section>
      {configure && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfigure(false);
          }}
        >
          <section
            className="scenario-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scenario-modal-title"
          >
            <header>
              <div>
                <h2 id="scenario-modal-title">Configure scenario</h2>
                <p>
                  These are user-defined planning assumptions, not official
                  policy weights.
                </p>
              </div>
              <button onClick={() => setConfigure(false)} aria-label="Close">
                ×
              </button>
            </header>
            <div className="preset-grid">
              {[
                ["Severity First", 80],
                ["Balanced", 50],
                ["Reach First", 20],
              ].map(([name, value]) => (
                <button
                  className={draftSeverity === value ? "selected" : ""}
                  key={name}
                  onClick={() => setDraftSeverity(value as number)}
                >
                  <b>{name}</b>
                  <span>
                    {value}% Severity · {100 - Number(value)}% Reach
                  </span>
                </button>
              ))}
            </div>
            <label>
              Priority capacity <span>Number of districts, 5–50</span>
              <input
                type="number"
                min="5"
                max="50"
                value={draftCapacity}
                onChange={(e) =>
                  setDraftCapacity(
                    Math.max(5, Math.min(50, Number(e.target.value))),
                  )
                }
              />
            </label>
            <div className="weight-inputs">
              <label>
                Severity weight (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={draftSeverity}
                  onChange={(e) =>
                    setDraftSeverity(
                      Math.max(0, Math.min(100, Number(e.target.value))),
                    )
                  }
                />
              </label>
              <label>
                Reach weight (%)
                <input type="number" value={100 - draftSeverity} readOnly />
              </label>
            </div>
            <div className="formula-note">
              Scenario score = Severity weight × Severity percentile + Reach
              weight × Reach percentile.
            </div>
            <footer>
              <button className="secondary" onClick={() => setConfigure(false)}>
                Cancel
              </button>
              <button className="primary" onClick={apply}>
                Apply scenario
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
