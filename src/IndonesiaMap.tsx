import { useEffect, useMemo, useState } from "react";
import type { District } from "./scenarioEngine";

type Feature = {
  properties: { code: string };
  geometry: { type: string; coordinates: unknown };
};
type Hover = { district: District; x: number; y: number } | null;

const project = ([x, y]: number[]) => [(x - 94) * 18, (6 - y) * 23];
const rings = (geometry: Feature["geometry"]) =>
  geometry.type === "Polygon"
    ? [geometry.coordinates as number[][][]]
    : (geometry.coordinates as number[][][][]);
const makePath = (geometry: Feature["geometry"]) =>
  rings(geometry)
    .map((polygon) =>
      polygon
        .map(
          (ring) =>
            `M${ring
              .map((coordinate) =>
                project(coordinate)
                  .map((number) => number.toFixed(1))
                  .join(","),
              )
              .join("L")}Z`,
        )
        .join(""),
    )
    .join("");
const coordinates = (value: unknown, output: number[][] = []) => {
  if (Array.isArray(value) && typeof value[0] === "number") {
    output.push(value as number[]);
  } else if (Array.isArray(value)) {
    value.forEach((item) => coordinates(item, output));
  }
  return output;
};
const normalizeCode = (code: string) => code.replace(/\./g, "");
const rank = (value: number | null) => (value === null ? "—" : `#${value}`);

export function IndonesiaMap({
  districts,
  lens,
  selected,
  onSelect,
  portfolio,
  province,
}: {
  districts: District[];
  lens: "severity" | "scale" | "persistent";
  selected?: string;
  onSelect: (id: string) => void;
  portfolio?: Set<string>;
  province?: string;
}) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapError, setMapError] = useState(false);
  const [hover, setHover] = useState<Hover>(null);
  const [zoom, setZoom] = useState(1);
  const mapLoading = features.length === 0 && !mapError;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/indonesia_kabkota.geojson", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Map data could not be loaded");
        return response.json();
      })
      .then((geojson) => {
        setFeatures(geojson.features);
        setMapError(false);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMapError(true);
      });
    return () => controller.abort();
  }, []);

  const byCode = useMemo(
    () => new Map(districts.map((district) => [district.code, district])),
    [districts],
  );
  const paths = useMemo(
    () =>
      features.map((feature) => ({
        feature,
        path: makePath(feature.geometry),
      })),
    [features],
  );
  const values = districts
    .map((district) =>
      lens === "severity"
        ? district.pouPct
        : lens === "scale"
          ? district.undernourishedPeople
          : district.persistenceSeverity,
    )
    .filter((value): value is number => value !== null && value !== undefined);
  const maximum = values.length ? Math.max(...values) : 0;
  const minimum = values.length ? Math.min(...values) : 0;
  const chosen = features.find(
    (feature) =>
      byCode.get(normalizeCode(feature.properties.code))?.id === selected,
  );
  const viewBox = useMemo(() => {
    if (!chosen || zoom === 1) return "0 0 850 430";
    const points = coordinates(chosen.geometry.coordinates).map(project);
    const xs = points.map((point) => point[0]);
    const ys = points.map((point) => point[1]);
    const x = (Math.min(...xs) + Math.max(...xs)) / 2;
    const y = (Math.min(...ys) + Math.max(...ys)) / 2;
    const width = 850 / zoom;
    const height = 430 / zoom;
    return `${x - width / 2} ${y - height / 2} ${width} ${height}`;
  }, [chosen, zoom]);

  const metricValue = (district: District) =>
    lens === "severity"
      ? district.pouPct
      : lens === "scale"
        ? district.undernourishedPeople
        : district.persistenceSeverity;
  const fill = (district?: District) => {
    if (!district) return "#d7dce0";
    if (portfolio) {
      if (district.severityRank === null || district.scaleRank === null) {
        return "#d7dce0";
      }
      return portfolio.has(district.id) ? "#3f6f4e" : "#e7eaec";
    }
    const value = metricValue(district);
    if (value === null || value === undefined) return "#d7dce0";
    const intensity = (value - minimum) / (maximum - minimum || 1);
    return `rgb(${Math.round(229 - 154 * intensity)},${Math.round(235 - 104 * intensity)},${Math.round(225 - 142 * intensity)})`;
  };
  const hoverValue = (district: District) => {
    if (lens === "severity") {
      return district.pouPct === null
        ? "Unranked: official 2025 PoU observation unavailable"
        : `${district.pouPct.toFixed(2)}% PoU`;
    }
    if (lens === "scale") {
      return district.undernourishedPeople === null
        ? "Affected population not available"
        : `${district.undernourishedPeople.toLocaleString()} affected`;
    }
    return `${district.persistenceSeverity ?? 0} Top-15 years`;
  };

  return (
    <div className="map-shell">
      <div className="map-toolbar" aria-label="Map zoom controls">
        <button
          onClick={() => setZoom((current) => Math.min(7, current + 1))}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((current) => Math.max(1, current - 1))}
          aria-label="Zoom out"
        >
          −
        </button>
        <button onClick={() => setZoom(1)}>Reset</button>
      </div>
      {portfolio ? (
        <div className="map-legend portfolio-map-legend">
          <strong>Portfolio</strong>
          <span><i className="selected-swatch" /> Selected</span>
          <span><i className="context-swatch" /> Context</span>
          <span><i className="no-data-swatch" /> No data</span>
        </div>
      ) : (
        <div className="map-legend">
          <strong>
            {lens === "severity"
              ? "PoU (%)"
              : lens === "scale"
                ? "Affected population"
                : "Top-15 years"}
          </strong>
          <span>Low</span>
          <i />
          <span>High</span>
          <span className="nodata">■ No data</span>
        </div>
      )}
      {mapError && (
        <div className="map-error" role="status">
          District boundaries could not be loaded. Rankings remain available in
          the adjacent list.
        </div>
      )}
      {mapLoading && (
        <div className="map-loading" role="status" aria-live="polite">
          <i aria-hidden="true" /> Loading district boundaries…
        </div>
      )}
      {hover && (
        <div
          className="map-tooltip"
          style={{ left: hover.x, top: hover.y }}
        >
          <strong>{hover.district.name}</strong>
          <span>{hover.district.province}</span>
          <b>{hoverValue(hover.district)}</b>
          <small>
            Severity {rank(hover.district.severityRank)} · Reach{" "}
            {rank(hover.district.scaleRank)}
          </small>
        </div>
      )}
      <svg
        className="indo-map"
        viewBox={viewBox}
        role="img"
        aria-label="Interactive Indonesia district priority map"
      >
        {paths.map(({ feature, path }) => {
          const district = byCode.get(normalizeCode(feature.properties.code));
          const dimmed =
            province &&
            province !== "All provinces" &&
            district?.province !== province;
          const select = () => {
            if (!district) return;
            onSelect(district.id);
            setZoom(4);
          };
          return (
            <path
              tabIndex={district ? 0 : -1}
              key={feature.properties.code}
              d={path}
              fill={fill(district)}
              opacity={dimmed ? 0.2 : 1}
              className={selected === district?.id ? "map-selected" : ""}
              aria-label={
                district
                  ? `${district.name}, ${district.province}; ${hoverValue(district)}; Severity ${rank(district.severityRank)}, Reach ${rank(district.scaleRank)}`
                  : undefined
              }
              onMouseMove={(event) =>
                district &&
                setHover({
                  district,
                  x: event.nativeEvent.offsetX + 14,
                  y: event.nativeEvent.offsetY + 14,
                })
              }
              onMouseLeave={() => setHover(null)}
              onClick={select}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                select();
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
