export type District = {
  id: string;
  code: string;
  name: string;
  province: string;
  pouPct: number | null;
  population: number | null;
  undernourishedPeople: number | null;
  severityRank: number | null;
  scaleRank: number | null;
  severityPercentile: number | null;
  scalePercentile: number | null;
  persistenceSeverity?: number | null;
  persistenceScale?: number | null;
  severityTop15Years?: string[];
  scaleTop15Years?: string[];
  pph?: number | null;
  energyKcalCapDay?: number | null;
  proteinGCapDay?: number | null;
  ikp?: number | null;
  riskSignals?: Record<string, number>;
};

export type Portfolio = {
  severityWeight: number;
  reachWeight: number;
  capacity: number;
  districts: District[];
  affectedPopulation: number;
  averagePou: number;
  medianPou: number;
  provinceCount: number;
  persistentPriorityCount: number;
};

export type RankDivergence = {
  validDistricts: number;
  spearmanCorrelation: number;
  medianRankMovement: number;
  top15Overlap: number;
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (!sorted.length) return 0;
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function portfolioFor(
  districts: District[],
  severityWeight: number,
  capacity: number,
): Portfolio {
  const valid = districts.filter(
    (district) =>
      district.severityRank !== null &&
      district.scaleRank !== null &&
      district.severityPercentile !== null &&
      district.scalePercentile !== null &&
      district.undernourishedPeople !== null &&
      district.pouPct !== null,
  );
  const safeWeight = clamp(
    Number.isFinite(severityWeight) ? severityWeight : 0.5,
    0,
    1,
  );
  const safeCapacity = clamp(
    Math.round(Number.isFinite(capacity) ? capacity : 20),
    5,
    50,
  );
  const reachWeight = 1 - safeWeight;
  const selected = valid
    .map((district) => ({
      district,
      score:
        safeWeight * district.severityPercentile! +
        reachWeight * district.scalePercentile!,
    }))
    .sort(
      (a, b) =>
        b.score - a.score || a.district.code.localeCompare(b.district.code),
    )
    .slice(0, safeCapacity)
    .map(({ district }) => district);
  const pous = selected.map((district) => district.pouPct!);

  return {
    severityWeight: safeWeight,
    reachWeight,
    capacity: safeCapacity,
    districts: selected,
    affectedPopulation: selected.reduce(
      (sum, district) => sum + district.undernourishedPeople!,
      0,
    ),
    averagePou: pous.length
      ? pous.reduce((sum, value) => sum + value, 0) / pous.length
      : 0,
    medianPou: median(pous),
    provinceCount: new Set(selected.map((district) => district.province)).size,
    persistentPriorityCount: selected.filter(
      (district) =>
        (district.persistenceSeverity ?? 0) > 0 ||
        (district.persistenceScale ?? 0) > 0,
    ).length,
  };
}

export function rankDivergence(districts: District[]): RankDivergence {
  const valid = districts.filter(
    (district) =>
      district.severityRank !== null && district.scaleRank !== null,
  );
  if (!valid.length) {
    return {
      validDistricts: 0,
      spearmanCorrelation: 0,
      medianRankMovement: 0,
      top15Overlap: 0,
    };
  }

  const meanSeverity =
    valid.reduce((sum, district) => sum + district.severityRank!, 0) /
    valid.length;
  const meanScale =
    valid.reduce((sum, district) => sum + district.scaleRank!, 0) /
    valid.length;
  const covariance = valid.reduce(
    (sum, district) =>
      sum +
      (district.severityRank! - meanSeverity) *
        (district.scaleRank! - meanScale),
    0,
  );
  const severityVariance = valid.reduce(
    (sum, district) =>
      sum + (district.severityRank! - meanSeverity) ** 2,
    0,
  );
  const scaleVariance = valid.reduce(
    (sum, district) => sum + (district.scaleRank! - meanScale) ** 2,
    0,
  );
  const topSeverity = new Set(
    valid
      .filter((district) => district.severityRank! <= 15)
      .map((district) => district.id),
  );

  return {
    validDistricts: valid.length,
    spearmanCorrelation:
      covariance / Math.sqrt(severityVariance * scaleVariance || 1),
    medianRankMovement: median(
      valid.map((district) =>
        Math.abs(district.severityRank! - district.scaleRank!),
      ),
    ),
    top15Overlap: valid.filter(
      (district) => district.scaleRank! <= 15 && topSeverity.has(district.id),
    ).length,
  };
}

export type FrontierPoint = Portfolio & { key: string; efficient: boolean };

export function priorityFrontier(
  districts: District[],
  capacity: number,
): FrontierPoint[] {
  const unique = new Map<string, FrontierPoint>();
  for (let step = 0; step <= 20; step += 1) {
    const portfolio = portfolioFor(districts, step / 20, capacity);
    const key = portfolio.districts
      .map((district) => district.id)
      .sort()
      .join("|");
    if (!unique.has(key)) {
      unique.set(key, { ...portfolio, key, efficient: false });
    }
  }
  const points = [...unique.values()];
  return points.map((point) => ({
    ...point,
    efficient: !points.some(
      (other) =>
        other.key !== point.key &&
        other.affectedPopulation >= point.affectedPopulation &&
        other.averagePou >= point.averagePou &&
        (other.affectedPopulation > point.affectedPopulation ||
          other.averagePou > point.averagePou),
    ),
  }));
}
