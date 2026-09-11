export type District = { id: string; code: string; name: string; province: string; pouPct: number | null; population: number | null; undernourishedPeople: number | null; severityRank: number | null; scaleRank: number | null; severityPercentile: number | null; scalePercentile: number | null; persistenceSeverity?: number | null; persistenceScale?: number | null; pph?: number | null; energyKcalCapDay?: number | null; proteinGCapDay?: number | null; ikp?: number | null };
export type Portfolio = { severityWeight: number; reachWeight: number; capacity: number; districts: District[]; affectedPopulation: number; averagePou: number; medianPou: number; provinceCount: number; persistentPriorityCount: number };
const median = (values: number[]) => { const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; };

export function portfolioFor(districts: District[], severityWeight: number, capacity: number): Portfolio {
  const valid = districts.filter((district) => district.severityRank !== null && district.scaleRank !== null && district.undernourishedPeople !== null && district.pouPct !== null);
  const reachWeight = 1 - severityWeight;
  const selected = valid.map((district) => ({ district, score: severityWeight * district.severityPercentile! + reachWeight * district.scalePercentile! }))
    .sort((a, b) => b.score - a.score || a.district.code.localeCompare(b.district.code)).slice(0, capacity).map(({ district }) => district);
  const pous = selected.map((district) => district.pouPct!);
  return { severityWeight, reachWeight, capacity, districts: selected, affectedPopulation: selected.reduce((sum, district) => sum + district.undernourishedPeople!, 0), averagePou: pous.reduce((sum, value) => sum + value, 0) / pous.length, medianPou: median(pous), provinceCount: new Set(selected.map((district) => district.province)).size, persistentPriorityCount: selected.filter((district) => (district.persistenceSeverity ?? 0) > 0).length };
}
export type FrontierPoint = Portfolio & { key: string; efficient: boolean };
export function priorityFrontier(districts: District[], capacity: number): FrontierPoint[] {
  const unique = new Map<string, FrontierPoint>();
  for (let step = 0; step <= 20; step += 1) { const portfolio = portfolioFor(districts, step / 20, capacity); const key = portfolio.districts.map((district) => district.id).sort().join('|'); if (!unique.has(key)) unique.set(key, { ...portfolio, key, efficient: false }); }
  const points = [...unique.values()];
  return points.map((point) => ({ ...point, efficient: !points.some((other) => other.key !== point.key && other.affectedPopulation >= point.affectedPopulation && other.averagePou >= point.averagePou && (other.affectedPopulation > point.affectedPopulation || other.averagePou > point.averagePou)) }));
}
