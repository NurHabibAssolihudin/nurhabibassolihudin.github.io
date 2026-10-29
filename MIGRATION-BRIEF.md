# Brief perubahan portfolio

Diperbarui 29 Oktober 2026. Status: fase 1 telah diimplementasikan pada preview lokal; visual fase 2 dan Chrimson Violet fase 3 belum dikerjakan. Snapshot pembanding adalah `main` pada commit `7577aa0`.

Brief ini menjadi acuan terbaru bila bertentangan dengan rencana awal scene bertumpuk dan animasi berdasarkan progres scroll. Dokumen `DESIGN.md` menjelaskan implementasi fase 1 dan baseline artwork yang dipertahankan.

## Fokus tahap sekarang

**Fokus aktif adalah halaman profesional.** Struktur, konten, navigasi dan animasinya harus membantu calon klien atau penilai memahami kecocokan, memeriksa bukti pekerjaan dan memulai percakapan. Gunakan hasil riset portfolio untuk fungsi tersebut. Tampilan profesional tetap memiliki identitas visual yang khas dan ambisius.

**Dunia game ditunda dan arah namanya adalah Chrimson Violet**, dengan ejaan tersebut sesuai pilihan pemilik. Arah kreatif yang sudah dibahas tetap disimpan: pengalaman sangat ekspresif, penuh imajinasi, ambisi visual dan interaksi yang membuat pengunjung merasakan sesuatu. Standar penyajian untuk hiring atau calon klien pada halaman profesional tidak diterapkan sebagai batas kreativitas Chrimson Violet.

Bagian brief tentang karakter game, mothership dan kontak teatrikal merupakan catatan untuk fase berikutnya, bukan pekerjaan aktif sekarang. Belum melakukan pengembangan ulang, penataan konten atau penggantian nama di tampilan dunia game. Nama alimagine, tautan dan identitas yang ada pada versi berjalan tetap dicatat sebagai kondisi saat ini; rencana nama dunia tidak otomatis mengganti identitas studio atau tujuan kontaknya. Perpindahan dua dunia yang sudah berfungsi tetap dipertahankan ketika fondasi bersama kelak disentuh.

## Pembagian tiga fase

Urutan terbaru dari pemilik adalah:

| Fase | Fokus | Batas utama |
| --- | --- | --- |
| 1 | Memperbaiki dan membagi bagian profesional, fungsi konten, card/list proyek, detail/kontribusi dan mekanisme scroll berpindah bagian | Gunakan aset yang sudah ada atau background netral. Tidak menunggu/menambah gambar baru dan tidak mengembangkan ulang dunia game. Fondasi framework yang diperlukan dikerjakan di sini. |
| 2 | Menambahkan gambar dan suasana visual profesional | Foto tokoh inspirasi, preview baru bila tersedia dan visual kontak dua kursi/meja teh; uji kembali keterbacaan dan performa. |
| 3 | Perubahan total Chrimson Violet | Identitas, struktur, artwork, karakter, interaksi, kontak teatrikal dan integrasi penuh dunia kreatif. |

Lihat [MIGRATION-PHASES.md](MIGRATION-PHASES.md) untuk pekerjaan dan syarat selesai tiap fase. Arah visual di bagian berikut menjadi target fase yang sesuai; keberadaan sebuah konsep di brief tidak berarti harus dikerjakan pada fase 1. Gambar yang sudah tersedia boleh dipakai kembali pada fase 1. Fase 1 menggunakan Astro + React + TypeScript + Motion, sembilan bagian profesional, scroll snap native untuk sentuhan dan pengelolaan gesture roda mouse; lihat `QA-PHASE-1.md` untuk hasil verifikasi. Fase 2 dan 3 tetap dalam rencana.

## Struktur profesional yang ditetapkan pemilik

Urutan berikut menggantikan usulan struktur lima bagian dalam laporan riset sebagai acuan rancangan. Ini enam fungsi utama, bukan batas jumlah layar: setiap bagian muat satu viewport, dan fungsi yang memerlukan lebih banyak ruang dipecah menjadi bagian/layar lanjutan. Seluruhnya tetap berada dalam satu pengalaman halaman profesional yang dapat dinavigasi langsung.

| Urutan | Bagian | Fungsi | Isi dan aksi utama |
| --- | --- | --- | --- |
| 1 | Head / Landing | Sapaan, first impression, momen wow dan sekilas siapa Nur | Identitas singkat yang mudah dipahami, komposisi/objek khas, akses melanjutkan atau langsung ke pekerjaan/kontak |
| 2 | Ringkasan | Memberikan gambaran profesional yang lebih jelas setelah kesan pertama | Fokus pekerjaan, bentuk kontribusi dan konteks singkat yang terverifikasi; menjadi jembatan ke bukti pekerjaan |
| 3 | Pekerjaan Terpilih — ringkasan | Membantu pengunjung memilih pekerjaan yang ingin diperiksa | Card/list proyek, preview background saat dipilih, deskripsi singkat dan tautan ke detail proyek terkait |
| 4 | Detail per pekerjaan terpilih + kontribusi | Menjelaskan pekerjaan dan peran Nur secara konkret | Konteks masalah, kontribusi sendiri/tim, keputusan penting, bukti, hasil/status dan batas; satu atau lebih bagian untuk tiap proyek |
| 5 | Pengalaman dan cara bekerja | Membantu pengunjung menilai latar belakang dan pola kerja | Pengalaman yang relevan dan contoh cara mengambil keputusan/berkolaborasi dari pekerjaan nyata; CV dapat diakses bila tersedia |
| 6 | Kontak | Menutup pengalaman dengan undangan berbincang di ruang yang sejuk dan santai | Dua tempat duduk santai atau komposisi meja teh, dengan jalur komunikasi langsung yang jelas |

Landing memberi perkenalan dan daya tarik awal; Ringkasan memberi konteks. Keduanya tidak mengulang paragraf yang sama. Ringkasan pekerjaan menyediakan pilihan; bagian detail memberikan penjelasan dan kontribusi. Pengalaman/cara bekerja menghubungkan pola yang terlihat di beberapa proyek tanpa mengulang seluruh cerita proyek.

### Ringkasan pekerjaan sebagai pintu ke detail

Sediakan satu bagian yang berfungsi sebagai indeks pekerjaan terpilih. Bentuk card atau list dipilih melalui prototipe berdasarkan keterbacaan; bila tidak muat dalam satu viewport, pilihan dapat disusun menyamping dengan navigasi yang jelas. Jumlah pekerjaan mengikuti kualitas bukti yang tersedia dan belum dikunci.

Alur interaksi yang diinginkan:

1. Pengunjung memilih sebuah card/item proyek.
2. Background bagian berubah menjadi preview halaman proyek tersebut bila ada. Judul, deskripsi singkat dan pilihan aksi selalu berada pada area baca yang jelas.
3. Aksi **Lihat detail** membawa langsung ke bagian detail proyek yang dipilih di halaman profesional. Pemilihan preview saja tidak memindahkan bagian atau membuka situs lain.
4. Pada detail, sediakan kembali ke ringkasan pekerjaan; pilihan card/preview sebelumnya dipertahankan. Link demo/source yang memang tersedia merupakan aksi terpisah dan diberi nama yang jelas.

Preview menggunakan screenshot/visual halaman proyek yang benar-benar tersedia. Jika tidak ada halaman atau preview, tampilkan artefak proyek yang relevan atau background netral yang dirancang; jangan membuat antarmuka fiktif seolah produk sudah memilikinya. Pada ringkasan ini preview adalah konteks visual background, sehingga tidak mengubah gambar proyek menjadi panel besar yang mengalahkan informasi.

Jika daftar disusun horizontal, kontrol sebelumnya/berikutnya dan indikator pilihan harus mudah ditemukan; sentuhan serta keyboard tetap bisa memilih. Gesture horizontal hanya berlaku di area daftar, sedangkan navigasi vertikal tetap untuk bagian utama. Hindari gerak diagonal atau satu input yang sekaligus mengganti card dan bagian. Pada viewport sempit, tampilkan jumlah card yang lebih sedikit per tampilan agar deskripsi/aksi tetap muat.

Deskripsi dan aksi mengikuti card yang dipilih dengan satu sumber state. Pemilihan dapat dilakukan lewat klik/tap dan keyboard; tidak menggantungkan informasi pada hover saja. Preview dekoratif tidak menerima focus atau menutupi kontrol. Hanya aset yang diperlukan bagian aktif/terdekat yang dimuat terlebih dahulu.

### Bagian detail dan jalur lompat

Setiap pekerjaan terpilih mempunyai tujuan navigasi yang dapat ditautkan dan dibagikan. Pengunjung dapat langsung menuju detail tertentu dari indeks, navigasi atau URL, tanpa wajib melewati detail proyek lain. Kembali, Back/Forward dan pergantian bahasa harus mempertahankan konteks yang sesuai.

Bila detail satu proyek tidak muat satu viewport, pecah berdasarkan fokus informasi, misalnya konteks dan hasil, kontribusi dan keputusan, lalu bukti. Pembagian akhir mengikuti bahan nyata, bukan memaksa semua proyek mempunyai jumlah layar atau template cerita identik. Kelompok subbagian tetap jelas sebagai satu proyek. Pada kondisi normal, jangan menyelesaikan masalah ruang dengan tulisan sangat kecil atau scroll tersembunyi di dalam setiap layar.

Pengalaman dan cara bekerja juga dapat dipecah menjadi bagian berurutan bila perlu. Navigasi menunjukkan kelompok bagian secara ringkas sehingga jumlah layar yang bertambah tidak berubah menjadi daftar panjang yang membingungkan. Kontak tetap bisa diakses langsung dari navigasi, meskipun secara urutan berada terakhir.

## Karakter yang ingin dicapai

Situs harus terasa khas karena gagasan, kreativitas, ambisi dan kecerdasan penyajiannya. Perbedaan visual perlu memiliki alasan dan kualitas eksekusi. Pengunjung mendapat pengalaman yang mengejutkan sekaligus mudah memahami pekerjaan dan identitas pemiliknya.

Bangun satu bahasa visual dan gerak yang menghubungkan objek, tipografi, background, konten dan navigasi. Dua dunia memiliki perilaku yang berbeda: keteraturan dan hubungan sistem pada profesional; imajinasi dan pembengkokan aturan ruang pada Chrimson Violet. Ini arah eksplorasi, bukan alasan menambahkan gerakan acak. Pengembangan tahap sekarang mengerjakan sisi profesional; eksplorasi Chrimson Violet dilanjutkan terpisah.

Motion/GSAP digunakan sebagai alat untuk mengerjakan koreografi khusus. React Bits dapat menjadi referensi teknik atau bahan komponen yang diolah. Pemilihan efek mengikuti konsep situs; katalog komponen tidak menentukan identitasnya. Planet, kapal dan perpindahan dunia tetap menjadi karya yang dikembangkan khusus untuk situs ini.

Ukuran penilaian: pengalaman masih dapat dikenali ketika nama/logo ditutup; interaksi membantu memahami informasi; dan kualitasnya tetap terasa setelah kejutan pertama berlalu. Beberapa momen kuat diberi ruang dalam komposisi.

## 1. Navigasi per layar

Rancangan navigasi berikut menjadi acuan prototipe halaman profesional. Penerapan rinci pada Chrimson Violet diputuskan ketika fase kreatifnya dimulai; dunia game yang berjalan tidak diubah pada tahap ini.

Setiap bagian utama dirancang muat dalam satu layar. Satu layar mempunyai fokus informasi, judul dan titik perhatian yang jelas. Navigasi memakai perilaku gesture yang familiar dan teruji sesuai perangkat. Tombol berikutnya/bawah dapat menuju bagian secara langsung. Setelah gesture selesai, pengalaman menetap tuntas pada bagian yang dipilih dan berhenti dengan pandangan terfokus pada informasi tersebut. Arah sebaliknya tersedia untuk kembali.

Selama sentuhan/tarikan aktif, gerak mengikuti kendali pengunjung; tidak ada timer yang memindahkan bagian sendiri. Setelah dilepas, momentum dan penyelesaian mengikuti model gesture yang dipilih. Keadaan istirahat menampilkan satu bagian secara utuh; informasi utama tidak dibiarkan separuh terlihat di antara dua bagian. Posisi parsial selama interaksi berlangsung merupakan respons terhadap input, bukan keadaan baca akhir.

### Gesture familiar, bukan ambang jarak yang dikunci

Koreksi dari pemilik: aturan sepertiga sebelumnya adalah perkiraan tentang cara kerja website sejenis, bukan persyaratan yang wajib ditiru. Pilih perilaku yang terbukti nyaman dari mekanisme browser/library yang sesuai, lalu nilai dengan prototipe pada mouse, trackpad dan layar sentuh. Tidak ada satu ambang jarak universal untuk semua perangkat.

Prioritas prototipe adalah scroll native dengan CSS Scroll Snap agar scroll, momentum, keyboard dan scrollbar tetap terasa familiar. Nilai `scroll-snap-stop` sesuai kebutuhan navigasi satu bagian; uji perilakunya, jangan menganggapnya jaminan pengelompokan semua gesture wheel/trackpad. Jika koreografi khusus membutuhkan custom drag, gunakan primitive gesture Motion dengan penilaian arah, jarak dan kecepatan serta penyelesaian terkontrol. Satu controller saja yang memiliki navigasi; native scroll dan custom drag tidak saling melawan pada permukaan yang sama.

| Keadaan | Hasil |
| --- | --- |
| Tap, senggolan atau gerak kecil tanpa niat scroll yang jelas | Tidak memicu perpindahan bagian |
| Sentuhan/tarikan masih aktif | Gerak tetap dalam kendali pengunjung; tidak dipindahkan oleh timer |
| Tarikan pelan yang belum cukup menunjukkan niat berpindah | Menetap kembali dengan wajar pada bagian semula |
| Swipe/flick yang jelas disengaja | Dapat berpindah berdasarkan arah, jarak dan kecepatan; tidak wajib menempuh proporsi layar tertentu |
| Momentum wheel/trackpad | Tidak menumpuk perpindahan tak terkendali atau diproses ulang sebagai rentetan perintah navigasi |
| Input dibatalkan atau arah diubah | Menetap secara konsisten tanpa transisi macet atau perpindahan tambahan dari input yang sudah dibatalkan |

Senggolan kecil dan swipe cepat yang disengaja tidak disamakan hanya karena jaraknya pendek. Untuk wheel/trackpad, gunakan perilaku scroll native terlebih dahulu; custom handling hanya bila dibutuhkan dan setelah diuji terhadap momentum serta akhir gesture. Sensitivitas dan fisika adalah keputusan implementasi yang divalidasi melalui penggunaan nyata, bukan angka tetap dalam brief.

Tombol navigasi dan keyboard yang memang meminta bagian tujuan merupakan perintah eksplisit. Indeks bagian, hash, focus dan state dunia diperbarui secara konsisten dengan bagian yang aktif, bukan setiap piksel preview tarikan.

Acuan teknis: [mekanisme CSS Scroll Snap](https://www.w3.org/TR/css-scroll-snap-1/#snap-selection) membiarkan browser memilih model snapping berdasarkan interaksi pengguna; [Motion drag](https://motion.dev/docs/react-drag) menyediakan offset, kecepatan dan momentum untuk custom drag. Referensi ini bukan bukti bahwa satu konfigurasi default pasti cocok untuk semua perangkat.

Konsekuensi bagi desain dan interaksi:

- Navigasi section menggantikan scene panjang yang dipin, kartu bertumpuk dan reveal konten yang bergantung pada persentase scroll. Gerak atmosfer dapat berjalan setelah layar menetap selama tidak mengganggu pembacaan.
- Satu gesture menghasilkan satu perpindahan. Sisa momentum trackpad/wheel tidak melompati beberapa bagian. Input selama perpindahan tidak menumpuk antrean transisi; gesture baru setelah transisi selesai dapat memicu langkah berikutnya.
- Gesture mengikuti prinsip kenyamanan dan kendali di atas, lalu diuji dengan mouse, trackpad dan sentuhan. Gerakan kecil yang tidak disengaja tidak memicu perpindahan, sedangkan swipe yang disengaja tetap responsif.
- Tombol berikutnya/sebelumnya, navigasi langsung ke bagian, keyboard dan swipe memiliki tujuan layar yang sama. Tombol panah/Page Up/Page Down tidak mengambil alih input saat pengunjung sedang memakai field, dialog atau kontrol yang memerlukan tombol tersebut.
- Posisi dan jumlah bagian dapat dipahami melalui navigasi yang ringkas. Perubahan layar utama mengikuti anchor/riwayat browser agar deep link, reload dan Back/Forward tetap berguna.
- Perpindahan bagian dalam satu dunia dibedakan dari perpindahan seluruh dunia melalui objek utama. Keduanya memakai bahasa visual yang berhubungan, dengan controller yang mencegah transisi saling bertabrakan.

Layout memperhitungkan tinggi header, safe area dan perubahan toolbar browser mobile. Konten harus ditata atau dipecah menjadi layar tambahan jika tidak muat; teks tidak diperkecil berlebihan dan informasi tidak dipotong untuk mengejar ukuran satu layar. Proyek dapat dibagi per layar; detail teknis dan gambar besar dapat dibuka melalui interaksi terpisah yang jelas. Footer dapat menjadi bagian layar kontak.

Saat detail/dialog terbuka, scroll dan gesture di dalamnya menjadi milik detail tersebut. Saat zoom atau viewport sangat pendek membuat satu layar tidak memadai, sediakan alur baca yang tetap lengkap. Reduced motion mempertahankan pemilihan bagian dengan perpindahan instan. Tanpa JavaScript, konten tetap tersedia dalam alur dokumen yang dapat dibaca.

## 2. Tokoh dan karakter inspirasi sebagai background

Tambahkan foto/gambar tokoh dan karakter yang memang dipilih pemilik situs sebagai bagian dari background. Mereka terintegrasi dengan ruang dan atmosfer situs, bukan menjadi section tokoh, galeri, deretan kartu atau daftar logo tersendiri.

| Dunia | Isi | Arah komposisi |
| --- | --- | --- |
| Profesional | Beberapa tokoh yang dikenal baik oleh pemilik situs dan menjadi inspirasinya | Selektif, terkurasi, ruang antarfigur cukup; hubungan dengan pekerjaan dan karakter profesional terasa jelas |
| Chrimson Violet — fase berikutnya | Lebih banyak karakter unik, termasuk dari game yang disukai dan referensi game lainnya | Lebih beragam, ekspresif dan berlapis; karakter dapat tersebar di beberapa layar agar tidak semuanya memenuhi satu viewport |

Tokoh/karakter tetap dapat dikenali. Arah pengolahan gambar dapat berupa cutout, cropping, lapisan kedalaman atau kolase yang menyatu dengan warna dan material dunia. Besaran, penempatan dan ritmenya dikomposisikan khusus; tidak semua gambar diberi perlakuan identik.

Teks, proyek dan objek utama memiliki area baca yang terjaga. Wajah/siluet tidak ditempatkan di belakang tulisan sehingga keduanya sulit terbaca. Setiap layar memilih fokusnya sendiri. Karakter dapat ikut masuk/keluar bersama perpindahan layar, lalu menetap; semua lapisan tidak wajib bergerak terus-menerus.

Pada mobile, susunan dan jumlah figur per layar dapat dikurangi atau diganti crop-nya agar identitas dan isi tetap jelas. Aset dimuat mengikuti kebutuhan layar aktif/terdekat. Gambar dekoratif tidak menambah hambatan keyboard atau pembacaan screen reader. Catat nama, sumber gambar dan kredit yang diperlukan dalam inventaris aset.

Daftar tokoh profesional, karakter game dan gambar pilihannya **belum diberikan**. Nama, game favorit, kutipan maupun hubungan personal dengan tokoh tidak boleh diasumsikan. Seleksi berasal dari pemilik situs. Brief ini belum memasukkan aset pengganti.

## 3. Kontak dengan dua karakter pengalaman

Kontak juga mengikuti aturan satu bagian per layar, dengan suasana yang berbeda di kedua dunia. Bagian ini menjadi penutup pengalaman yang dirancang, dengan tujuan berkomunikasi tetap jelas.

### Profesional: santai dan memberi ruang

Saat mencapai kontak profesional, pengunjung tiba di **tempat yang sejuk dengan dua tempat duduk santai atau meja teh**. Ini sebuah ruang untuk berhenti dan berbincang. Komposisi dapat memakai sepasang kursi dan meja teh kecil sebagai satu interpretasi; bentuk tempat dan aset final dinilai melalui prototipe, belum ditetapkan dari gambar yang belum tersedia.

Tempo visual mereda, komposisi memberi ruang bernapas dan gerak lingkungan terasa tenang. Tulisan wajar, ramah dan mudah dipahami. Pilihan email/kanal kontak langsung terbaca dan dapat digunakan, terintegrasi dengan undangan berbincang di ruang tersebut. Pengunjung tidak perlu menebak benda mana yang dapat diklik untuk menemukan kontak. Layar ini menjadi tempat berhenti yang nyaman setelah melihat pekerjaan.

### Chrimson Violet: adegan yang menimbulkan sensasi — ditunda

Kontak dunia game sangat kreatif dan terasa sebagai sebuah kejadian dalam dunianya. Ia memberi sensasi seperti tegang, penasaran, terkejut atau geli, lalu mengubah sensasi itu menjadi ajakan berinteraksi. Pengunjung mempunyai peran dan mendapat respons visual saat memilih atau bertindak; pengalaman tidak berhenti pada sebuah tombol kirim pesan.

Contoh arah dari pemilik: **seolah ditodong pistol**. Ini dapat dikembangkan sebagai adegan teatrikal dengan karakter mengarahkan senjata ke kamera, menghadang kedatangan pengunjung, lalu membuka percakapan melalui pilihan dialog. Adegan mengikuti identitas mothership dan karakter yang akhirnya dipilih. Pistol merupakan contoh ambisi dan sensasi, bukan aset atau konsep final yang sudah dikunci; gagasan lain yang sama kuatnya tetap dapat dieksplorasi.

Pilihan dialog/aksi mengantar ke saluran kontak yang nyata dan mudah dimengerti. Pengunjung tetap dapat langsung mengakses kontak atau keluar dari adegan; interaksi kreatif tidak mewajibkan penyelesaian permainan untuk berkomunikasi. Keyboard, sentuhan dan reduced motion mendapat alur yang lengkap dengan sensasi visual disesuaikan. Bentuk karakter, respons, naskah dan koreografi adegan perlu dinilai melalui prototipe.

## Yang tetap dipertahankan

- Dua pengalaman penuh dengan identitas masing-masing. Profesional menjadi fokus aktif; dunia game yang berjalan dipertahankan, dengan Chrimson Violet sebagai arah nama dan pengembangan kreatif berikutnya.
- EN/ID, pilihan bahasa yang diingat dan deteksi bahasa browser tanpa layanan lokasi/IP.
- Copy yang faktual dan tidak mengulang klaim pencapaian; gambar proyek berukuran ringkas.
- Planet biru dengan empat satelit dan mothership dengan empat tengkorak api menjadi pembanding identitas objek. Koreografi dan transisinya boleh dikembangkan sesuai brief baru.
- Akses keyboard, reduced motion, fallback konten dan pengendalian biaya rendering tetap menjadi bagian implementasi.

## Implikasi untuk migrasi

Arah stack yang disarankan setelah diskusi terbaru adalah Astro + React + TypeScript, dengan Motion sebagai alat animasi utama. GSAP digunakan hanya bila koreografi khusus membutuhkan kendali tambahan; dua mesin animasi tidak menulis properti yang sama pada elemen yang sama. ScrollTrigger tidak lagi menjadi kebutuhan default karena navigasi utama kini diskret per layar. React Bits dipilih dan diolah berdasarkan konsep khusus situs.

Urutan kerja mengikuti tiga fase: (1) fondasi yang diperlukan, peta enam fungsi bagian, perbaikan konten/layout serta navigasi dan jalur proyek dengan aset lama; (2) penambahan gambar profesional dan suasana kontak, diikuti pemeriksaan visual/performa; (3) perubahan total Chrimson Violet. Verifikasi fungsi dilakukan sejak fase 1. Aset gambar baru tidak menjadi prasyarat fase 1; scene kontak kursi/meja teh diwujudkan secara visual pada fase 2.

Pada fase 1 nilai prototipe perpindahan layar, hierarki informasi, bukti pekerjaan dan jalur kontak menggunakan aset yang sudah ada. Perlakuan foto dan scene kontak dinilai pada fase 2. Kriteria penerimaan di bawah berlaku sesuai lingkup fase; kriteria karakter, penamaan dan kontak game diselesaikan pada fase 3, bukan syarat penyelesaian fase profesional.

## Kriteria penerimaan

1. Navigasi terasa familiar pada mouse, trackpad dan sentuhan. Tarikan tetap dapat dikendalikan; setelah input berakhir, bagian menetap utuh tanpa mengharuskan ambang sepertiga.
2. Tap, senggolan, menahan tanpa gerak, input cancel dan momentum tidak menimbulkan perpindahan tak disengaja. Swipe cepat yang jelas disengaja tetap responsif. Dalam navigasi sekuensial, target desain adalah satu bagian per gesture dan tidak ada antrean perpindahan sisa; perilakunya diverifikasi pada perangkat nyata.
3. Layar desktop dan mobile memiliki fokus yang jelas; konten panjang, dialog dan zoom tetap dapat digunakan.
4. Perpindahan section dan dunia bekerja bersama bahasa, tema, deep link, keyboard serta reduced motion.
5. Tokoh/karakter terintegrasi dalam background sesuai pilihan pemilik; tidak ada section khusus inspirasi dan tidak ada tokoh/game favorit yang diasumsikan.
6. Teks dan proyek tetap terbaca, sementara artwork memiliki karakter yang jelas pada kedua dunia.
7. Kualitas dinilai dari komposisi dan koreografi, lalu diuji biayanya melalui profiling pada perangkat yang ditentukan. Pemakaian library saja bukan bukti peningkatan kualitas atau performa.
8. Kontak profesional terasa santai, dengan ajakan dan kanal komunikasi yang jelas. Kontak game terasa sebagai adegan kreatif yang memberi sensasi dan merespons pengunjung; contoh pistol tidak menjadi kewajiban konsep final.
9. Kontak tetap dapat digunakan langsung, melalui keyboard/sentuhan dan reduced motion, tanpa harus menyelesaikan adegan atau permainan terlebih dahulu.
10. Enam fungsi bagian profesional tersedia dalam urutan yang ditetapkan pemilik; konten yang melampaui satu viewport dipecah dengan kelompok yang jelas.
11. Memilih pekerjaan memperbarui preview background dan deskripsi; Lihat detail menuju proyek yang benar. Kembali ke ringkasan memulihkan pilihan sebelumnya. Tidak ada keharusan hover atau menelusuri semua proyek terlebih dahulu.
12. Kontak profesional menghadirkan ruang sejuk dengan dua tempat duduk santai atau meja teh, sementara kanal komunikasinya tetap langsung terlihat dan berfungsi.

## Fakta yang dikonfirmasi pemilik pada implementasi fase 1

Ocaty, ORCA dan Oxelot merupakan proyek pribadi. Nur menangani branding, planning, coding, deployment dan marketing. Pengalaman yang boleh ditampilkan: R&D Developer di PT Semesta Teknologi Informatika, lebih dari satu tahun. Tidak ada tanggal mulai/akhir, metrik, hasil komersial atau rincian pekerjaan perusahaan yang diberikan; implementasi tidak mengarangnya.

## Koreksi navigasi dari pemilik, 29 Oktober 2026

Pengalaman ini tetap website, bukan presentasi. Hapus indikator nomor bagian, jumlah bagian, dan tombol panah sebelumnya/berikutnya yang membentuk kontrol slide. Jangan mencadangkan ruang bawah untuk kontrol tersebut. Pilihan proyek tetap berupa item yang bisa diklik/digeser, tanpa bar pagination. Scroll/sentuhan, keyboard, tautan konten dan navigasi langsung tetap berfungsi. Pada mobile sisakan tombol dropdown saja: logo, bahasa, tema dan tombol pindah dunia tidak menjadi bar terpisah. Bahasa, tema dan pindah dunia tersedia di dalam dropdown. Tombol dropdown mengambang sehingga konten memakai tinggi viewport penuh.
