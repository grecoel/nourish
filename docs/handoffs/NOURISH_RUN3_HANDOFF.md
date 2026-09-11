# NOURISH Run 3 V2 handoff

## Delivered

- Full District Lens with rank contrast, human-readable primary metrics, deterministic explanation, observed-year Top-15 persistence strip, and PPH/energy/protein/IKP context.
- Dynamic two-district comparison, defaulting to Mamberamo Raya and Kabupaten Bogor, with side-by-side rank reversal evidence.
- Ask NOURISH is embedded in District Lens and remains available from Scenario Lab and navigation.
- A server-only OpenAI-compatible provider adapter, `.env.example`, 12-second timeout, malformed-response handling, and safe no-provider fallback.
- Screenshot-oriented spacing, readable evidence cards, keyboard focus states, and labeled frontier/portfolio interactions.

## Ask NOURISH

Context uses page, active lens, selected district, optional comparison, capacity, weights, selected portfolio, and its summary metrics. Deterministic facts remain the numerical source of truth; local lexical retrieval returns only curated, page-aware policy chunks. The adapter receives only facts, retrieved passages, and the user question. It never receives the full district corpus and never controls a rank or portfolio.

With no configured provider, the demo shows the verified direct answer and retrieved policy cards with: “Grounded synthesis unavailable — showing verified data and retrieved evidence.” Sources expose title, page, and excerpt.

Sample scenario answer: “The active portfolio selects 20 districts at the visible Severity/Reach split; the affected-population and average-PoU results are computed from those districts. The trade-off comes from the user’s weights, not an AI recommendation.”

Sample comparison answer: Mamberamo Raya and Kabupaten Bogor reverse priority because their Severity and Scale national ranks differ sharply; this is a deterministic comparison of prevalence and absolute affected population, not a causal conclusion.

## Demo and screenshots

1. `/` — Severity, then Scale.
2. `/scenario` — capacity 20; Severity First, Reach First, slider, frontier point.
3. Open a district from the portfolio; `/district/id-3201` for Kabupaten Bogor.
4. In Ask NOURISH, use “Why did this district rise?” and show a policy card.
5. In Compare, retain Mamberamo Raya to demonstrate the rank reversal.

Prepared screenshot states: Atlas Severity/Scale; Scenario with capacity 20/frontier; Scenario Ask panel; District Lens; District comparison.

## Verification

`npm run data:build` passed (514 records; 503 valid ranking records), `npm run policy:build` passed (601 curated chunks), `npm test` passed (4/4), and `npm run build` passed. Browser automation was unavailable in this environment, so screenshot capture was not automated.

## Remaining limitations

Live synthesis needs a user-supplied compatible provider configuration. The no-provider evidence fallback is intentionally the default. No intervention effects, costs, causal findings, open-web retrieval, database, accounts, or production deployment were added.
