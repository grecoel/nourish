import type { District, Portfolio } from './scenarioEngine';

export type PolicyChunk = { id: string; sourceTitle: string; sourceFile: string; page: number | null; text: string };
export type AskContext = { page: 'atlas' | 'scenario' | 'district'; selectedDistrict?: District; portfolio?: Portfolio; comparison?: Portfolio; activeLens?: 'severity' | 'scale' };
const tokens = (text: string) => text.toLowerCase().match(/[a-z]{3,}/g) ?? [];
export function retrieve(question: string, corpus: PolicyChunk[], limit = 3) {
  const query = new Set(tokens(question));
  return corpus.map((chunk) => ({ chunk, score: tokens(chunk.text).reduce((sum, token) => sum + (query.has(token) ? 1 : 0), 0) + (tokens(chunk.sourceTitle).some((token) => query.has(token)) ? 2 : 0) }))
    .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id)).slice(0, limit).map(({ chunk }) => chunk);
}
export function factualAnswer(question: string, context: AskContext) {
  const district = context.selectedDistrict; const portfolio = context.portfolio; const lower = question.toLowerCase();
  if (lower.includes('not tell') || lower.includes('cannot')) return 'The available data describes prevalence, affected population, and contextual indicators. It does not establish why undernourishment occurs, prove that a risk signal caused it, predict intervention effectiveness, or determine the correct policy choice.';
  if (context.comparison && (lower.includes('changed') || lower.includes('enter') || lower.includes('left'))) { const before = new Set(context.comparison.districts.map((item) => item.id)); const after = new Set(portfolio?.districts.map((item) => item.id)); const entered = portfolio?.districts.filter((item) => !before.has(item.id)).slice(0, 5).map((item) => item.name).join(', ') || 'none'; const left = context.comparison.districts.filter((item) => !after.has(item.id)).slice(0, 5).map((item) => item.name).join(', ') || 'none'; return `The active portfolio has ${entered === 'none' ? 'no new districts' : `new entries including ${entered}`}; compared with the pinned portfolio, exits include ${left}. The change comes from the visible severity/reach weights, not from an AI recommendation.`; }
  if (district && portfolio) return `${district.name} is ${portfolio.districts.some((item) => item.id === district.id) ? 'inside' : 'outside'} the current ${portfolio.capacity}-district portfolio. Its national Severity rank is #${district.severityRank} and Scale rank is #${district.scaleRank}; the current weights are Severity ${Math.round(portfolio.severityWeight * 100)}% and Reach ${Math.round(portfolio.reachWeight * 100)}%.`;
  if (portfolio) return `The active portfolio selects ${portfolio.capacity} districts at Severity ${Math.round(portfolio.severityWeight * 100)}% / Reach ${Math.round(portfolio.reachWeight * 100)}%. It represents ${Math.round(portfolio.affectedPopulation).toLocaleString()} affected people, with average PoU ${portfolio.averagePou.toFixed(2)}%.`;
  return 'Ask NOURISH can explain the current data context and trace it to curated local policy evidence. It does not choose a priority portfolio.';
}
