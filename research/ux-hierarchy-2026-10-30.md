# Hierarki informasi dan audit portfolio

30 Oktober 2026. Lingkup: halaman profesional EN/ID pada preview lokal. Identitas visual, sembilan bagian, artwork, serta dunia kreatif tersembunyi dipertahankan.

## Dasar riset

| Prinsip | Implikasi untuk portfolio | Sumber |
| --- | --- | --- |
| Kedekatan membantu pembaca mengelompokkan informasi. | Judul kelompok didekatkan ke isinya; jarak antarkelompok lebih besar. | [NN/g: Proximity](https://www.nngroup.com/articles/gestalt-proximity/) |
| Pengunjung dapat memindai heading sebelum memilih isi yang akan dibaca. | Heading perlu menjelaskan isi dan mudah dibedakan dari paragraf. | [NN/g: Layer-cake scanning](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) |
| Area bersama memberi sinyal hubungan, tetapi terlalu banyak kotak menambah keramaian. | Pertahankan area preview proyek; gunakan whitespace untuk subkelompok lain. | [NN/g: Common region](https://www.nngroup.com/articles/common-region/) |
| Tingkat heading menyatakan struktur bagian dan subbagian. | H1 untuk perkenalan, H2 untuk bagian, H3 untuk kelompok di dalamnya. | [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) |
| Jenis daftar menyatakan jenis hubungan. | UL untuk teknologi/profil, OL untuk proses berurutan, DL untuk label–nilai. | [W3C WAI: Content structure](https://www.w3.org/WAI/tutorials/page-structure/content/), [GOV.UK: Lists](https://design-system.service.gov.uk/styles/lists/) |
| Gaya heading dan skala ukuran perlu konsisten; lead dan teks kecil memiliki tugas berbeda. | Gunakan token berdasarkan peran, bukan ukuran khusus untuk setiap komponen. | [GOV.UK: Headings](https://design-system.service.gov.uk/styles/headings/), [Type scale](https://design-system.service.gov.uk/styles/type-scale/), [Paragraphs](https://design-system.service.gov.uk/styles/paragraphs/) |

Ini panduan persepsi dan usability, bukan aturan bahwa setiap pengguna selalu membaca dengan urutan yang identik. Rekomendasi berikut merupakan penerapan pada portfolio ini; rasio spacing atau ukuran font yang dipilih bukan angka universal dari riset. Hierarki HTML dan gaya visual saling mendukung, tetapi tag heading tidak sendirian menentukan besar huruf.

## Audit sebelum perubahan

Audit menggunakan kode, computed styles dan screenshot 10 keadaan di 390×844 serta 1440×900. Bukti lokal: `.taste-skill/hierarchy-before/`.

| Temuan | Risiko interpretasi | Perbaikan |
| --- | --- | --- |
| H2 Proyek pilihan 56px, sedangkan H2 lain sekitar 84px pada desktop. Banyak ukuran khusus tersebar. | Bagian yang setingkat dapat tampak memiliki kedudukan berbeda tanpa alasan yang jelas. | Satu token judul bagian; token terpisah untuk judul item, subjudul, isi, lead dan metadata. |
| Paragraf tentang tiga produk langsung disusul label Produk/Teknis/Pemasaran. | Contoh produk dan lingkup tanggung jawab dapat terbaca sebagai satu daftar yang sama. | Contoh produk mengikuti ringkasan diri; DL tanggung jawab diberi heading tersendiri. |
| Daftar teknologi berupa teks bertitik tanpa judul. ORCA mencampur TypeScript dengan Documents, Boards dan Calendar. | Teknologi dan fitur produk tampak setara; daftar dapat dianggap milik kelompok sebelumnya. | Kelompok Teknologi berjudul H3 dan UL. Fitur ORCA tetap dijelaskan dalam deskripsi; daftar teknologi hanya memuat TypeScript yang sudah tercatat. |
| Hubungan tombol pilihan dan panel preview tersirat melalui posisi/warna. | Hubungan kontrol–konten kurang eksplisit bagi teknologi bantu. | Tombol mengacu ke artikel preview melalui aria-controls; artikel dinamai oleh judul proyek. |
| Proses memakai OL, tetapi penanda urutannya dihapus oleh reset CSS. | Tiga tahap tampak seperti paragraf setara tanpa urutan. | Penanda desimal native pada tiga langkah yang memang berurutan. |
| Catatan kontak tampil besar/bold di samping GitHub dan LinkedIn. | Kalimat pendamping dapat terbaca sebagai heading atau pesaing ajakan email. | Kelompok Profil profesional berjudul H3; tautan profil menjadi UL. Tombol dan alamat email dikelompokkan bersama. |
| Beberapa metadata proyek 13–15px; tracking heading sangat rapat. | Informasi pendukung lebih sulit dibaca, khususnya pada ponsel. | Metadata profesional minimal 16px, tracking sesuai peran, dan paragraf dengan leading 1.6. |
| Tulisan pada screenshot latar proyek bertumpuk secara visual dengan judul bagian. | Ada dua lapisan teks yang bersaing untuk dibaca. | Opacity latar dikurangi dari 12% menjadi 4,5%; preview tetap mengikuti proyek terpilih. |

## Model yang diterapkan

Contoh detail proyek: **Ocaty (H2)** → **Peran saya / Gambaran teknis / Teknologi (H3)** → paragraf, daftar atau tautan milik kelompok tersebut. Ketiga H3 adalah peer; semuanya berada di bawah proyek yang sama.

Nama proyek pada overview berperan sebagai judul artikel preview (H3). Nama yang sama pada bagian detail menjadi judul bagian (H2). Perannya berbeda karena konteks parent-nya berbeda.

Skala mempertahankan Bricolage untuk display/headings dan Manrope untuk isi. Judul bagian memakai skala lama yang dominan secara konsisten, judul item 24–32px, subjudul 20–24px, isi 16–18px, metadata 16px. Jarak dalam kelompok 12px; antarkelompok 28–32px, atau 24px pada desktop yang pendek. Label–nilai dalam DL berjarak 4px. Semua ukuran/spacing ini keputusan implementasi untuk konten yang tersedia.

Pengujian mencakup EN/ID, beberapa lebar layar, pembesaran teks, struktur heading/list, relasi kontrol–preview, kontras, keterbacaan bagian panjang, pilihan proyek, serta regresi penguncian scroll Oxelot. Audit ini belum merupakan pengujian pemahaman dengan calon klien atau eye tracking langsung. Temuan persepsi merupakan evaluasi heuristik; hasil browser membuktikan perilaku dan geometri yang diuji.

## Hasil verifikasi

- Build dan pemeriksaan tipe: nol error, warning atau hint; 13 tes unit dan 102 pemeriksaan output statis lolos.
- Hierarki: 101/101 pemeriksaan browser lolos pada EN/ID di lebar 320, 390, 768 dan 1440px, termasuk pembesaran teks 200%, tanpa konten terpotong atau overflow horizontal.
- Regresi scroll: 66/66 lolos; bagian panjang dibaca dahulu sebelum berpindah. Pilihan proyek: 31/31 lolos saat bernavigasi, kembali dan memuat ulang.
- Source lint serta detector type/layout tidak menemukan masalah. Inspector render pada tiga viewport tidak mendeteksi kontras rendah, overflow horizontal atau error browser. Pengecualian yang sudah ada mempertahankan palet, skala fluid dan batas fase gambar/video; detektor animasinya tidak mewakili canvas dan nested scroller.
- Sepuluh screenshot bagian dan enam gambar inspector ditinjau. Screenshot bagian diperlukan karena inspector umum hanya menangkap viewport awal pada nested scroller ini.

Perubahan diterapkan pada preview lokal; belum di-commit, push atau dipublikasikan. Rincian QA tersedia dalam `QA-PHASE-1.md`.
