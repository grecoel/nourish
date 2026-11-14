# NOURISH 2.0 — spesifikasi yang diimplementasikan

## Acuan dan cakupan

Versi ini mengacu pada `DESIGN.md` (Editorial Agrarian Intelligence) dan `NOURISH_VISUALIZATION_UIUX_BLUEPRINT.md` yang diberikan pemilik proyek. Keduanya digunakan sebagai referensi produk/desain, bukan instruksi untuk menjalankan aplikasi atau mengakses layanan lain.

Cakupan v2 mengikuti acuan terbaru: **514 kabupaten/kota, 38 provinsi, snapshot 2025**. Ini menggantikan arah Cities/tren pada antarmuka utama. Source competition lama dipertahankan sebagai arsip kode; entry point sekarang `src/V2App.tsx`. Tidak ada panel tren, simulasi, prediksi, asisten AI, atau variabel faktor risiko dalam antarmuka maupun kontrak data v2.

Palet mengikuti bagian naratif DESIGN dan blueprint: canvas ivory `#F7F5EF`, paper `#FFFFFF`, forest `#315F4D`, severity `#4E806A`, scale `#467FA2`, ochre `#B88142`, border `#D9DED6`. Ini menyelesaikan perbedaan antara token frontmatter hijau pucat dan nilai canvas ivory pada narasi. Font Plus Jakarta Sans/Inter dimuat sebagai peningkatan opsional melalui Google Fonts; fallback lokal menjaga aplikasi tetap terbaca tanpa koneksi.

## Tingkat 1 — Atlas

- Choropleth poligon aktual 514 kabupaten/kota. Indikator awal IKP; bisa diganti ke kelompok IKP, PoU, headcount, PPH, energi, protein.
- Satu indikator warna pada satu waktu; legenda dan satuan ikut berubah. Domain nasional tetap saat filter berubah.
- Filter provinsi, kelompok IKP, nama/kode; reset.
- Kelompok 1–6 memakai urutan sumber dan tidak diberi label kerawanan baru. Klik bar memfilter peta. Distribusi dihitung sebelum filter kelompok agar konteks enam kelompok tetap terlihat; provinsi dan pencarian tetap berlaku.
- Ranking IKP terendah/tertinggi 10/20 wilayah, dengan nilai dan hover/pemilihan terhubung.
- Pan dengan drag atau tombol arah, zoom dengan tombol +/−, reset view, fokus wilayah. Klik/Enter poligon membuka District Lens.
- Null diarsir, bukan dinyatakan nol atau kondisi buruk. Poligon di luar filter diredam dan tidak bisa dipilih.

## Tingkat 2 — District Lens

- Peta terfokus pada provinsi, outline dan label wilayah terpilih, opsi fokus poligon tunggal.
- Dossier IKP, kelompok, peringkat sumber, PoU, headcount, populasi, PPH, energi/protein; metadata tahun serta definisi dapat dibuka.
- Dot plot satu indikator pada skala bersama: seluruh pembanding seprovinsi sesuai filter, 10 terendah/tertinggi plus wilayah fokus, atau maksimal 5 pembanding manual.
- Profil yang berada di luar filter diberi pemberitahuan eksplisit; filter tidak diam-diam dihapus.
- Navigasi balik Atlas dan ke Explore mempertahankan scope serta identitas wilayah.
- Pada mobile, dossier menjadi bottom sheet yang dibuka dari tombol profil dan dapat ditutup, sehingga peta tetap mendapat ruang utama.

## Tingkat 3 — Explore

- Scatter PoU × headcount: pasangan lengkap saja, n jelas, titik berukuran sama, sumbu nol dan domain nasional tetap.
- Scatter PPH/PoU/energi/protein × IKP dengan sumbu x dapat diganti.
- Linked brush pada area scatter: set wilayah disorot pada kedua scatter, peta konteks, dan tabel. Checkbox tabel menyediakan cara memilih tanpa gesture pointer.
- Korelasi Pearson lima indikator inti: domain warna −1…+1, netral di nol, koefisien dan n per pasangan pada tooltip/focus. Nilai konstan atau n<3 tidak menghasilkan koefisien palsu.
- Box plot IKP untuk hingga 8 provinsi: kuartil interpolasi linear, median, whisker Tukey 1,5×IQR, outlier aktual, n. Saat filter provinsi aktif, hanya provinsi tersebut yang ditampilkan.
- Registri dengan geographic identifier column frozen, angka tabular rata kanan, sort, drill-through, dan CSV yang mengikuti filter atau brush. Nilai kosong tetap kosong pada CSV; kualitas data disertakan.
- Heatmap profil ternormalisasi opsional sengaja tidak ditambahkan: dot plot/tabel sudah memberi perbandingan nilai asli tanpa menyamarkan arah indikator.

## What–why–how, expressiveness, effectiveness

| Tampilan | What | Why | How |
|---|---|---|---|
| Peta | Geometri + satu atribut kuantitatif/ordinal | Locate, identify, explore | Posisi geografis + sequential luminance; tooltip, pan/zoom, select |
| Distribusi kelompok | Kelompok ordinal + count | Summarize, compare | Ordered horizontal bars, urutan 1–6 |
| Ranking | Identitas + IKP kuantitatif | Rank, discover extremes | Horizontal lengths dari nol, urutan nilai jelas |
| Profil | Wilayah + indikator dengan satuan | Lookup | Numeric labels, definisi dan tahun |
| Pembanding | Wilayah seprovinsi + satu indikator | Compare, identify | Dot plot pada skala bersama, sorotan fokus |
| Scatter | Pasangan atribut kuantitatif per wilayah | Relate, identify outliers | X/Y position, linked selection, bukan causal claims |
| Korelasi | Statistik pasangan indikator | Summarize relationships | Diverging cells pada skala tetap; nilai/n dapat diperiksa |
| Box plot | Distribusi IKP menurut provinsi | Compare distributions | Posisi kuartil/median/whisker dan titik outlier |
| Registri | Nilai asli, kategori, identitas | Lookup, verify | Tabel + sort + export sesuai scope |

Expressiveness: tidak mencampur satuan, waktu, identitas atau ranking; jumlah berbeda dari proporsi; data kosong tidak menjadi nol; kelompok tidak direkayasa sebagai kelas risiko. Effectiveness: posisi/panjang untuk perbandingan tepat; warna peta untuk pola geografis, bukan pengganti ranking; chart skala dan jumlah observasi eksplisit; detail/tabel menyediakan angka tepat.

## Data dan geometri

`scripts/build-v2-data.py` membangun kontrak browser yang hanya berisi atribut yang disetujui dari CSV lokal. Data browser sudah disertakan, sehingga menjalankan aplikasi tidak membutuhkan sumber analisis privat. Skrip tidak mengunduh data.

- 514 record unik, 38 provinsi; 503 observasi PoU/headcount tersedia.
- PPH Jayapura tetap ditahan karena konflik nama sumber dengan kode. Cakupan aktual PPH **513/514**, berbeda dari angka lengkap yang disebut blueprint; koreksi ini diungkapkan dalam modal sumber dan profil.
- Dataset lama dan sumber asli tidak ditimpa.
- Geometri asli dicocokkan berdasarkan kode, 514/514. Path diproyeksikan equirectangular dan disederhanakan dengan toleransi 0,006° untuk tampilan. Semua entitas dipertahankan; pulau/ring kecil tidak dibuang jika simplifikasi akan merusak ring.
- Penyederhanaan untuk tampilan bukan validasi topologi/legal batas wilayah. Peta asli tetap tersedia sebagai provenance.
- Sumber penerbit/methodology dan URL asli PPH/energi/protein belum diverifikasi ulang; gap ini terlihat pada sumber & metode.

## Verifikasi dan pekerjaan tersisa

Pemeriksaan statis TypeScript dilakukan tanpa menjalankan situs. Tes model/data ditambahkan pada `app-tests/v2.test.mjs`, mencakup grain, coverage, isolasi indikator, kode geometri, filter, Pearson dan box plot.

**Atas permintaan pemilik, server, browser, build produksi dan tes runtime tidak dijalankan untuk versi ini.** Visual QA desktop/mobile, gesture pan/brush dan usability peserta nyata masih perlu dilakukan setelah pemilik menjalankannya. Struktur CSS menyediakan desktop map-first dan stacking mobile; itu bukan klaim visual QA telah selesai.

Perintah untuk pemilik:

```text
npm run dev
npm test
npm run build
```

`npm run data:v2` hanya diperlukan saat memperbarui sumber CSV/geometri lokal; tidak diperlukan untuk menjalankan hasil yang sudah disertakan.
