# NOURISH — audit data engineering, 21 Oktober 2026

Sumber pemeriksaan: CSV lokal di folder ##Data, kode pipeline dan JSON aplikasi saat ini. Tidak memeriksa ulang penerbit dan tidak menjalankan web. Audit bersifat assessment; sumber dan aplikasi tidak diubah. Notebook pendamping memuat kode pemeriksaan yang dapat diulang, tanpa output eksekusi fiktif.

## Kesimpulan

Cukup untuk eksplorasi akademik dengan pembatasan, tetapi belum layak disebut dataset/pipeline tervalidasi menyeluruh. Prioritas tertinggi adalah integritas mapping PPH di Papua, kemudian provenance dan reproduksibilitas. Menambah variabel bukan kebutuhan utama saat ini.

## Temuan

1. **Prioritas 1 — PPH Papua salah identitas atau belum terselesaikan.** Pada 2024 dan 2025 masing-masing 29 baris mempunyai nama sumber yang menunjuk wilayah berbeda dari nama canonical. Contoh 2025: kode 9404, sumber Kota Jayapura, canonical Mimika, PPH 80.2; kode 9120, sumber Kabupaten Puncak, canonical Mamberamo Raya, PPH 42.1. Seluruh 29 nilai 2025 terbawa ke master. V2 hanya menahan kode 9171 sehingga 28 nilai berkonflik masih tampil. Match `exact_code/high` gagal menangkap konflik semantik. Ini bukan sekadar spasi atau ejaan. Sumber asli/crosswalk perlu digunakan untuk menentukan pemilik nilai; jangan memperbaiki dengan menebak nama/kode. Sebelum digunakan untuk kesimpulan PPH, karantina record yang belum terselesaikan dan hitung ulang asosiasi/peringkat terkait.
2. **Prioritas 1 — Source PoU belum unik.** File 01 mempunyai 512 baris dan sembilan code-year keys berulang (Riau/Jambi). Contoh Kepulauan Meranti memiliki nilai sama pada label provinsi Riau dan Jambi. Master 514 baris tidak duplikat dan 11 Jambi sudah dibiarkan null; tetapi aturan deduplikasi, karantina, dan lineage harus menjadi bagian pipeline, bukan asumsi pemakai CSV cleaned.
3. **Prioritas 2 — Provenance belum lengkap dalam workspace yang diaudit.** Source registry, crosswalk resmi versi tertentu, raw download/release metadata, checksum dan kamus data tidak ditemukan di folder proyek/data yang diperiksa. Dokumen lama menunjuk path metadata/data/analysis yang tidak ada pada layout saat ini. Tidak berarti berkas itu tidak ada di tempat lain. Perlu registry per indikator berisi URL/file asal, penerbit, tanggal unduh, tahun referensi, tanggal rilis, unit, definisi, versi geografi, transformasi, dan keterbatasan.
4. **Prioritas 2 — Rebuild bergantung pada mesin dan output lama.** build-v2-data.py memakai drive A absolut dan mengambil nama dari districts_2025.json lama. Builder lama mencari ../data/clean, ../metadata, ../data/analysis yang tidak tersedia pada layout saat ini. Belum ada satu pipeline portable dari raw ke master ke JSON. V2 melakukan beberapa assert, tetapi belum quality gate semantik yang menghentikan konflik nama/kode.
5. **Prioritas 2 — Metadata tahun dan status kualitas terlalu kasar.** Builder mengisi fallback tahun 2025 saat metadata tidak ada. qualityNotes terbatas pada pengecualian hard-coded, belum status per observasi (valid/missing/conflict/provisional) serta alasan dan sumbernya. Tahun rilis, referensi pengukuran dan versi geografi perlu dibedakan. Jumlah data lengkap tidak sama dengan jumlah data yang dapat dipercaya.
6. **Prioritas 2 — Histori belum harmonis penuh.** PPH/energi/protein memiliki 514 baris per tahun 2021–2025, tetapi mapping Papua dan confidence medium historis perlu ditinjau. PoU historis file 02 hanya placeholder; IKP yang tersedia hanya 2025. Panel longitudinal belum siap hanya dengan concat semua file.
7. **Prioritas 3 — Inventaris bercampur.** File 02/09/10 adalah placeholder; file 13 memuat 12 baris tahun 2027–2038 yang belum jelas apakah salah parsing/proyeksi/masalah sumber. File tersebut tidak dipakai pada v2, tetapi perlu status/quarantine agar tidak disangka actuals siap pakai. Dataset kabupaten tahunan, provinsi, negara/rata-rata tiga tahunan, dan kegiatan pengiriman tidak boleh digabung tanpa grain contract.
8. **Prioritas 3 — QA geospasial terbatas.** Join 514/514 menguji kecocokan kode, bukan kebenaran label, boundary vintage, validitas geometri atau preservasi topologi setelah simplifikasi. Perlu pencatatan versi crosswalk dan geometri, terutama wilayah pemekaran.

## Pemeriksaan yang tidak menunjukkan masalah

- Master: 514 kode unik, 38 provinsi.
- PoU/populasi/headcount: 503 tersedia; 11 Jambi kosong.
- Urutan IKP sesuai peringkat sumber pada seluruh 514 baris.
- PPH/energi/protein tidak memiliki nilai kosong pada file cleaned; PPH berada pada 0–100. Ini tidak mengatasi konflik identitas.
- Perbedaan reported headcount dengan PoU × populasi masih berada dalam toleransi hipotesis pembulatan PoU ke 0,01 poin persentase (+1 orang). Tidak dijadikan bug angka; metode penerbit belum diverifikasi ulang.

## Urutan pekerjaan yang disarankan

1. Kembalikan provenance dan selesaikan/karantina 29 mapping PPH Papua 2025 serta tahun terkait.
2. Definisikan raw/staging/curated/serving dan kontrak dim_region + fact_indicator pada grain kode-tahun-indikator, dengan per-field source dan quality status.
3. Buat registry dan log keputusan deduplikasi; simpan sumber asli serta checksum.
4. Satukan pipeline portable dengan input konfigurasi; hentikan build ketika identitas/grain/coverage/tipe melanggar kontrak.
5. Jalankan ulang QA, lalu regenerasi JSON/chart statistik. Sesudah itu baru perluasan histori atau indikator bila ada pertanyaan yang memerlukannya.

CSV pph_papua_identity_conflicts.csv memuat kandidat perbedaan nama semua tahun; 2021–2023 masing-masing satu kandidat adalah ejaan Biak Namfor vs Biak Numfor, bukan bukti perpindahan nilai. Fokus konflik lintas wilayah adalah 29 baris tahun 2024 dan 29 baris tahun 2025.
