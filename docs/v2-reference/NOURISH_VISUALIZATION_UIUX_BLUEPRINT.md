# NOURISH — Blueprint Visualisasi dan Rancangan UI/UX

> **Status:** Design specification untuk tahap eksplorasi UI.  
> **Pendekatan:** *What–Why–How* (Tamara Munzner).  
> **Cakupan:** Indonesia, 514 kabupaten/kota di 38 provinsi; observasi utama tahun 2025.  
> **Batasan:** Kelompok D **dieliminasi seluruhnya**. Tidak ada variabel kemiskinan, pendidikan, pasar, bencana, hutan/pertanian, BPNT, lansia, ataupun pelayanan stunting pada visualisasi atau filter. Tidak ada simulasi kebijakan atau rekomendasi otomatis dalam cakupan ini.

## 1. Tujuan produk dan prinsip utama

**NOURISH** adalah *food-security explorer* berbasis peta, untuk membantu analis, peneliti, dan perencana program memahami kondisi ketahanan pangan wilayah secara transparan.

Pertanyaan inti:
1. **Di mana** kondisi ketahanan pangan berbeda secara geografis?
2. **Bagaimana** kondisi satu kabupaten/kota dibanding wilayah lain?
3. **Bagaimana keterkaitan** IKP, konsumsi pangan, prevalensi kurang gizi, dan jumlah penduduk terdampak?
4. **Apakah prioritas berdasarkan prevalensi** berbeda dengan prioritas berdasarkan jumlah orang terdampak?

NOURISH mendukung penilaian berbasis bukti; bukan alat untuk otomatis memilih intervensi, menyatakan penyebab masalah, atau meramal kondisi masa depan.

### Struktur entitas dan variabel yang dipertahankan

| Kelompok | Variabel CSV | Makna |
|---|---|---|
| A — Wilayah & IKP | `kab_code`, `prov_code`, `province`, `kab_kota`, `ikp`, `ikp_group`, `ikp_rank` | Identitas wilayah dan kondisi indeks ketahanan pangan |
| B — Konsumsi/gizi | `pou_pct`, `pph`, `energy_kcal_cap_day`, `protein_g_cap_day` | Prevalensi kurang gizi, pola pangan, energi, protein |
| C — Populasi/beban | `population`, `undernourished_people` | Jumlah penduduk dan perkiraan penduduk kurang gizi |
| Metadata saja | `ikp_year`, `pph_year`, `undernourished_people_year`, `energy_kcal_cap_day_year`, `protein_g_cap_day_year` | Tahun sumber tiap indikator untuk transparansi |

**Grain:** satu baris per `kab_code`, bukan satu baris per nama kabupaten/kota saja. Nama yang sama dapat muncul pada kode/wilayah berbeda. **Peta kabupaten/kota membutuhkan GeoJSON/shapefile eksternal yang dicocokkan dengan `kab_code`.**

**Data availability:** semua 514 baris memiliki `ikp`, `pph`, energi, dan protein; `pou_pct`, `population`, serta `undernourished_people` tersedia pada 503 baris. Sebelas baris lain harus ditampilkan sebagai **“Data tidak tersedia”**, bukan nol. Tahun 2025 adalah *snapshot*, tidak mendukung visualisasi tren lintas tahun.

---

## 2. Information architecture

Tiga tingkat bukan tiga agregasi geografis. **Tingkat 1, 2, dan 3 adalah kedalaman eksplorasi** yang semuanya tetap menggunakan data kabupaten/kota.

```text
NOURISH
├── TINGKAT 1 — ATLAS / Gambaran Nasional
│   ├── Choropleth kabupaten/kota seluruh Indonesia
│   ├── Legenda & filter indikator peta
│   ├── Distribusi kelompok IKP
│   └── Peringkat wilayah (opsional, panel ringkas)
│        └── Klik wilayah
├── TINGKAT 2 — DISTRICT LENS / Peta Wilayah
│   ├── Peta terfokus pada kabupaten/kota terpilih
│   ├── Profil IKP & konteks lokasi
│   ├── Metrik konsumsi/gizi
│   ├── Populasi vs jumlah penduduk kurang gizi
│   └── Perbandingan antarkabupaten/kota seprovinsi
│        └── Pilih 'Analisis lebih lanjut'
└── TINGKAT 3 — EXPLORE / Analisis Lanjutan
    ├── Scatter: prevalensi vs jumlah terdampak (utama)
    ├── Scatter: IKP vs PPH / PoU / energi / protein
    ├── Correlation heatmap (indikator inti)
    ├── Box plot: distribusi IKP antarprovinsi
    └── Heatmap indikator ternormalisasi (opsional)
```

Alur utama: **Overview → Select → Inspect → Compare → Explore**. Filter yang masih relevan dibawa ke tingkat berikutnya dan harus bisa di-reset.

---

## 3. Tingkat 1 — ATLAS: Tampilan Utama Peta

### Tujuan UX
Memperlihatkan pola nasional, mengidentifikasi wilayah dengan skor IKP rendah/tinggi, dan menjadi pintu masuk eksplorasi wilayah.

### Idiom 1.1 — Choropleth map (**utama**)

| Elemen Munzner | Abstraksi |
|---|---|
| **What** | Geometri poligon kabupaten/kota, `kab_code`, `province`, `kab_kota`, `ikp`, `ikp_group` |
| **Why** | *Explore → Locate, Identify, Compare*: mengenali posisi dan pola spasial |
| **How — Marks** | Area/poligon geografis |
| **How — Channels** | Posisi & bentuk geografis; warna isi menunjukkan **satu indikator aktif** |
| **How — Interactions** | Hover tooltip, pilih poligon, pan/zoom, pencarian, ganti indikator, filter |
| **Outcome** | Pengguna menemukan wilayah dan memahami indikator yang dipetakan |

**Default:** isi peta menggunakan `ikp`, dengan legenda berurutan. Pengguna boleh mengganti mode ke `ikp_group` (enam kategori urut), `pou_pct`, `undernourished_people`, `pph`, konsumsi energi, atau protein. Setiap pergantian harus memperbarui legenda, satuan, label, dan *missing-value state*. Jangan memberi satu warna untuk dua metrik sekaligus.

**Tooltip hover ringkas:** nama kabupaten/kota, provinsi, IKP, kelompok IKP, peringkat. Jika metrik aktif selain IKP, tampilkan nilai metrik aktif beserta satuannya. Tooltip bukan seluruh kartu profil.

**Klik** wilayah → Tingkat 2 / District Lens.

### Idiom 1.2 — Distribusi kelompok IKP

| What | Why | How |
|---|---|---|
| `ikp_group` dan jumlah wilayah per kelompok | *Summarize, Compare*: melihat komposisi wilayah | **Ordered horizontal bar chart** enam kelompok dengan *count*, bukan pie chart |

Setiap batang dapat dijadikan filter lintas peta; tampilkan kategori 1–6 sesuai urutan sumber. Jangan membuat label tingkat kerawanan tanpa memverifikasi metadata resmi.

### Idiom 1.3 — Peringkat wilayah

| What | Why | How |
|---|---|---|
| `kab_kota`, `province`, `ikp`, `ikp_rank` | *Rank, Identify*: temukan wilayah ekstrem | **Horizontal ranked bar chart** (10 terendah/tertinggi, opsi 20) |

Jangan tampilkan 514 batang sekaligus; panel dapat dilipat/dibuka. Klik batang harus menyorot poligon terkait dan membuka detailnya.

### Layout desktop — Atlas

```text
┌─────────────────────────────────────────────────────────────────────┐
│ NOURISH     Atlas | District Lens | Explore            Sumber Data  │
├─────────────────────────────────────────────────────────────────────┤
│ Ketahanan Pangan Indonesia 2025                                    │
│ [Provinsi ▼] [Kelompok IKP ▼] [Indikator Peta ▼] [Cari wilayah...] │
├─────────────────────────────────────────────┬───────────────────────┤
│                                             │  Distribusi Kelompok │
│                                             │  IKP                  │
│          CHOROPLETH MAP                     │  ▬▬▬ 1               │
│          (konten dominan)                   │  ▬▬▬▬▬ 2             │
│                                             │  ▬▬▬▬▬▬▬ 3           │
│                                             ├───────────────────────┤
│                                             │  Ranking terendah /   │
│                                             │  tertinggi (collapse)│
├─────────────────────────────────────────────┴───────────────────────┤
│ Legenda aktif  |  Tahun data  |  Cakupan / ketersediaan  | Metode   │
└─────────────────────────────────────────────────────────────────────┘
```

**Prioritas viewport:** peta harus menjadi konten pertama dan terbesar. Panel samping ringkas; jangan menggantikannya dengan kartu KPI besar atau banner hero dekoratif.

---

## 4. Tingkat 2 — DISTRICT LENS: Peta Wilayah

### Tujuan UX
Memeriksa satu kabupaten/kota dan memahami posisinya relatif terhadap wilayah pembanding. Tidak menampilkan data kecamatan/desa karena tidak tersedia.

### Idiom 2.1 — Focused/zoomable choropleth (**konteks spasial**)

| What | Why | How |
|---|---|---|
| Wilayah terpilih, `kab_code`, IKP dan poligon lain dalam provinsi/kawasan | *Lookup, Locate*: menemukan wilayah dan konteks geografisnya | **Zoomable choropleth** dengan outline wilayah terpilih |

Zoom/sorot kabupaten/kota, tampilkan wilayah pembanding tingkat kabupaten/kota; **tidak membuat peta subkabupaten**.

### Idiom 2.2 — Selected-region metric summary

| What | Why | How |
|---|---|---|
| `ikp`, `ikp_group`, `ikp_rank`, `pou_pct`, `population`, `undernourished_people`, `pph`, energi, protein | *Identify, Lookup*: membaca nilai tepat | **Compact KPI/metric tiles + tabular numeric labels** |

Urutan profil:
1. **Identitas:** nama kabupaten/kota, provinsi, tahun data.
2. **IKP:** skor, kelompok, peringkat.
3. **Severity:** PoU persen.
4. **Scale:** estimasi orang kurang gizi, dan populasi sebagai konteks.
5. **Pangan & konsumsi:** PPH, kkal/kapita/hari, gram protein/kapita/hari.

KPI cards mendukung pembacaan satu nilai; **bukan** pengganti grafik saat membandingkan antarwilayah. Jangan memakai ikon warna atau istilah “risiko tinggi” tanpa ambang yang didukung sumber.

### Idiom 2.3 — Perbandingan wilayah (**visual analitis utama tingkat 2**)

| What | Why | How |
|---|---|---|
| Wilayah terpilih + wilayah pembanding seprovinsi, satu indikator aktif | *Compare, Rank*: melihat posisi relatif | **Aligned dot plot** atau **horizontal bar chart** dengan urutan jelas |

- Default perbandingan: IKP.
- Pilih indikator tunggal: IKP / PoU % / PPH / energi / protein / jumlah kurang gizi.
- Sorot titik/batang wilayah terpilih; wilayah pembanding berwarna netral.
- Beri opsi “Semua kab/kota di provinsi ini”, “10 terbawah/teratas”, atau memilih maksimal 5 wilayah pembanding.
- Perbandingan jumlah absolut jangan disalahartikan sebagai prevalensi.
- Jika menampilkan rerata provinsi, labelkan sebagai **rerata indikator kabupaten/kota yang tersedia**, jelaskan metode, bukan indikator resmi tingkat provinsi.

### Layout desktop — District Lens

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Atlas / Provinsi / Kabupaten Terpilih                   Kembali      │
├───────────────────────────────────────┬──────────────────────────────┤
│ PETA WILAYAH (selected outline)       │ DETAIL KABUPATEN/KOTA        │
│                                       │ IKP | Kelompok | Peringkat   │
│                                       │ PoU %   |  Jumlah orang      │
│                                       │ Populasi                    │
│                                       │ PPH | Energi | Protein      │
├───────────────────────────────────────┴──────────────────────────────┤
│ PERBANDINGAN ANTARWILAYAH — DOT PLOT                                 │
│ [Indikator ▼] [Wilayah pembanding ▼]                 [Explore →]    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Tingkat 3 — EXPLORE: Analisis Lanjutan

### Tujuan UX
Mengeksplorasi hubungan, perbedaan distribusi, dan *trade-off* antara **severity** (prevalensi) dan **scale** (jumlah terdampak). Fokus tetap pada Kelompok A–C saja.

### Idiom 3.1 — Severity × Scale scatter plot (**utama**)

| What | Why | How |
|---|---|---|
| `pou_pct`, `undernourished_people`, `kab_code`, `province`, opsional `population` | *Explore, Relate, Identify*: membandingkan tingkat masalah dan besaran populasi terdampak | **Scatter plot**; X = PoU %, Y = jumlah penduduk kurang gizi |

- Setiap titik = satu kabupaten/kota.
- Tooltip: wilayah, provinsi, PoU %, estimasi orang kurang gizi, populasi.
- Warna bisa menunjukkan kelompok IKP; tampilkan legenda.
- *Brush selection* pada scatter menyorot wilayah pada peta / daftar.
- Ukuran titik menggunakan populasi **hanya jika terbaca dan tidak mengganggu** (bubble chart opsional).
- Kuadran atau ambang **hanya ditampilkan bila ditetapkan dan dijelaskan pengguna**, bukan batas arbitrer yang diinterpretasikan sebagai status resmi.
- Wilayah tanpa PoU atau estimasi jumlah harus dikeluarkan dari plot dengan catatan *n*; tidak diisi nol.

**Interpretasi:** tingkat PoU tinggi tidak otomatis berarti jumlah penduduk kurang gizi terbesar; keduanya harus terlihat terpisah, tanpa dibuat skor komposit tersembunyi.

### Idiom 3.2 — Scatter plot hubungan IKP

| What | Why | How |
|---|---|---|
| `ikp` dengan salah satu dari `pph`, `pou_pct`, energi, atau protein | *Relate, Identify anomalies*: memeriksa asosiasi bivariabel | **Scatter plot dengan sumbu yang dapat diganti** |

- Default: X = PPH, Y = IKP.
- Pilihan hubungan lain: PoU–IKP, energi–IKP, protein–IKP.
- Opsi garis tren setelah data valid, plus *n* dan definisi statistik.
- Tekankan **asosiasi, bukan kausalitas**; hubungan antarkomponen indeks juga bisa bersifat struktural.

### Idiom 3.3 — Correlation heatmap

| What | Why | How |
|---|---|---|
| IKP, PoU %, PPH, energi, protein | *Summarize, Relate*: memindai korelasi antarindikator | **Diverging correlation matrix heatmap** |

- Skala warna bertitik netral pada `r = 0`, domain −1 sampai +1.
- Perlihatkan nilai koefisien bila ukuran sel memungkinkan.
- Tooltip menyebut pasangan indikator, r, n, metode (mis. Pearson).
- Jelaskan perbedaan jumlah data valid antar pasangan.
- Jangan menambah variabel Group D; jangan memakai matriks sebagai bukti sebab-akibat.

### Idiom 3.4 — IKP distribution comparison

| What | Why | How |
|---|---|---|
| Distribusi `ikp` untuk kabupaten/kota di beberapa provinsi | *Compare, Summarize, Identify outliers* | **Box plot**, optionally overlaid jittered dots |

- Batasi default ke 5–8 provinsi yang dipilih untuk menjaga keterbacaan.
- Perlihatkan median, kuartil, nilai rentang/outlier, dan jumlah kabupaten/kota per provinsi.
- Tidak menyebut median kabupaten/kota sebagai IKP resmi provinsi.

### Idiom 3.5 — Profil indikator multivariabel (opsional)

| What | Why | How |
|---|---|---|
| Wilayah terpilih × IKP, PoU, PPH, energi, protein | *Compare, Find patterns*: melihat profil relatif beberapa wilayah | **Heatmap multivariabel** |

- Normalisasi **per kolom**, bukan menggabungkan semua satuan menjadi satu angka.
- Warna dan legenda berorientasi jelas terhadap makna masing-masing metrik (PoU lebih tinggi tidak identik dengan IKP lebih tinggi).
- Tampilkan nilai dan unit asli pada hover.
- Jika normalisasi membuat kesan keliru, gunakan tabel/dot plot per indikator sebagai alternatif.

### Layout desktop — Explore

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Explore   [Provinsi ▼] [Kelompok IKP ▼] [Cari kab/kota...]          │
├──────────────────────────────────────────────────────────────────────┤
│ Severity × Scale                                            [Info] │
│ [SCATTER UTAMA: PoU % vs jumlah orang kurang gizi]                   │
│     Brush/filter selection / linked map highlight                   │
├─────────────────────────────────┬────────────────────────────────────┤
│ IKP × [PPH / PoU / energi /      │ Correlation heatmap                │
│ protein]                        │ IKP, PoU, PPH, energi, protein      │
│ [Scatter sekunder]              │                                    │
├─────────────────────────────────┴────────────────────────────────────┤
│ Perbandingan distribusi IKP: [Pilih Provinsi]  [Box plot]            │
│ (opsional) Profil beberapa wilayah × beberapa indikator            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Tabel ringkasan idiom per tingkat

| Tingkat | Idiom | What | Why | How/encoding | Prioritas |
|---|---|---|---|---|---|
| 1 Atlas | Choropleth | Poligon + IKP | Locate / Explore | Area + sequential color | **Wajib** |
| 1 Atlas | Ordered bar | Kelompok IKP + count | Summarize / Compare | Length + ordered position | **Wajib** |
| 1 Atlas | Ranked bar | Wilayah + IKP | Rank / Identify | Horizontal length | Pendukung |
| 2 District Lens | Focused map | Wilayah terpilih | Lookup / Locate | Highlight / outline + zoom | **Wajib** |
| 2 District Lens | Metric tiles | IKP, PoU, populasi, gizi | Lookup / Identify | Text + numeric emphasis | **Wajib** |
| 2 District Lens | Dot plot | Indikator pada beberapa wilayah | Compare / Rank | Aligned position | **Wajib** |
| 3 Explore | Severity–scale scatter | PoU %, estimasi jumlah orang | Explore / Relate | X/Y position | **Wajib** |
| 3 Explore | IKP relationship scatter | IKP + PPH/PoU/energi/protein | Relate | X/Y position | **Wajib** |
| 3 Explore | Correlation heatmap | Lima indikator inti | Summarize / Relate | Cell color diverging | Pendukung |
| 3 Explore | Box plot | IKP per provinsi | Compare distributions | Quartile position / length | Pendukung |
| 3 Explore | Indicator heatmap | Wilayah × indikator | Compare profiles | Normalized cell color | Opsional |

---

## 7. Design system / visual language

**Arah:** *editorial policy-analytics*, hangat tetapi objektif, **map-first** dan *chart-first*.

| Token | Nilai yang disarankan | Peran |
|---|---|---|
| Canvas | `#F7F5EF` | Latar ivory |
| Paper surface | `#FFFFFF` | Panel, overlay, kartu |
| Secondary surface | `#F1F2EC` | Area sekunder |
| Main text | `#222821` | Teks utama |
| Secondary text | `#5E675F` | Label dan metadata |
| Border | `#D9DED6` | Pemisah tipis |
| Primary action | `#315F4D` | Tombol, fokus, pilihan |
| Muted ochre | `#B88142` | Aksen editorial, bukan sinyal risiko universal |
| Severity dimension | `#4E806A` | Identitas visual PoU |
| Scale dimension | `#467FA2` | Identitas visual jumlah terdampak |
| Unavailable | `#D8DAD4` + pattern/label | Nilai tidak tersedia |

Tipografi: Plus Jakarta Sans (heading), Inter (body/data), angka tabular; spacing berbasis 8px; border 1px; radius 6–12px; shadow minimal. Gunakan hierarki teks dan *alignment* yang konsisten, bukan dekorasi.

**Warna peta:** `ikp` memakai skala sekuensial yang dapat dibaca; `ikp_group` memakai enam langkah berurutan dengan legenda kategori. Metrik yang diganti harus menggunakan legenda satuan dan skala yang sesuai. Warna hilang-data harus jelas dibedakan dari nilai nol.

**Aksesibilitas:** teks AA, fokus keyboard terlihat, label satuan di sumbu/tooltip, nilai tidak disampaikan hanya melalui warna, ukuran target sentuh memadai, serta pilihan *reduced motion*.

---

## 8. Interaksi & alur pengguna

### Journey utama
1. **Masuk Atlas.** Pengguna melihat peta Indonesia; indikator awal = IKP.
2. **Memahami legenda.** Pengguna memilih provinsi, kelompok, atau indikator peta.
3. **Pilih wilayah.** Hover memberi tooltip singkat; klik membuka District Lens.
4. **Periksa profil.** PoU persen (severity) dan estimasi jumlah orang (scale) ditampilkan sebagai metrik yang berbeda.
5. **Bandingkan wilayah.** Dot plot memperlihatkan posisi kabupaten/kota terpilih relatif pada seprovinsi.
6. **Buka Explore.** Scatter memperlihatkan severity × scale atau asosiasi IKP dengan indikator pangan.
7. **Kembali ke peta.** Konteks filter/pilihan terjaga dan dapat dihapus.

### Perilaku UX wajib
- **Cross-filtering:** filter provinsi, kelompok IKP, dan pilihan wilayah konsisten.
- **Cross-highlighting:** hover atau brush pada grafik menyorot titik/poligon/list item yang sesuai, jika ada.
- **Selection persistence:** wilayah terpilih diberi outline kontras dan label; tidak hilang hanya karena kursor berpindah.
- **Reset:** tombol "Hapus filter" dan "Kembali ke Atlas".
- **Cakupan data:** informasi `n`/jumlah wilayah yang ikut di setiap visualisasi, khususnya ketika PoU tidak tersedia.
- **Missing vs zero:** kosong ditulis “Data tidak tersedia”; 0 tetap 0 jika memang valid.
- **Tidak ada time slider:** seluruh indikator pada cuplikan 2025; metadata tiap sumber dapat dibuka.
- **Responsive:** desktop peta dominan + panel sisi; mobile peta penuh + *bottom sheet* yang bisa diperluas; grafik ditumpuk, tidak dipaksa terlalu sempit.

---

## 9. Data integrity & batas interpretasi

1. **Jangan mengagregasi skor/persentase dengan penjumlahan.** `ikp`, `pph`, `pou_pct`, energi, dan protein bukan jumlah yang bisa dijumlahkan antarkabupaten.
2. **Jika perlu angka lintas wilayah**, jelaskan metode: misalnya PoU gabungan yang dihitung dari estimasi jumlah orang kurang gizi dibagi populasi tercakup, bukan rata-rata persentase tanpa bobot; tampilkan berapa wilayah yang tercakup.
3. **Tidak membuat indikator gabungan prioritas tanpa definisi metodologis.** Severity dan scale harus tetap eksplisit.
4. **Jangan menyimpulkan sebab-akibat** dari scatter/correlation heatmap.
5. **Jangan memasukkan kelompok D**, baik di visualisasi eksplorasi maupun konten penjelasan.
6. **Jangan membuat skala waktu/forecast, peta kecamatan/desa, atau informasi yang tidak tersedia.**
7. **Periksa metadata kategori IKP** sebelum menamai kelompok 1–6 dengan istilah substantif.
8. **Bedakan indikator asli dan statistik turunan.** Label “rerata IKP kabupaten/kota pada provinsi terpilih” tidak sama dengan “IKP resmi provinsi”.

---

## 10. Prioritas implementasi

### MVP — idiom paling penting
1. Tingkat 1: choropleth IKP + legenda + distribusi `ikp_group` + filter.
2. Tingkat 2: focused map + profil wilayah + dot plot perbandingan kabupaten/kota.
3. Tingkat 3: severity–scale scatter + IKP–PPH/PoU scatter.
4. Semua tingkat: unavailable state, metadata sumber/tahun, navigasi, filter, dan tooltip.

### Iterasi berikutnya
- Ranked bar panel nasional yang lebih kaya.
- Correlation heatmap lima indikator.
- Box plot distribusi IKP antarprovinsi.
- Heatmap multivariabel bagi pengguna tingkat lanjut.
- Linked brushing/pemilihan lebih kompleks bila performa dan keterbacaan sudah teruji.

---

## 11. Checklist evaluasi UX dan visualisasi

- [ ] Tiap idiom menjawab satu pertanyaan analitis yang jelas.
- [ ] Peta utama menunjukkan **satu indikator warna dalam satu waktu**.
- [ ] Pengguna dapat memahami legenda, tahun, satuan, dan arti missing data.
- [ ] Identitas wilayah menggunakan kode kabupaten/kota yang stabil.
- [ ] Klik peta membuka data tingkat **kabupaten/kota**, bukan detail yang tidak tersedia.
- [ ] Severity (PoU %) dibedakan jelas dari scale (estimasi jumlah orang).
- [ ] Dot plot mempunyai wilayah terpilih dan pembanding yang jelas.
- [ ] Scatter plot menunjukkan unit, jumlah data valid, dan tidak membuat klaim kausal.
- [ ] Rerata/agregasi wilayah lain diberi definisi dan cakupan.
- [ ] Kelompok D benar-benar tidak muncul di produk ini.
- [ ] Tampilan desktop dan mobile dapat dioperasikan tanpa kehilangan informasi penting.
- [ ] Tidak ada simulasi, forecasting, atau rekomendasi kebijakan otomatis pada versi ini.
