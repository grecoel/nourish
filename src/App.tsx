import { useEffect, useMemo, useState } from "react";
import { rankDivergence, type District } from "./scenarioEngine";
import { IndonesiaMap } from "./IndonesiaMap";
import { DistrictRankChart } from "./AnalyticsCharts";
import { ExperienceProvider, useExperience } from "./ExperienceContext";
import { ScenarioWorkspace } from "./ScenarioWorkspace";
import { AskWorkspace } from "./AskWorkspace";

type Lens = "severity" | "scale";
const fmt = new Intl.NumberFormat("en-US");
const number = (value: number | null) =>
  value === null ? "Not available" : fmt.format(Math.round(value));
const percent = (value: number | null) =>
  value === null ? "Not available" : `${value.toFixed(2)}%`;
const rank = (value: number | null) => (value === null ? "—" : `#${value}`);
const isRanked = (district: District) =>
  district.severityRank !== null && district.scaleRank !== null;

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
function explanation(district: District) {
  if (district.severityRank === null || district.scaleRank === null)
    return "This district is not ranked because a valid 2025 PoU observation is not available.";
  const gap = district.scaleRank - district.severityRank;
  if (district.severityRank <= 100 && gap >= 100)
    return "This district rises under Severity because its prevalence is high nationally, despite a smaller absolute affected population.";
  if (district.scaleRank <= 100 && gap <= -100)
    return "This district rises under Scale because its absolute affected population is large, despite a lower prevalence rank.";
  if (district.severityRank <= 100 && district.scaleRank <= 100)
    return "This district remains prominent under both lenses because it combines high prevalence with a large affected population.";
  return "Its position changes because prevalence and the absolute affected population measure different dimensions of need.";
}

function Shell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  const { state } = useExperience();
  const nav = [
    { label: "Atlas", path: "/" },
    { label: "Scenario Lab", path: "/scenario" },
    {
      label: "District Lens",
      path: `/district/${state.selectedDistrictId ?? "id-9120"}`,
    },
    { label: "Ask NOURISH", path: "/ask" },
  ];
  return (
    <>
      <header>
        <button className="brand" onClick={() => navigate("/")}>
          <span>NOURISH</span>
          <small>SDG 2 Zero Hunger · Indonesia deep dive · ASEAN framework</small>
        </button>
        <nav>
          {nav.map((item) => (
            <button
              className={active === item.label ? "active" : ""}
              onClick={() => navigate(item.path)}
              key={item.label}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="journey-bar" aria-label="NOURISH workflow">
        <button
          className={active === "Atlas" ? "current" : ""}
          onClick={() => navigate("/")}
        >
          <b>1</b>
          <span>Where</span>
        </button>
        <i>→</i>
        <button
          className={active === "Scenario Lab" ? "current" : ""}
          onClick={() => navigate("/scenario")}
        >
          <b>2</b>
          <span>Test scenario</span>
        </button>
        <i>→</i>
        <button
          className={active === "District Lens" ? "current" : ""}
          onClick={() =>
            navigate(`/district/${state.selectedDistrictId ?? "id-9120"}`)
          }
        >
          <b>3</b>
          <span>Explain district</span>
        </button>
        <i>→</i>
        <button
          className={active === "Ask NOURISH" ? "current" : ""}
          onClick={() => navigate("/ask")}
        >
          <b>4</b>
          <span>Trace evidence</span>
        </button>
      </div>
      {children}
    </>
  );
}
function DistrictNotFound() {
  return (
    <Shell active="District Lens">
      <main className="placeholder">
        <p className="eyebrow">DISTRICT LENS</p>
        <h1>District not found</h1>
        <p>
          The requested district is not in the current 514-district dataset.
          Return to the Atlas to choose a validated district record.
        </p>
        <button className="primary" onClick={() => navigate("/")}>
          Open Priority Atlas
        </button>
      </main>
    </Shell>
  );
}

function Atlas({ districts }: { districts: District[] }) {
  const { state, update } = useExperience();
  const lens = state.activeLens;
  const setLens = (next: Lens) => update({ activeLens: next });
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("All provinces");
  const selected = state.selectedDistrictId;
  const setSelected = (id: string) => update({ selectedDistrictId: id });
  const valid = useMemo(
    () => districts.filter(isRanked),
    [districts],
  );
  const divergence = useMemo(() => rankDivergence(districts), [districts]);
  const provinces = [...new Set(districts.map((d) => d.province))].sort();
  const ranked = useMemo(
    () =>
      valid
        .filter((d) => province === "All provinces" || d.province === province)
        .filter((d) =>
          `${d.name} ${d.province}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          lens === "severity"
            ? a.severityRank! - b.severityRank!
            : a.scaleRank! - b.scaleRank!,
        ),
    [valid, lens, query, province],
  );
  const selectedDistrict = districts.find(
    (district) => district.id === selected,
  );
  return (
    <Shell active="Atlas">
      <main>
        <section className="intro">
          <div>
            <h1>Priority Atlas</h1>
            <p>
              The planning objective changes which places rise to the top.{" "}
              <small>
                {divergence.validDistricts} valid districts · Indonesia · 2025
              </small>
            </p>
          </div>
        </section>
        <section className="insight-ribbon" aria-label="National rank divergence">
          <div>
            <strong>{divergence.top15Overlap}</strong>
            <span>shared districts</span>
            <small>between the two Top-15 lists</small>
          </div>
          <div>
            <strong>{divergence.medianRankMovement}</strong>
            <span>places</span>
            <small>median movement between lenses</small>
          </div>
          <div>
            <strong>{divergence.spearmanCorrelation.toFixed(3)}</strong>
            <span>rank correlation</span>
            <small>weak Severity–Reach relationship</small>
          </div>
          <p>
            Neither lens is universally correct. Switch the objective to see
            the resulting geography.
          </p>
        </section>
        <section className="atlas-head">
          <div className="lens-switch" aria-label="Priority lens">
            <button
              className={lens === "severity" ? "selected" : ""}
              onClick={() => setLens("severity")}
            >
              Severity
              <small>Prevalence of undernourishment</small>
            </button>
            <button
              className={lens === "scale" ? "selected" : ""}
              onClick={() => setLens("scale")}
            >
              Reach
              <small>Absolute affected population</small>
            </button>
          </div>
          <div className="filters">
            <input
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                const match = districts.find((district) =>
                  `${district.name} ${district.province}`
                    .toLowerCase()
                    .includes(value.toLowerCase()),
                );
                if (value.length > 2 && match) setSelected(match.id);
              }}
              placeholder="Find and focus a district"
            />
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              <option>All provinces</option>
              {provinces.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>
        <section className="atlas-workspace">
          <IndonesiaMap
            districts={districts}
            lens={lens}
            selected={selected}
            onSelect={setSelected}
            province={province}
          />
          <section className="table-wrap">
            <div className="table-caption">
              <span>Highest-ranked matches</span>
              <span>
                National rank ·{" "}
                {lens === "severity" ? "PoU" : "Affected population"}
              </span>
            </div>
            {selectedDistrict && (
              <div className="atlas-selection">
                <small>Selected district</small>
                <h2>{selectedDistrict.name}</h2>
                <p>{selectedDistrict.province}</p>
                <div>
                  <span>
                    Severity <strong>{rank(selectedDistrict.severityRank)}</strong>
                  </span>
                  <span>
                    Reach <strong>{rank(selectedDistrict.scaleRank)}</strong>
                  </span>
                  <span>
                    Movement{" "}
                    <strong>
                      {isRanked(selectedDistrict)
                        ? `${Math.abs(
                            selectedDistrict.scaleRank! -
                              selectedDistrict.severityRank!,
                          )} places`
                        : "Not ranked"}
                    </strong>
                  </span>
                </div>
                <p>
                  {percent(selectedDistrict.pouPct)} PoU ·{" "}
                  {number(selectedDistrict.undernourishedPeople)} affected
                </p>
                {!isRanked(selectedDistrict) && (
                  <small className="missing-note">
                    Valid 2025 PoU is unavailable. NOURISH preserves the value
                    as missing rather than treating it as zero.
                  </small>
                )}
              </div>
            )}
            <div className="district-table">
              {ranked.slice(0, 15).map((district) => (
                <button
                  className={`table-row district-row ${selected === district.id ? "row-selected" : ""}`}
                  onClick={() => setSelected(district.id)}
                  key={district.id}
                >
                  <span className="rank">
                    #
                    {lens === "severity"
                      ? district.severityRank
                      : district.scaleRank}
                  </span>
                  <strong>
                    {district.name}
                    <small>
                      {district.province} · {percent(district.pouPct)} ·{" "}
                      {number(district.undernourishedPeople)}
                    </small>
                    <small className="rank-movement">
                      {district.scaleRank! < district.severityRank! ? "↑" : "↓"}{" "}
                      {Math.abs(district.scaleRank! - district.severityRank!)}{" "}
                      places across lenses
                    </small>
                  </strong>
                  <span
                    className="arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/district/${district.id}`);
                    }}
                  >
                    Open →
                  </span>
                </button>
              ))}
              {ranked.length === 0 && (
                <div className="no-results">
                  <strong>No ranked districts match these filters.</strong>
                  <span>
                    Districts without valid 2025 PoU remain visible as no-data
                    areas on the map.
                  </span>
                </div>
              )}
            </div>
            {selected && (
              <div className="next-actions">
                <button
                  className="secondary"
                  onClick={() => navigate(`/district/${selected}`)}
                >
                  Explain district
                </button>
                <button
                  className="primary"
                  onClick={() => navigate("/scenario")}
                  disabled={
                    selectedDistrict ? !isRanked(selectedDistrict) : false
                  }
                  title={
                    selectedDistrict && !isRanked(selectedDistrict)
                      ? "This district cannot enter a scenario without valid 2025 ranks."
                      : undefined
                  }
                >
                  Use in Scenario Lab →
                </button>
              </div>
            )}
          </section>
        </section>
      </main>
    </Shell>
  );
}
function DistrictLens({
  district,
  districts,
}: {
  district: District | undefined;
  districts: District[];
}) {
  const { state, update } = useExperience();
  useEffect(() => {
    if (district) update({ selectedDistrictId: district.id });
  }, [district?.id]);
  if (!district) return <DistrictNotFound />;
  const defaultCompareId =
    district.code === "9120" ? "id-3201" : "id-9120";
  const storedPeer = districts.find(
    (item) =>
      item.id === state.comparisonDistrictId &&
      item.id !== district.id &&
      isRanked(item),
  );
  const compareId = storedPeer?.id ?? defaultCompareId;
  const setCompareId = (id: string) => update({ comparisonDistrictId: id });
  const peer = districts.find((item) => item.id === compareId);
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2025"];
  const metricValue = (key: keyof District, value: District[keyof District]) => {
    if (value === null || value === undefined) return "Not available";
    if (key === "pouPct") return percent(value as number);
    if (key === "undernourishedPeople" || key === "population") {
      return number(value as number);
    }
    if (key === "severityRank" || key === "scaleRank") {
      return rank(value as number);
    }
    if (typeof value === "number") return value.toFixed(1);
    return String(value);
  };
  const metric = (label: string, key: keyof District) => (
    <div className="compare-row">
      <span>{label}</span>
      <strong>{metricValue(key, district[key])}</strong>
      <strong>{peer ? metricValue(key, peer[key]) : "—"}</strong>
    </div>
  );
  return (
    <Shell active="District Lens">
      <main className="lens-page">
        <button className="back" onClick={() => navigate("/")}>
          ← Back to Atlas
        </button>
        <p className="eyebrow">DISTRICT LENS · 2025 SNAPSHOT</p>
        <h1>{district.name}</h1>
        <p className="province">
          {district.province} · Severity {rank(district.severityRank)} · Reach{" "}
          {rank(district.scaleRank)}
          {isRanked(district)
            ? ` · ${
                district.severityRank! < district.scaleRank!
                  ? "Severity lens gives this district a stronger rank"
                  : "Reach lens gives this district a stronger rank"
              }`
            : " · Not ranked because valid 2025 PoU is unavailable"}
        </p>
        <section className="district-summary">
          <div>
            <span>PoU</span>
            <strong>{percent(district.pouPct)}</strong>
            <small>Prevalence of undernourishment</small>
          </div>
          <div>
            <span>Affected population</span>
            <strong>{number(district.undernourishedPeople)}</strong>
            <small>Absolute undernourished population</small>
          </div>
          <div>
            <span>Total population</span>
            <strong>{number(district.population)}</strong>
            <small>2025 district population</small>
          </div>
        </section>
        <section className="rank-panel">
          <div>
            <span>National Severity rank</span>
            <strong>#{district.severityRank ?? "—"}</strong>
          </div>
          <div>
            <span>National Scale rank</span>
            <strong>#{district.scaleRank ?? "—"}</strong>
          </div>
          <div>
            <span>Absolute rank gap</span>
            <strong>
              {district.severityRank && district.scaleRank
                ? Math.abs(district.severityRank - district.scaleRank)
                : "—"}
            </strong>
          </div>
        </section>
        {peer && isRanked(district) && isRanked(peer) ? (
          <DistrictRankChart a={district} b={peer} />
        ) : (
          <div className="missing-comparison">
            A national rank chart is unavailable for an unranked district.
          </div>
        )}
        <section className="why">
          <p className="eyebrow">WHY THIS DISTRICT?</p>
          <p>{explanation(district)}</p>
          <small>
            Deterministic rank-based explanation; not AI reasoning or a causal
            finding.
          </small>
        </section>
        <section className="detail-grid">
          <div>
            <p className="eyebrow">TOP-15 PERSISTENCE</p>
            <p>
              Observed years only: 2018–2023, 2025. 2024 is unavailable and not
              interpolated.
            </p>
            <div>
              Severity:{" "}
              {years.map((y) => (
                <b
                  className={
                    district.severityTop15Years?.includes(y)
                      ? "filled"
                      : ""
                  }
                  key={y}
                >
                  {y.slice(2)}
                </b>
              ))}
            </div>
            <div>
              Scale:{" "}
              {years.map((y) => (
                <b
                  className={
                    district.scaleTop15Years?.includes(y)
                      ? "filled"
                      : ""
                  }
                  key={y}
                >
                  {y.slice(2)}
                </b>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">FOOD-SECURITY PROFILE</p>
            <p>
              PPH: {number(district.pph ?? null)} · Energy:{" "}
              {number(district.energyKcalCapDay ?? null)} kcal/cap/day ·
              Protein: {number(district.proteinGCapDay ?? null)} g/cap/day ·
              IKP: {number(district.ikp ?? null)}
            </p>
            <p>
              Risk signals:{" "}
              {Object.entries(district.riskSignals ?? {})
                .map(([label, value]) => `${label} ${value}`)
                .join(" · ") || "Data unavailable"}
            </p>
            <small>
              Supporting context only; risk signals are not percentages, causes,
              or intervention prescriptions.
            </small>
          </div>
        </section>
        <section className="comparison">
          <p className="eyebrow">COMPARE DISTRICTS</p>
          <select
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
          >
            {districts
              .filter((item) => item.id !== district.id && isRanked(item))
              .map((d) => (
                <option value={d.id} key={d.id}>
                  {d.name} — {d.province}
                </option>
              ))}
          </select>
          {peer && (
            <div className="compare-table">
              <div className="compare-row headings">
                <span>Metric</span>
                <span>{district.name}</span>
                <span>{peer.name}</span>
              </div>
              {metric("PoU", "pouPct")}
              {metric("Affected population", "undernourishedPeople")}
              {metric("Population", "population")}
              {metric("Severity rank", "severityRank")}
              {metric("Scale rank", "scaleRank")}
              {metric("PPH", "pph")}
              {metric("Energy", "energyKcalCapDay")}
              {metric("Protein", "proteinGCapDay")}
              <p>
                {isRanked(district) &&
                isRanked(peer) &&
                (district.severityRank! - peer.severityRank!) *
                  (district.scaleRank! - peer.scaleRank!) <
                  0
                  ? "This pair reverses priority across lenses: one district has the stronger Severity rank while the other has the stronger Reach rank."
                  : "Compare the two national rank pairs to see how their priority differs by lens."}
              </p>
            </div>
          )}
        </section>
        <section className="next-step">
          <div>
            <strong>Need policy context?</strong>
            <span>Ask NOURISH will use this district automatically.</span>
          </div>
          <button className="primary" onClick={() => navigate("/ask")}>
            Trace the evidence →
          </button>
        </section>
      </main>
    </Shell>
  );
}
function AppContent() {
  const [districts, setDistricts] = useState<District[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/districts_2025.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("District data could not be loaded");
        return response.json();
      })
      .then((data) => {
        setDistricts(data);
        setLoadError(false);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });
    const listener = () => setPath(window.location.pathname);
    addEventListener("popstate", listener);
    return () => {
      controller.abort();
      removeEventListener("popstate", listener);
    };
  }, []);
  if (loadError) {
    return (
      <div className="loading-error" role="alert">
        <strong>Validated district data could not be loaded.</strong>
        <span>Refresh the page or verify that the app-data files are present.</span>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }
  if (!districts)
    return <div className="loading">Loading validated 2025 district data…</div>;
  if (path.startsWith("/district/"))
    return (
      <DistrictLens
        district={districts.find((d) => d.id === path.split("/").pop())}
        districts={districts}
      />
    );
  if (path === "/scenario")
    return (
      <Shell active="Scenario Lab">
        <ScenarioWorkspace districts={districts} navigate={navigate} />
      </Shell>
    );
  if (path === "/ask")
    return (
      <Shell active="Ask NOURISH">
        <AskWorkspace districts={districts} navigate={navigate} />
      </Shell>
    );
  return <Atlas districts={districts} />;
}

export default function App() {
  return (
    <ExperienceProvider>
      <AppContent />
    </ExperienceProvider>
  );
}
