# NOURISH Run 2 V2 handoff

## Delivered

- Scenario Lab: capacity (5–50), live Severity/Reach slider, three editable design presets, ranked portfolio, and live outcomes.
- Pinned-scenario comparison showing current-only entries and pinned metrics.
- Priority Frontier from the real 0.00–1.00 weight sweep; portfolios are deduplicated, efficiency is marked, and points update the scenario.
- Ask NOURISH route and Scenario Lab panel with context strip, quick prompts, deterministic factual answer, and visible retrieved local-policy sources.

## Formula and safety

Scenario score is `severityWeight * severityPercentile + (1 - severityWeight) * scalePercentile`. The 503-valid-district national universe and stable code tie-break are unchanged from Run 1. Missing Jambi PoU records cannot enter a portfolio. Affected population is summed; PoU is averaged/median only.

Ask NOURISH does not change rankings or portfolios. It uses current state plus `app-data/policy-index.json`; without a configured provider it explicitly provides deterministic factual explanations and retrieved evidence instead of fabricated generation.

## Curated local policy corpus

- ASEAN 2045: Our Shared Future
- ASEAN Economic Community Strategic Plan 2026–2030
- ASEAN Socio-Cultural Community Strategic Plan

`npm run policy:build` extracts page-separated local PDF text with `pdftotext`, chunks it, and preserves source title, file, and page. Retrieval is deterministic lexical keyword scoring.

## Verification and deferred work

`npm run data:build`, `npm run policy:build`, `npm test`, and `npm run build` passed. The prototype is now located at `nourish-prototype/`; validated data remains at the parent repository root.

Deferred to Run 3: full District Lens comparison and profile/persistence polish, responsive screenshot QA, and any optional provider adapter. No production backend or open-web retrieval was added.
