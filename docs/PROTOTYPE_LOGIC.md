# NOURISH prototype logic — Run 1

Priority Atlas uses the 2025 validated district join. It has two separate national rankings over the same valid 503-district universe:

- **Severity:** descending `pou_pct` (Prevalence of Undernourishment).
- **Scale:** descending `undernourished_people` (absolute affected population).

Ties are broken by ascending stable four-digit district code, making ranking deterministic. The display may be filtered or searched, but displayed ranks always remain the full national ranks.

For each valid district, normalization is retained for the later Scenario Lab: `(N - rank) / (N - 1)`, where `N = 503`. This is a rank percentile from 0 to 1; it is not used to create a blended priority in Run 1.

The Run 1 District Lens explanation is rule-based. It compares Severity and Scale rank, and never uses AI to decide a district priority.

## Run 2 Scenario Lab

For each valid district, `scenario_score = severity_weight × severityPercentile + reach_weight × scalePercentile`, with `reach_weight = 1 - severity_weight`. Capacity is a count of districts (5–50; default 20). Scores are sorted descending and ties use ascending stable district code. Portfolio totals sum only affected population; PoU is reported as average and median, never summed.

The Priority Frontier evaluates Severity weights 0.00 through 1.00 in 0.05 increments, deduplicates identical portfolios, and marks a portfolio efficient only when no other shown portfolio has at least as much affected population and average PoU, with one strictly higher.

Ask NOURISH never calculates these scores. It receives compact structured scenario facts, uses deterministic explanations, and retrieves only the local curated policy index.
