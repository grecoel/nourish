# Map data — Run 4

`app-data/indonesia_kabkota.geojson` was downloaded from [Indonesia-GeoJSON](https://github.com/AlfianAliM/Indonesia-GeoJSON), `kab_kota.geojson`, a 514-feature Kabupaten/Kota GeoJSON. Its documented feature fields are `code`, `name`, and `level`; the repository describes it as administrative district/city boundaries. The source repository should be consulted for its applicable license and upstream provenance before any use beyond this competition prototype.

The geometry code is formatted as `11.05`. The application uses the equivalent four-digit stable code `1105`; the join removes the period. QA is recorded in `app-data/map-join-report.json`: 514 geometry features, 514 application districts, 514 matches, zero unmatched features/data records, and zero duplicate geometry codes. Kabupaten and Kota remain distinct because the codes—not names—are joined.

The map is an unsimplified static SVG projection. Severity uses PoU intensity; Scale uses affected-population intensity; null PoU is a neutral labelled no-data color, never zero. No fuzzy matching, centroid substitution, or province geometry is used.
