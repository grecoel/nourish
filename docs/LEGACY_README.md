# NOURISH

NOURISH is an interactive food-security priority planning prototype for Indonesia. It helps users compare where undernourishment is most severe, where the largest affected population lives, and how a transparent change in planning priorities changes the selected district portfolio.

This is a competition prototype, not a production decision system. It does not estimate intervention impact, cost, or causality.

## What the prototype includes

- **Priority Atlas** — explore 514 Kabupaten/Kota using real district polygons and switch between Severity and Scale lenses.
- **Scenario Lab** — set portfolio capacity and Severity/Reach weights, then inspect the resulting geography and trade-off.
- **District Lens** — examine one district, compare it with a peer, and understand why its ranks differ.
- **Ask NOURISH** — ask questions about the active district or scenario and trace answers to curated policy evidence.

The selected district, active lens, and scenario settings persist as the user moves between pages.

## Quick start

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/grecoel/nourish.git
cd nourish
npm ci
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

The generated application datasets are committed, so partners do not need the private analysis workspace to run the prototype.

## Validate a change

```bash
npm test
npm run build
```

The test suite protects district identity, the 503-district ranking universe, missing-value treatment, and deterministic rankings.

## Project structure

```text
app-data/       Browser-ready district, map, and policy data
app-tests/      Analytical invariant tests
docs/           Method, data, map, Ask NOURISH, and run notes
scripts/        Data preparation scripts
server/         Optional external-language-model adapter
src/            React interface and analytical logic
```

## Analytical model

Severity ranks districts by descending Prevalence of Undernourishment (PoU). Scale ranks them by descending estimated undernourished population. Scenario Lab combines normalized national ranks:

```text
scenario score = severity weight × severity percentile
               + reach weight × scale percentile
```

Reach weight is always `1 - severity weight`. Rankings are deterministic, ties use the stable district code, and missing observations are never imputed.

For detailed assumptions, read:

- [Prototype logic](docs/PROTOTYPE_LOGIC.md)
- [Data notes](docs/DATA_NOTES.md)
- [Map data and join QA](docs/MAP_DATA.md)
- [Ask NOURISH behavior](docs/ASK_NOURISH.md)

## Data notes

- 514 district/city records are available in the map dataset.
- 503 have valid 2025 inputs for the national rankings.
- 11 Jambi records remain unranked because valid distinct 2025 PoU values are unavailable.
- District geometry is joined by stable administrative code, with 514 of 514 features matched.
- The included policy index is derived from three curated ASEAN policy documents.

The scripts under `scripts/` document how generated data was produced, but rebuilding it requires source files from the separate analysis workspace and, for the policy index, `pdftotext`. Running the web prototype does not require those source files.

## Ask NOURISH and optional model provider

Ask NOURISH works without an API key: factual explanations are deterministic and policy passages are retrieved from the committed local index. The optional provider adapter reads the variables documented in `.env.example`; never commit real credentials.

## Prototype limitations

- Priority is descriptive, not a funding recommendation.
- Policy passages support interpretation but do not determine rankings.
- Risk signals are contextual associations, not causal findings or percentages.
- No validated district-level cost or intervention-effect data is included.
- Longitudinal displays omit 2024 because no validated observation is available.

## License

Project code is available under the [MIT License](LICENSE). Third-party datasets and source documents retain their own terms and should be checked before reuse beyond this prototype.
