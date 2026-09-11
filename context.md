# NOURISH — Comprehensive Context Transfer

## 1. Project and competition context

NOURISH is being developed for **ASEAN Data Science Explorers 2026 (ASEAN DSE)**. The competition asks teams to identify a pressing ASEAN socio-economic issue, analyze it using data, connect the issue to relevant UN Sustainable Development Goals and ASEAN priorities, and propose a feasible, scalable solution. For 2026, the judging structure gives substantial weight to the strength of the analysis rather than merely the novelty of the proposed application: **Problem Definition 10%, Analysis & Insights 25%, Relevancy & Impact 20%, Viability 15%, Innovation 15%, and Presentation Delivery 15%**. citeturn778837view0

For the current qualifying stage, the primary artifact is a **data analytics storyboard**, not a conventional presentation delivered alongside a speaker. Official requirements specify a landscape PDF with a maximum of **15 pages including the cover page, excluding references**, with charts, graphs, and diagrams generated using **SAP Analytics Cloud (SAC)**. citeturn797771search0 The submitted storyboard itself is reviewed to determine which teams progress to the national stage; presentation material comes later for shortlisted teams. citeturn797771search5turn797771search7

This distinction is fundamental to how the NOURISH deck must be designed.

This is **not a presenter-support slide deck** in which the presenter supplies most of the reasoning orally while slides contain only headlines and decorative visuals. The storyboard must communicate the argument by itself. Every slide should therefore be **submission-level and independently interpretable**. A judge should be able to understand the analytical question, evidence, conclusion, source, and relevance of a slide without hearing an explanation.

The useful mental model is closer to a **scientific poster divided into 15 panels**. If every slide were exported and tiled together into one large image, the result should approximately function as a scientific poster: there should be a visible research question, methods/data, successive analytical findings, interpretation, proposed mechanism, feasibility, and final implication. Individual slides can still be visually clean, but minimalism cannot come at the cost of missing reasoning.

Therefore, ordinary pitch-deck advice such as “one sentence and one giant picture per slide” should not be followed mechanically. NOURISH needs concise explanatory captions, clearly stated findings, source/period labels, methodological notes when necessary, and enough numerical evidence that a judge can audit the logic directly from the PDF.

---

# 2. Topic that has been fixed

The topic is **food insecurity**, primarily aligned with **SDG 2 — Zero Hunger**.

The analytical deep dive is **Indonesia at district/city level**, while ASEAN provides the regional context and establishes why the issue and proposed mechanism matter beyond Indonesia. Indonesia should not be presented as an isolated national case. Instead, it is the detailed test environment from which a planning principle is demonstrated and then generalized into an ASEAN-scalable solution.

This is particularly defensible because current ASEAN strategic planning explicitly includes food security. The ASEAN Economic Community Strategic Plan 2026–2030 calls for stronger food-system resilience, market connectivity and distribution, integrated food-security information systems for planning and monitoring, improved financing and technology adoption, and stronger collaboration. fileciteturn5file5L481-L520

NOURISH therefore should not be framed merely as an Indonesian food dashboard. Its broader proposition is that **food-security information becomes more useful when it is translated into transparent decision trade-offs rather than collapsed into a single ranking**.

---

# 3. The central analytical problem

The core insight behind NOURISH is that **food-insecurity severity and food-insecurity scale are different dimensions of the same problem**.

For the current analysis:

**Severity** means the **Prevalence of Undernourishment (PoU)** — the percentage of a district's population estimated to be undernourished.

**Scale**, later often referred to in product language as **Reach**, means the **absolute number of undernourished people**.

These measures answer fundamentally different questions.

Severity asks:

> Where is undernourishment most concentrated relative to the local population?

Scale asks:

> Where are the largest absolute numbers of people affected?

Neither metric is inherently the correct one. The problem arises when a planning process implicitly behaves as if the two questions are interchangeable.

The research therefore does **not** claim that governments currently prioritize food insecurity incorrectly. It does **not** claim that PoU is wrong, nor that headcount is superior. It also does not claim that there is one objectively correct priority ranking.

The actual problem is narrower and much more defensible:

> Different legitimate policy objectives produce materially different priority geographies. Decision-makers therefore need a transparent way to see and manage the trade-off rather than hiding it inside one opaque priority score.

That distinction is the intellectual foundation of NOURISH.

---

# 4. Indonesia analytical evidence

The core Indonesia snapshot uses **2025 district-level data**. There are **503 districts/cities with valid PoU-related records** in the analytical universe. Eleven Jambi districts do not have valid distinct 2025 PoU observations because of source limitations and must remain missing rather than being imputed. Kabupaten and Kota sharing similar names must remain distinct through stable administrative identifiers. fileciteturn0file5L411-L423

The divergence between Severity and Scale is not small.

Across the 503 valid districts, the **Spearman rank correlation is only approximately 0.225**. The median district moves **117 ranking positions** when switching from Severity ranking to Scale ranking. Approximately **79.5% move more than 50 ranks, 56.7% move more than 100 ranks, and 26.8% move more than 200 ranks**. fileciteturn4file7L730-L745

The extreme-priority sets are even more striking.

The **Top 15 districts by Severity and Top 15 districts by Scale have zero overlap** in 2025. Even the Top 10 sets have zero overlap. At the broader Top-10% threshold, only two districts appear in both groups. fileciteturn4file7L742-L745

This is stronger evidence than merely saying that “percentages and populations are mathematically different.” The decision consequence is that changing the objective can substantially alter **which real places become priority areas**.

Representative rank reversals make the idea tangible. Kabupaten Mamberamo Raya ranks **#1 in Severity but approximately #355 in Scale**, while Kabupaten Bogor ranks approximately **#438 in Severity but #2 in Scale**. Kabupaten Jember is #1 in Scale but only #97 by Severity. Kabupaten Bandung is #4 by Scale but approximately #402 by Severity. fileciteturn4file7L747-L760

The most important human-readable contrast is **Mamberamo Raya versus Kabupaten Bogor**.

Mamberamo Raya has approximately **59.17% PoU**, a population of roughly 26.5 thousand, and approximately **15,710 undernourished people**. Kabupaten Bogor has only approximately **4.30% PoU**, but because its population is around 6.42 million, approximately **276,292 people are undernourished**. fileciteturn4file6L704-L710

Neither district makes the other irrelevant.

Mamberamo Raya expresses **intense localized deprivation**.

Kabupaten Bogor expresses **large aggregate human reach**.

This is exactly why NOURISH must not make the normative decision for the policymaker.

---

# 5. The result is persistent, not merely one dramatic 2025 snapshot

Longitudinal work was added to prevent the story from relying on a single cross-section.

For the years with validated data — **2018, 2019, 2020, 2021, 2022, 2023 and 2025** — the overlap between Top-15 Severity and Top-15 Scale districts remained extremely small: respectively **0, 0, 1, 1, 0, 1 and 0 districts out of 15**. The missing 2024 year must remain explicitly missing and must never be interpolated. fileciteturn4file4L641-L655

The implication is not that the exact same districts always remain priorities. The stronger interpretation is that **Severity-oriented and Scale-oriented priority systems repeatedly produce different portfolios**.

Persistence therefore becomes supporting evidence for the planning problem rather than an entirely separate story.

---

# 6. ASEAN evidence

ASEAN-level data is used to establish regional relevance rather than being mixed statistically with Indonesia district data.

The current ASEAN comparison uses **FAOSTAT 2021–2023 three-year averages**. Among countries with available observations, the ranking also changes depending on whether food insecurity is viewed as PoU or absolute undernourished population. For example, **Timor-Leste ranks highest by PoU but lowest by absolute headcount among the included countries, whereas Indonesia ranks first by affected headcount and third by PoU**. Brunei Darussalam, Malaysia, and Singapore are missing for both indicators in this particular comparison and should not be treated as zero. fileciteturn4file6L706-L710

This regional comparison should not carry the entire analytical argument. Its role is to show that the distinction between **relative severity and absolute scale is not uniquely Indonesian**.

Indonesia is simply where the project has enough granular data to explore what that distinction means operationally.

---

# 7. Additional profile analysis

An important analytical question was whether High-Severity and High-Scale districts differ in ways beyond the mathematical denominator effect.

The fixed Top-15 groups show some descriptive differences.

The High-Severity group averages approximately **40.5 on IKP**, compared with **72.4 for the High-Scale group**. Average PPH is approximately **67.8 versus 92.6**, energy consumption approximately **1,759 versus 2,011 kcal/capita/day**, and protein approximately **42.6 versus 60.4 g/capita/day**. fileciteturn4file6L710-L714

Risk-signal analysis provides partial additional differentiation. Poverty-related signals are descriptively higher among High-Scale districts, while agriculture-livelihood-related signals are descriptively higher among High-Severity districts. However, several other candidate variables have sparse coverage or ambiguous differences. fileciteturn4file6L715-L718

The approved analytical verdict is therefore deliberately conservative:

> **PARTIAL — SOME DIFFERENCES, BUT NOT A CLEAN SPLIT.**

This matters because the deck must not transform descriptive differences into a claim that the two groups have completely different causal mechanisms.

Risk signals are **associated/contextual signals**, not proof of causes.

---

# 8. Evolution of the proposed solution

Earlier concepts of NOURISH were broader. They included automatic diagnostic-to-intervention matching, intervention planners, resource allocation using hypothetical cost assumptions, and potentially stronger recommendations about what government should do.

Those directions should **not be restored casually**.

The evidence currently supports the prioritization trade-off much more strongly than it supports automatic intervention prescriptions. Consequently, the solution evolved from something resembling an AI recommendation engine into a **transparent decision-support environment**.

The current philosophy is:

> **NOURISH helps humans understand and structure the decision. It does not make the policy decision for them.**

This is one of the project’s strongest design decisions because it converts an analytical limitation into a transparency principle.

NOURISH is therefore best described as:

> **A transparent food-security priority planner that lets decision-makers explore how different objectives change priority geography, simulate explicit Severity–Reach trade-offs under limited implementation capacity, inspect individual districts, and trace relevant policy evidence without hiding policy choices inside an opaque algorithm.**

---

# 9. The current NOURISH product

The current competition prototype consists of four first-class experiences: **Priority Atlas, Scenario Lab, Ask NOURISH, and District Lens**. fileciteturn4file2L236-L253

### Priority Atlas

Priority Atlas is the entry point.

It visualizes Indonesia’s district-level food-insecurity landscape and allows the user to change the planning lens. The most important switch is **Severity ↔ Scale/Reach**.

Under Severity, districts are ranked by PoU.

Under Scale/Reach, districts are ranked by estimated absolute undernourished population.

A persistence lens may provide additional longitudinal context.

The user should immediately see that changing the lens changes both the ranking and the map. The purpose is not to produce another BI dashboard. It is to make the **geographic consequence of the planning objective visible**.

The map and ranked list must remain synchronized, while all ranks are calculated against the full valid national universe rather than recalculated from whatever subset happens to be visible.

### Scenario Lab

Scenario Lab is the principal decision-support mechanism.

The user chooses an implementation capacity between **5 and 50 districts** and controls the balance between Severity and Reach.

Three intuitive presets exist:

**Severity First**, **Balanced**, and **Reach First**.

The current scoring system is deterministic:

`scenario score = severity weight × severity percentile + reach weight × scale percentile`

The weights are explicit, editable, and controlled by the user. The algorithm therefore does not pretend to discover an objectively correct policy priority. fileciteturn4file5L669-L678

Changing the weights changes the selected portfolio of districts. Changing capacity also changes the portfolio.

Scenario outcomes then show the consequences of that decision: which districts are selected, how much affected population the portfolio represents, its prevalence profile, and which districts enter or leave when the objective changes.

This is what makes NOURISH more than a visualization dashboard. It turns an analytical finding into a **decision experiment**.

### Priority Frontier

Scenario Lab also contains a **Priority Frontier**.

The system sweeps across Severity–Reach weight combinations between 0 and 1, computes portfolios, removes duplicate portfolio configurations, and shows the resulting trade-off space. fileciteturn4file5L665-L672

The point of the frontier is not to claim mathematical optimality unless an objective function and constraints justify it.

Its role is to reveal that there are **multiple defensible portfolios** depending on what decision-makers value.

The frontier makes the hidden normative choice visible.

### District Lens

District Lens explains what sits behind an individual district’s ranking.

It shows the district’s Severity and Scale ranks, PoU, estimated undernourished population, total population, rank difference, longitudinal priority persistence where available, and supporting indicators such as PPH, energy, protein and IKP.

The prototype also supports two-district comparison. The canonical demonstration is **Mamberamo Raya versus Kabupaten Bogor**, because their rank reversal explains the entire project in a concrete way. fileciteturn4file9L881-L897

The purpose is not merely to display more indicators. District Lens answers:

> Why does this place rise under one objective and fall under another?

---

# 10. Ask NOURISH

**Ask NOURISH is now a first-class feature**, not an optional chatbot.

Its purpose is very specific:

> **Explain the current decision context using validated data, then connect that context to curated policy evidence.** fileciteturn4file2L245-L253

The central rule is:

> **AI explains the evidence. It does not make the decision.**

Ask NOURISH automatically inherits context from the rest of the application: current page, active Severity/Scale lens, selected district, comparison district where relevant, scenario capacity, Severity/Reach weights, selected portfolio, portfolio summary metrics, available food-security profiles, and persistence data. fileciteturn4file9L889-L897

A user looking at Kabupaten Bogor under Reach First can therefore simply ask:

> “Why did this district rise?”

The system already knows what “this district” and “this scenario” mean.

Its preferred response structure is:

**Direct answer → Data basis → Policy evidence → relevant limitation → Sources.**

The product deliberately separates three things: deterministic facts computed from application data, retrieved policy evidence, and any model-generated synthesis. These are not allowed to blur together. fileciteturn4file2L283-L300

The policy corpus currently includes **ASEAN 2045: Our Shared Future, the ASEAN Economic Community Strategic Plan 2026–2030, and ASEAN Socio-Cultural Community strategic material**. Retrieval is local and curated. The implemented system preserves document title and page information and uses deterministic lexical retrieval; optional model synthesis sits on top rather than controlling the ranking engine. fileciteturn4file5L680-L690

If no LLM provider is configured, Ask NOURISH remains functional by displaying deterministic explanations and retrieved evidence. It must never fabricate an AI response merely to keep the interface looking complete. fileciteturn4file9L889-L897

This is important for the innovation narrative. The AI component is not valuable because “the project uses AI.” It is valuable because it solves a specific interpretability problem: users can interrogate a complex scenario while the quantitative decision logic remains auditable.

---

# 11. What NOURISH explicitly does not do

Several exclusions are important enough to treat as project doctrine.

NOURISH does **not** claim that government currently prioritizes hunger incorrectly. It does not claim that Severity or Reach is universally superior. It does not generate a single “true” priority score. It does not let an LLM determine rankings or portfolios. It does not infer causality from descriptive risk signals. It does not fabricate costs, budgets, beneficiary numbers, intervention effectiveness or missing data. fileciteturn0file5L383-L389

Missing PoU is not converted to zero. Missing 2024 longitudinal observations are not interpolated. Rates such as PoU, PPH, IKP, energy and protein are not summed. Absolute populations may be aggregated where appropriate. fileciteturn0file5L411-L423

The project should also avoid the language **“AI recommends,” “best district,” “correct priority,” “government is wrong,” “people saved,”** or unsupported claims of “optimal policy” and “impact achieved.” fileciteturn2file1L327-L349

These constraints are not cosmetic caution. They are essential to keeping the project analytically defensible.

---

# 12. The intended reasoning chain

The cleanest way to understand the current NOURISH story is:

**ASEAN food insecurity matters → one burden metric is insufficient → Severity and Scale produce different priority geographies → the divergence is large and persistent → neither objective can simply replace the other → limited implementation capacity forces an explicit trade-off → NOURISH makes that trade-off visible and interactive → District Lens explains individual cases → Ask NOURISH connects decisions to traceable evidence → policymakers retain control over the objective.**

In the application itself this becomes:

> **Lens → Scenario → District → Explanation → Policy Evidence.**

That is the product’s logical architecture and should also shape the storyboard.

---

# 13. Recommended storyboard logic

The earlier 15-slide architecture was approximately:

**Title/human problem → ASEAN relevance → inadequacy of one hunger view → Indonesia method → Severity evidence → Scale evidence → analytical contrast → decision consequence → supporting profiles/risk signals → longitudinal/robustness evidence → refined problem → NOURISH → prototype/Scenario Lab → implementation and ASEAN scalability → impact/final takeaway.** The original project specification similarly placed the solution only after the evidence and refined problem, rather than opening immediately with the app. fileciteturn3file0L100-L131

The exact slide allocation can change, but that ordering principle should remain.

**Do not introduce NOURISH before the evidence has earned it.**

The audience should first understand why the existing decision problem exists. The application then appears as an answer to a demonstrated need rather than a technology looking for a problem.

---

# 14. Storyboard design doctrine

This point is crucial for anyone continuing the project.

Every slide must work **without a presenter**.

A slide therefore needs enough internal structure to answer five questions:

**What question is this slide answering? What does the evidence show? What is the magnitude? What may legitimately be concluded? Why does this matter for the next part of the story?**

Not all five need explicit labels, but they should all be recoverable from the slide.

Charts should normally have analytical titles rather than generic labels. For example:

> **The Same Country Produces Two Different Priority Maps**

is stronger than:

> **Severity vs Scale Scatterplot**

The first communicates the finding.

Large hero numbers can be used, but only when their denominator and meaning are visible. Figures should contain source and period labels. Major analytical slides should usually contain a brief interpretation adjacent to the visualization so the judge is not required to infer the significance alone.

At the same time, “self-contained” must **not** become an excuse for turning each slide into an essay. The scientific-poster analogy is about information completeness, not text density. The design should use hierarchy: strong headline, dominant chart, a small number of numerical callouts, concise interpretation, source/method note, then white space.

When the 15 slides are viewed together, they should resemble **15 coherent panels of one analytical argument**, not 15 sparse presenter cues.

---

# 15. SAP Analytics Cloud's role

SAC is not incidental. The storyboard requirements explicitly require charts/graphs/diagrams produced with SAP Analytics Cloud. citeturn797771search0

The evidence workspace already contains corrected SAC views for the Indonesia burden overview, High-Severity versus High-Scale profiles, risk signals, ASEAN context, and the Mamberamo Raya–Bogor contrast. fileciteturn0file0L12-L27

SAC visualizations should therefore function as the empirical backbone of the first two-thirds of the storyboard, while screenshots of the functional NOURISH prototype become evidence of solution feasibility in the later slides.

The product prototype does not replace the analytics.

The analytics establish the problem.

The prototype demonstrates that the proposed response can actually be built.

---

# 16. Prototype implementation status

A functioning competition prototype already exists using **React, TypeScript and Vite**.

The current implementation includes working Severity/Scale ranking, Scenario Lab with capacity 5–50, live Severity–Reach weighting, three presets, portfolio comparison, Priority Frontier, District Lens, district comparison, Ask NOURISH with deterministic contextual explanations, curated local policy retrieval, and optional provider-based grounded synthesis. fileciteturn4file3L381-L426

The latest verified Run 3 build reported **514 application records, 503 valid ranking records, 601 curated policy chunks, passing data build, passing policy build, 4/4 tests passing, and passing production build**. fileciteturn4file9L899-L915

The intended screenshot states include Atlas under Severity and Scale, Scenario Lab around capacity 20 under contrasting objectives, Priority Frontier, Ask NOURISH with a selected district and visible source evidence, a Kabupaten Bogor District Lens, and the Mamberamo Raya–Bogor comparison. fileciteturn2file2L633-L669

The prototype is a **competition-grade proof of mechanism**, not an attempt at production infrastructure. Authentication, enterprise permissions, live government APIs, payment systems, complex databases and production ingestion pipelines are intentionally outside the competition scope.

---

# 17. ASEAN scalability

ASEAN scalability should not be claimed as “copy the Indonesian model unchanged into every country.”

The transferable element is the **decision framework**.

A participating country needs geographically disaggregated measures representing relative burden and absolute affected population. Once those inputs exist, the same underlying question can be posed:

> How does the priority portfolio change when policymakers place more emphasis on severity versus population reach?

Country-specific indicators, administrative geography and policy documents can then populate District Lens and Ask NOURISH.

This architecture makes NOURISH more scalable than a system whose recommendations are hard-coded around Indonesian institutions or particular intervention programs.

ASEAN-level deployment could therefore retain a common decision logic while allowing each member state to use its own official administrative boundaries, complementary food-security indicators and policy corpus.

The alignment is especially strong with the ASEAN objective of strengthening **integrated food-security information systems to forecast, plan and monitor food supply and utilization**. fileciteturn5file5L481-L520

---

# 18. Impact logic

The project should be cautious about impact claims.

NOURISH has not demonstrated that it reduces hunger by a measurable percentage. No causal evaluation exists, and the prototype has no validated intervention costs or treatment-effect estimates.

Its immediate proposed impact is on **decision quality and decision transparency**.

Today, a planning team could produce very different priority lists simply by changing the burden measure. If that choice is implicit, users may not even recognize the trade-off.

NOURISH makes the choice explicit.

Its proposed mechanism of impact is therefore:

**better visibility of competing objectives → explicit scenario comparison → clearer justification of priority portfolios → stronger evidence traceability → more transparent food-security planning.**

Downstream improvements in program targeting or food-security outcomes are plausible objectives of deployment, but they should be presented as intended impact rather than results already achieved.

---

# 19. What is actually innovative about NOURISH

The innovation claim should **not** be “we discovered that percentages and absolute numbers are different.” That observation alone is trivial.

The stronger innovation is the combination of:

**an empirically demonstrated priority divergence + an explicit human-controlled multi-objective scenario engine + geographic portfolio visualization + district-level explanation + grounded policy-evidence retrieval.**

In other words, NOURISH operationalizes the statistical distinction.

It allows a policymaker to move from:

> “These two metrics disagree.”

to:

> “If our current objective is to prioritize severe concentration, this is the resulting portfolio. If our objective shifts toward reaching more affected people, this is what changes. Here are the districts that enter or leave, here is the evidence behind them, and here are relevant policy directions. The human policymaker decides which objective is appropriate.”

That is substantially stronger than either a static dashboard or an opaque AI recommendation engine.

---

# 20. Canonical one-paragraph description

**NOURISH is a transparent food-security priority planning system developed for ASEAN DSE 2026. Using Indonesia as a district-level deep dive, the project demonstrates that food-insecurity severity, measured through Prevalence of Undernourishment, and food-insecurity scale, measured through absolute undernourished population, produce substantially different priority geographies. Across 503 valid Indonesian districts in 2025, their rankings have only a weak relationship, with a median displacement of 117 ranks and zero overlap between their respective Top-15 priority sets. Rather than declaring either metric correct, NOURISH lets decision-makers explicitly explore that trade-off. Its Priority Atlas visualizes alternative priority lenses; Scenario Lab lets users adjust Severity–Reach objectives and implementation capacity; Priority Frontier exposes the resulting portfolio trade-offs; District Lens explains individual rank reversals and supporting food-security profiles; and Ask NOURISH provides context-aware explanations linked to curated ASEAN policy evidence. The system is deliberately human-controlled: deterministic data determine rankings, AI may explain evidence but never chooses the policy objective or priority portfolio.**

---

# 21. The single most important thing to preserve

Do not allow the project to drift back into the generic formulation:

> “Food insecurity is bad, so we built an AI dashboard that recommends where governments should intervene.”

That version is weaker analytically, weaker ethically, and easier for judges to challenge.

The stronger NOURISH story is:

> **Food-security prioritization contains a real objective trade-off. The data show that this trade-off materially changes who gets prioritized. NOURISH makes the trade-off visible, explorable, explainable and evidence-linked without pretending that an algorithm can decide society's objective.**

Everything in the research, product, SAC visualizations and final 15-page storyboard should reinforce that proposition.