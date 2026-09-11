# NOURISH Run 4 UX + Atlas handoff

## UX changes

Typography now uses a consistent compact sans-serif stack. Navigation, titles, margins, summaries, controls, and tables were reduced to move analysis and primary actions into the first viewport. Editorial framing was demoted; no analytical logic changed.

## Priority Atlas and map status

Priority Atlas now uses a 514-feature Kabupaten/Kota polygon layer. The `code` field joins to application district codes after period removal: 514/514 matches, no unmatched records, and no duplicate codes. `app-data/map-join-report.json` records the machine-readable result; `docs/MAP_DATA.md` records provenance and the transformation.

Severity maps PoU, Scale maps affected population, and null PoU remains a neutral no-data state. Polygon click selects the same district in the ranked panel; a separate action opens District Lens. Severity/Scale list ordering, national ranks, and missing-data handling remain unchanged.

## District Lens and Ask NOURISH

District Lens, comparison, and Ask NOURISH functionality were preserved; compact layout treatment makes their primary information more immediate. Ask NOURISH does not receive or modify rank state.

## Verification and screenshot states

Run `npm run data:build`, `npm run policy:build`, `npm test`, and `npm run build` from `nourish-prototype/`. Screenshot-ready states: `/` Severity and Scale with map/ranking; `/scenario` capacity 20 with presets/frontier; `/district/id-3201`; and the default Mamberamo Raya comparison.

## Remaining limitation

Scenario Lab does not yet reuse the map; its core analytical behavior is unchanged. The source GeoJSON is unsimplified and should be simplified only after preserving the validated code join.
