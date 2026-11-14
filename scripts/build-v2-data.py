"""Prepare the bounded 2025 explorer and simplified geographic paths, offline."""
import csv
import json
import math
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
SOURCE = Path(r"A:\0000_CurrentlyWorkingOn\ASEANDSE\##Data")
FIELDS = ["ikp", "pou_pct", "population", "undernourished_people", "pph", "energy_kcal_cap_day", "protein_g_cap_day"]


def rdp(points, tolerance=0.006):
    if len(points) < 5:
        return points
    ax, ay = points[0][:2]
    bx, by = points[-1][:2]
    dx, dy = bx - ax, by - ay
    norm = dx * dx + dy * dy
    best, index = 0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i][:2]
        t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / norm)) if norm else 0
        distance = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2
        if distance > best:
            best, index = distance, i
    if best > tolerance * tolerance:
        return rdp(points[:index + 1], tolerance)[:-1] + rdp(points[index:], tolerance)
    return [points[0], points[-1]]


def main():
    with (SOURCE / "20_indonesia_district_join_preview.csv").open(encoding="utf-8-sig", newline="") as stream:
        source = list(csv.DictReader(stream))
    names = {r["code"]: r["name"] for r in json.loads((BASE / "app-data/districts_2025.json").read_text(encoding="utf-8"))}
    rows = []
    for r in source:
        item = {"code": r["kab_code"], "provinceCode": r["prov_code"], "name": names[r["kab_code"]], "province": r["province"].title(), "ikp_group": int(r["ikp_group"]), "ikp_rank": int(r["ikp_rank"])}
        item.update({k: float(r[k]) if r[k] else None for k in FIELDS})
        item["years"] = {k: int(r.get(k + "_year", "2025") or 2025) for k in FIELDS}
        item["qualityNotes"] = []
        # Preserve the earlier audited city/regency identity conflict.
        if item["code"] == "9171":
            item["pph"] = None
            item["qualityNotes"].append("PPH ditahan: kode 9171 berkonflik dengan nama Kabupaten Pegunungan Bintang pada sumber cleaned.")
        if item["pou_pct"] is None:
            item["qualityNotes"].append("PoU, populasi dan jumlah terdampak 2025 yang valid tidak tersedia pada dataset olahan; tidak diisi dengan nol.")
        rows.append(item)
    assert len(rows) == 514 and len({r["code"] for r in rows}) == 514
    assert sum(r["pou_pct"] is not None for r in rows) == 503
    payload = {"year": 2025, "districts": rows, "sourceFiles": ["20_indonesia_district_join_preview.csv", "01_pou_kabkota_2025_clean.csv", "04_ikp_kabkota_2025_clean.csv", "06_pph_kabkota_clean.csv", "07_energy_kabkota_clean.csv", "08_protein_kabkota_clean.csv"]}
    (BASE / "app-data/v2-districts.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":"), allow_nan=False), encoding="utf-8")

    geo = json.loads((BASE / "app-data/indonesia_kabkota.geojson").read_text(encoding="utf-8-sig"))
    shapes = []
    for feature in geo["features"]:
        g = feature["geometry"]
        polygons = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        path, xs, ys = [], [], []
        for polygon in polygons:
            for ring in polygon:
                simplified = rdp(ring)
                if len(simplified) < 4:
                    simplified = ring
                projected = [((p[0] - 94) * 20, (6 - p[1]) * 20) for p in simplified]
                xs.extend(p[0] for p in projected)
                ys.extend(p[1] for p in projected)
                path.append("M" + "L".join(f"{x:.2f},{y:.2f}" for x, y in projected) + "Z")
        shapes.append({"code": str(feature["properties"]["code"]).replace(".", ""), "path": "".join(path), "bbox": [min(xs), min(ys), max(xs), max(ys)]})
    assert len(shapes) == 514 and {s["code"] for s in shapes} == {r["code"] for r in rows}
    (BASE / "app-data/v2-map.json").write_text(json.dumps({"shapes": shapes, "projection": "Equirectangular, degrees scaled by 20 at equator", "simplificationDegrees": 0.006}, separators=(",", ":")), encoding="utf-8")
    print(f"Prepared {len(rows)} districts, {len(shapes)} geographic paths; no Group D attributes. Map {sum(len(s['path']) for s in shapes):,} characters.")


if __name__ == "__main__":
    main()
