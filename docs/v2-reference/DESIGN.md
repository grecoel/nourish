---
name: Editorial Agrarian Intelligence
colors:
  surface: '#f5fbf0'
  surface-dim: '#d6dcd1'
  surface-bright: '#f5fbf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6ea'
  surface-container: '#eaf0e5'
  surface-container-high: '#e4eadf'
  surface-container-highest: '#dee4d9'
  on-surface: '#171d16'
  on-surface-variant: '#414944'
  inverse-surface: '#2c322b'
  inverse-on-surface: '#edf3e7'
  outline: '#717974'
  outline-variant: '#c0c8c2'
  surface-tint: '#396755'
  primary: '#184736'
  on-primary: '#ffffff'
  primary-container: '#315f4d'
  on-primary-container: '#a6d7c0'
  inverse-primary: '#a0d1ba'
  secondary: '#835419'
  on-secondary: '#ffffff'
  secondary-container: '#ffc07b'
  on-secondary-container: '#7a4c10'
  tertiary: '#004461'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c5c7d'
  on-tertiary-container: '#9bd3fa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcedd6'
  primary-fixed-dim: '#a0d1ba'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#204f3e'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#f9ba75'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#c7e7ff'
  tertiary-fixed-dim: '#95cdf4'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6c'
  background: '#f5fbf0'
  on-background: '#171d16'
  surface-variant: '#dee4d9'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system serves a policy intelligence dashboard built around a single, uncompromising cross-sectional snapshot: the 2025 food security status of all 514 kabupaten/kota across Indonesia's 38 provinces. 

The aesthetic blends clean editorial cartography with modern institutional policy reporting. It avoids both cold corporate SaaS sterility and noisy consumer dashboard tropes. Instead, it leans into tactile, warm paper finishes, deliberate typographic hierarchy, and surgical data clarity. The visual tone mirrors high-end public policy whitepapers, authoritative economic atlases, and precision statistical registries.

Key visual tenets:
- **Quiet Authority:** Ample breathing room, hairline rules, and restrained typography prioritize density of insight over decorative clutter.
- **Agricultural Warmth:** Grounded in unbleached paper whites, warm ivory base canvases, and organic forest pigments that feel rooted in terrestrial data without sacrificing analytical rigor.
- **Bilingual Cadence:** Native support for bilingual nomenclature, utilizing primary Indonesian administrative taxonomy (*Kabupaten, Kota, Tingkat, Indeks Ketahanan Pangan*) paired with clear international analytical labels.
- **Snapshot Integrity:** Strict cross-sectional boundaries. The interface rejects temporal sliders, animated transitions, or speculative metrics, treating the 514 districts with definitive statistical sobriety.

## Colors

The palette derives from archival government cartography, natural foliage, and soil tones, optimized for high legibility during analytical review.

### Core Architecture
- **Primary Canvas (`#F7F5EF`):** A warm, unbleached ivory field functioning as the base backdrop for all page layouts, map viewports, and outer views.
- **Surface Paper (`#FFFFFF`):** Pure white used exclusively for foreground containers, data cards, analytic side-drawers, and interactive metric cells to create tactile paper layers over the ivory base.
- **Deep Charcoal Text (`#222821`):** The primary reading ink, delivering contrast against paper whites and warm canvases while avoiding digital pitch black.
- **Muted Ink (`#5C645A`):** Secondary text token for metadata, field labels, bilingual subheads, and dimensional units.

### Semantic & Dimensional Palette
- **Forest Green (`#315F4D`):** Primary identity, navigation accents, active tab indicators, and primary interaction triggers.
- **Severity Dimension (`#4E806A`):** Dedicated programmatic colorway for the vulnerability spectrum, food access deficit tiers, and priority intervention indexing.
- **Scale Dimension (`#467FA2`):** Structural blue designated strictly for population magnitude, logistical throughput, and physical distribution capacity.
- **Muted Ochre (`#B88142`):** Tertiary indicator for moderate vulnerability, caution thresholds, and targeted administrative interventions.
- **Hairline Border (`#D9DED6`):** The universal structural stroke used for 1px dividing lines, card boundaries, and table matrices.
- **Missing Data Neutral (`#D8DAD4`):** A distinct, tinted grey tone strictly reserved for the 11 unsurveyed or unrecorded districts, accompanied by diagonal hatch patterns when displayed in thematic choropleths.

## Typography

The typographic engine uses a two-family hierarchy calibrated for policy narrative and statistical legibility.

- **Plus Jakarta Sans:** Governs all display sizes, titles, panel headers, and district names. Its geometric structure features humanist openness, giving Indonesian geographical names (*Kabupaten Bolaang Mongondow*, *Kepulauan Sula*) clear rhythm and legibility.
- **Inter:** The functional core for tabular displays, analytics summaries, analytical notes, and microcopy. 
- **Tabular Figures (`tnum`):** Inter must always render with OpenType `tnum` (tabular numbers) and `cv05` enabled across table rows, ranking counts, index scores, and percentage columns to maintain vertical decimal alignment across comparative lists.
- **Microcopy Styling:** Bilingual subtext (e.g., *Status Ketahanan Pangan / Food Security Index*) uses `label-sm` set in Muted Ink with slight positive letter tracking.

## Layout & Spacing

Layout geometry follows an 8px modular baseline to maintain the structure of printed policy briefings.

### Architectural Layout Tiers
1. **Tingkat 1 (Atlas):** An expansive 12-column viewport. The left or top edge houses an anchored administrative selector (Province / Archipelago Filter), while the primary spatial choropleth map occupies the dominant canvas with an overlayable analytical index ribbon.
2. **Tingkat 2 (District Lens):** Split-column split-pane master-detail view (40% district profile dossier, 60% relative performance matrices and dimensional radars).
3. **Tingkat 3 (Explore):** A dense 12-column tabular grid designed for multi-variable sorting across all 514 administrative units, featuring fixed headers and horizontal freeze-panes for geographical identifiers.

### Form Factor Behavior
- **Desktop (1280px+):** 12 columns, 24px (`gutter-lg`) gutters, 40px outer canvas margin. Map viewports support sticky contextual filter bars.
- **Tablet (768px – 1279px):** 8 columns, 16px (`gutter`) gutters, 24px outer margin. Split-views collapse into vertical stacks with persistent tab toggles between the Atlas Map and the District Dossier.
- **Mobile (< 768px):** 4 columns, 12px gutters, 16px outer margin. Atlas layers switch to vertical swipeable summary index cards, with comprehensive table views moving into horizontal scrolling matrices.

## Elevation & Depth

Visual depth avoids heavy artificial dropshadows, drawing instead from physical document layering and crisp hairline ink strokes.

- **The Baseline Floor:** Canvas background (`#F7F5EF`) sits at elevation 0.
- **Surface Elevation (Cards, Panels):** Surfaces (`#FFFFFF`) do not float; they are anchored by a structural 1px border (`#D9DED6`). In interactive states, surfaces exhibit an ultra-subtle ambient lift: `0 1px 3px rgba(34, 40, 33, 0.04), 0 4px 12px rgba(34, 40, 33, 0.03)`.
- **Drawer & Inspector Elevation:** The District Lens deep-inspection panel uses a flush right-aligned paper slide-over with an edge line: `1px solid #D9DED6` backed by a tinted ambient shadow ` -4px 0 24px rgba(34, 40, 33, 0.06)`.
- **Modals & Overlays:** Ground overlays use a soft parchment blur: `backdrop-filter: blur(4px); background-color: rgba(247, 245, 239, 0.8)`.

## Shapes

The interface balances sharp editorial paper edges with soft 4px to 8px corner radii, reflecting classic printed cards and precision data chips.

- **Base Radii (`rounded` / 4px - 6px):** Standard for form inputs, chips, badge pills, and tabular action cells.
- **Structural Radii (`rounded-lg` / 8px):** Applied to primary metric containers, map control groups, floating intelligence cards, and district profile containers.
- **Zero Radius:** Used on contiguous data grids, table borders, timeline bars, and side-sheet anchor panels to reinforce structural cohesion.

## Components

### Buttons & Interactive Controls
- **Primary Action:** Solid Forest Green (`#315F4D`) with white Inter medium text, 6px border radius, 0 1px 2px rgba(0,0,0,0.05) shadow. Hover: darken to `#264B3D`.
- **Secondary / Filter Outline:** White background with 1px hairline border (`#D9DED6`), charcoal text (`#222821`). Hover: canvas ivory (`#F7F5EF`) fill.
- **Tingkat View Switcher:** Segmented control bound by a 1px border container; active tier is filled with `#FFFFFF` and subtle ambient shadow, inactive options sit on `#F7F5EF`.

### Chips & Administrative Badges
- **Province / Classification Badges:** 4px radius, 11px font size, uppercase tracking. Padding: 2px 8px.
- **Severity Badge:** Tinted `#4E806A` at 12% opacity with solid `#315F4D` text.
- **Missing Data Badge:** `#D8DAD4` fill, `#5C645A` text, labeled strictly as *Data Belum Tersedia (11 Kab/Kota)*.

### Data Tables (Explore / Tingkat 3)
- Compact, dense layout (36px row height for high-density reading).
- Header cells: `#F7F5EF` fill, 11px uppercase label style, bottom border 1px solid `#D9DED6`.
- First column (District Name & Province) frozen horizontally with a subtle vertical boundary separator.
- Number alignment: strictly right-aligned with monospace tabular figures (`font-variant-numeric: tabular-nums`).

### District Lens Dossier Card
- Multi-compartment container in `#FFFFFF` with 8px radius and 1px hairline border.
- Header segment includes primary Indonesian administrative unit name, secondary English statistical translation, and an integrated severity badge.
- Inner data rows separated by hairline horizontal rules (`#D9DED6`).

### Form Elements & Selectors
- Search and dropdown inputs feature `#FFFFFF` fill, 1px `#D9DED6` border, and 6px border radius.
- Focused state replaces hairline border with a crisp 1.5px `#315F4D` ring with 0 offset.

### Missing Data Visualization Pattern
- Any chart or map element representing the 11 missing districts renders with `#D8DAD4` fill and an alternating 45-degree diagonal pattern (`stroke: #C2C6BD; stroke-width: 1.5`). 
- Tooltips for these records display standardized explanatory copy: *"Data 2025 belum tercatat dalam registri statistik nasional."*