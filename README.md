# NOURISH 2.0 — Food Security Explorer

Atlas ketahanan pangan Indonesia, snapshot 2025: **514 kabupaten/kota di 38 provinsi**.

## Menjalankan sendiri

Node.js 20+ dan npm diperlukan. Dependensi yang sudah ada digunakan kembali; tidak ada library baru.

```text
npm ci
npm run dev
```

Jika dependensi sudah terpasang, cukup `npm run dev`. Buka alamat yang ditampilkan Vite.

Sesuai permintaan pemilik, server dan browser tidak dijalankan saat implementasi v2.

## Tiga tingkat eksplorasi

1. **Atlas** — choropleth IKP/indikator inti, legenda dinamis, filter, pan/zoom, distribusi kelompok 1–6, peringkat IKP.
2. **District Lens** — peta provinsi dengan wilayah fokus, dossier metrik, pembanding seprovinsi pada aligned dot plot.
3. **Explore** — scatter PoU × jumlah terdampak, hubungan indikator × IKP, linked selection, korelasi Pearson, distribusi IKP box plot, tabel dan ekspor CSV.

Style editorial ivory/forest mengikuti dua referensi pemilik di `docs/v2-reference/`. Desain dan batas implementasi dijelaskan di `docs/V2_IMPLEMENTATION.md`, termasuk what–why–how, expressiveness dan effectiveness.

## Data

Data browser disertakan pada `app-data/v2-districts.json` dan `app-data/v2-map.json`. Menjalankan aplikasi tidak membutuhkan sumber CSV privat, API key, server data, atau AI. Font Google opsional memiliki fallback lokal.

- PoU/populasi/headcount valid: 503/514 wilayah; 11 Jambi tetap kosong.
- IKP: 514/514. Peringkat memakai peringkat sumber nasional.
- PPH: 513/514 setelah menahan konflik identitas Kota Jayapura; tidak diisi nol.
- Energi/protein: 514/514.
- Hanya snapshot 2025 dan indikator inti. Tidak ada skor prioritas gabungan, simulasi, rekomendasi, atau tren historis pada UI v2.
- Peta bergabung 514/514 kode; geometri disederhanakan untuk tampilan, bukan batas hukum.

`npm run data:v2` memperbarui data dari CSV lokal di folder analisis yang ditentukan pada `scripts/build-v2-data.py`; tidak diperlukan untuk penggunaan biasa. Sumber asli tidak diubah.

## Pemeriksaan

```text
npm test
npm run build
```

Pemeriksaan TypeScript statis telah dilakukan. Runtime tests, build produksi, visual QA dan usability study belum dijalankan pada versi ini, mengikuti permintaan pemilik untuk menjalankan web sendiri.

Source lama competition tetap tersimpan sebagai arsip kode; `src/main.tsx` kini membuka `src/V2App.tsx`. README terdahulu disimpan pada `docs/LEGACY_README.md`.

## Lisensi

Kode mengikuti MIT License. Data dan geometri pihak ketiga mengikuti ketentuan sumber masing-masing.
