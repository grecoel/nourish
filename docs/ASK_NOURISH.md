# Ask NOURISH

Ask NOURISH explains the visible data context and traces it to curated local policy evidence. It does not rank districts, choose a portfolio, infer causes, invent costs/effectiveness, or retrieve from the open web.

Its context is compact: page, active lens, selected district, optional comparison, capacity, weights, selected portfolio, and portfolio metrics. A deterministic fact layer supplies ranks, scores, portfolio changes, profile fields, and limitations. The full 503-district data set is never passed to generation.

Policy retrieval is local lexical scoring over page-aware chunks from ASEAN 2045, AEC Strategic Plan 2026–2030, and ASCC Strategic Plan. Source cards retain title, page, and excerpt.

The server-side `providerAdapter.mjs` supports an OpenAI-compatible provider only when `NOURISH_LLM_API_KEY`, `NOURISH_LLM_MODEL`, and `NOURISH_LLM_BASE_URL` are configured. Keys remain server-side. The adapter has a 12-second timeout and rejects malformed/failed responses. Without configuration, the UI shows the verified deterministic answer and retrieved evidence with the explicit fallback notice; it never fabricates generated text.
