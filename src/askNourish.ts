import type { District, Portfolio } from "./scenarioEngine";

export type PolicyChunk = {
  id: string;
  sourceTitle: string;
  sourceFile: string;
  page: number | null;
  text: string;
};

export type AskContext = {
  page: "atlas" | "scenario" | "district";
  selectedDistrict?: District;
  portfolio?: Portfolio;
  comparison?: Portfolio;
  activeLens?: "severity" | "scale";
};

const STOP_WORDS = new Set([
  "about",
  "am",
  "are",
  "can",
  "data",
  "did",
  "does",
  "from",
  "here",
  "how",
  "into",
  "not",
  "tell",
  "that",
  "the",
  "this",
  "under",
  "what",
  "when",
  "where",
  "which",
  "why",
  "with",
]);

const tokens = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

function policyQueryTerms(question: string) {
  const lower = question.toLowerCase();
  const terms = new Set(tokens(question));
  const isDecisionQuestion =
    /policy|evidence|priority|rank|rise|selected|scenario|trade.?off|objective|portfolio/.test(
      lower,
    );

  if (isDecisionQuestion) {
    [
      "food",
      "security",
      "planning",
      "monitoring",
      "information",
      "systems",
      "resilience",
    ].forEach((term) => terms.add(term));
  }
  return terms;
}

export function retrieve(
  question: string,
  corpus: PolicyChunk[],
  limit = 3,
) {
  const query = policyQueryTerms(question);
  if (!query.size) return [];

  return corpus
    .map((chunk) => {
      const title = new Set(tokens(chunk.sourceTitle));
      const content = tokens(chunk.text);
      const counts = new Map<string, number>();
      content.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
      let score = 0;
      query.forEach((term) => {
        if (title.has(term)) score += 3;
        score += Math.min(counts.get(term) ?? 0, 3);
      });
      const normalized = chunk.text.toLowerCase().replace(/[-–—]/g, " ");
      if (normalized.includes("food security")) score += 8;
      if (normalized.includes("information systems")) score += 5;
      if (normalized.includes("planning and monitoring")) score += 4;
      return { chunk, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.chunk.id.localeCompare(b.chunk.id),
    )
    .slice(0, limit)
    .map(({ chunk }) => chunk);
}

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const rank = (value: number | null) => (value === null ? "not ranked" : `#${value}`);

function rankExplanation(district: District) {
  if (district.severityRank === null || district.scaleRank === null) {
    return `${district.name} is not ranked because a valid 2025 PoU observation is unavailable. NOURISH leaves the value missing rather than treating it as zero.`;
  }
  const severityIsStronger = district.severityRank < district.scaleRank;
  const movement = Math.abs(district.severityRank - district.scaleRank);
  const strongerLens = severityIsStronger ? "Severity" : "Reach";
  const basis = severityIsStronger
    ? `${district.pouPct?.toFixed(2)}% PoU expresses a high relative burden, while ${whole.format(district.undernourishedPeople ?? 0)} affected people produces a weaker absolute rank`
    : `${whole.format(district.undernourishedPeople ?? 0)} affected people produces a strong absolute rank, while ${district.pouPct?.toFixed(2)}% PoU produces a weaker relative rank`;
  return `${district.name} is stronger under ${strongerLens}: Severity ${rank(district.severityRank)} versus Reach ${rank(district.scaleRank)}, a ${movement}-place shift. ${basis}. This is a descriptive rank explanation, not a causal finding.`;
}

export function factualAnswer(question: string, context: AskContext) {
  const district = context.selectedDistrict;
  const portfolio = context.portfolio;
  const lower = question.toLowerCase();

  if (lower.includes("not tell") || lower.includes("cannot")) {
    return "The available data describes prevalence, affected population, rankings, and contextual indicators. It cannot establish why undernourishment occurs, prove that a risk signal caused it, predict intervention effectiveness, or determine the correct policy objective.";
  }

  if (
    context.comparison &&
    portfolio &&
    /(changed|enter|entered|exit|left)/.test(lower)
  ) {
    const before = new Set(
      context.comparison.districts.map((item) => item.id),
    );
    const after = new Set(portfolio.districts.map((item) => item.id));
    const entered = portfolio.districts
      .filter((item) => !before.has(item.id))
      .slice(0, 5)
      .map((item) => item.name);
    const left = context.comparison.districts
      .filter((item) => !after.has(item.id))
      .slice(0, 5)
      .map((item) => item.name);
    return `Compared with the pinned portfolio, ${entered.length ? `entries include ${entered.join(", ")}` : "no districts entered"}; ${left.length ? `exits include ${left.join(", ")}` : "no districts exited"}. The change comes from the visible Severity–Reach weights, not an AI recommendation.`;
  }

  if (district && /(rank|rise|differ|movement|move)/.test(lower)) {
    return rankExplanation(district);
  }

  if (district && portfolio && /(select|inside|outside|portfolio)/.test(lower)) {
    const included = portfolio.districts.some((item) => item.id === district.id);
    return `${district.name} is ${included ? "inside" : "outside"} the current ${portfolio.capacity}-district portfolio. Its national ranks are Severity ${rank(district.severityRank)} and Reach ${rank(district.scaleRank)}; the user-set objective is Severity ${Math.round(portfolio.severityWeight * 100)}% / Reach ${Math.round(portfolio.reachWeight * 100)}%. These explicit inputs—not AI—determine inclusion.`;
  }

  if (/(policy|evidence|source)/.test(lower)) {
    return "The application data establishes the active district and portfolio facts. The source panel connects that context to curated ASEAN policy passages on food security, resilience, planning, monitoring, and information systems. Those passages support interpretation; they do not determine the ranking or prove an intervention will work.";
  }

  if (portfolio && /(trade|scenario|objective|weight|capacity)/.test(lower)) {
    return `The active scenario gives Severity ${Math.round(portfolio.severityWeight * 100)}% and Reach ${Math.round(portfolio.reachWeight * 100)}% within a capacity of ${portfolio.capacity} districts. It represents ${whole.format(portfolio.affectedPopulation)} affected people with ${portfolio.averagePou.toFixed(2)}% average PoU. More Severity weight favors stronger prevalence ranks; more Reach weight favors stronger absolute-population ranks.`;
  }

  if (portfolio && /(changed|change)/.test(lower)) {
    return `A change cannot be identified without a pinned comparison portfolio. The current portfolio uses Severity ${Math.round(portfolio.severityWeight * 100)}% / Reach ${Math.round(portfolio.reachWeight * 100)}% at a capacity of ${portfolio.capacity} districts.`;
  }

  if (district) return rankExplanation(district);
  if (portfolio) {
    return `The active portfolio selects ${portfolio.capacity} districts at Severity ${Math.round(portfolio.severityWeight * 100)}% / Reach ${Math.round(portfolio.reachWeight * 100)}%. It represents ${whole.format(portfolio.affectedPopulation)} affected people, with average PoU ${portfolio.averagePou.toFixed(2)}%.`;
  }
  return "Ask NOURISH can explain the current data context and trace it to curated local policy evidence. It does not choose a priority portfolio.";
}
