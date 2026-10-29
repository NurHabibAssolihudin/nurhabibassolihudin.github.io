# Tiga fase perubahan portfolio

29 Oktober 2026. Status: fase 1 diimplementasikan dan diverifikasi pada preview lokal; fase 2 dan 3 belum dimulai. Urutan ini ditetapkan pemilik dan menggantikan pembagian tahap implementasi sebelumnya. Detail pengalaman tetap mengacu pada [MIGRATION-BRIEF.md](MIGRATION-BRIEF.md).

## Fase 1 — Struktur, fungsi dan navigasi profesional

Tujuan: halaman profesional mempunyai bagian yang jelas, informasi yang berguna, serta mekanisme berpindah bagian yang nyaman. Fase ini harus bisa selesai tanpa menunggu gambar baru.

Pekerjaan:

1. Siapkan fondasi Astro + React + TypeScript dan Motion sesuai rencana migrasi, dengan output statis untuk GitHub Pages. Pekerjaan teknis ini mendukung struktur/navigasi, bukan fase tambahan tersendiri.
2. Susun enam fungsi utama: Head/Landing; Ringkasan; Pekerjaan Terpilih (ringkasan); Detail per pekerjaan + kontribusi; Pengalaman dan cara bekerja; Kontak.
3. Tata setiap bagian agar mempunyai satu fokus per viewport. Pecah proyek/detail atau pengalaman ke beberapa bagian jika tidak muat. Rapikan copy, hierarki, padding, margin dan layout responsif dengan bahasa yang mudah dipahami. Peran, hasil dan pengalaman yang belum diketahui tidak diisi dengan asumsi.
4. Terapkan perpindahan bagian dengan gesture yang familiar dan hasil yang menetap utuh. Evaluasi scroll snap native lebih dahulu; gunakan custom gesture hanya bila diperlukan. Sensitivitas bukan aturan sepertiga tetap. Tangani senggolan, swipe yang disengaja, momentum, keyboard dan reduced motion.
5. Buat indeks pekerjaan berupa card/list, dengan susunan horizontal jika membantu. Pemilihan memperbarui deskripsi dan background preview menggunakan aset yang sudah tersedia atau background netral. Aksi terpisah menuju detail proyek, dan kembali ke indeks mempertahankan pilihan.
6. Sediakan navigasi langsung, anchor/deep link, Back/Forward dan konteks bahasa. Pengunjung bisa langsung ke proyek atau kontak tanpa wajib mengikuti seluruh urutan layar.
7. Kerjakan fungsi dan layout kontak profesional yang santai, dengan kanal komunikasi jelas. Arah ruang sejuk/kursi/meja teh disiapkan dalam komposisi; pembuatan gambar atau scene baru untuk ruang tersebut masuk fase 2.
8. Pertahankan EN/ID, tema, artwork yang sudah ada dan akses ke dunia game lama. Jika runtime bersama perlu dirapikan, pastikan dunia lama tetap berfungsi; jangan mengubah desain, isi atau nama tampilannya menjadi Chrimson Violet pada fase ini.

Batas fase: tidak mencari, membuat atau menambahkan foto tokoh, ilustrasi baru, render baru, karakter game atau aset baru lainnya. Screenshot, font, planet, field dan aset yang sudah ada boleh digunakan kembali. Background netral tetap merupakan tampilan yang dirancang, bukan gambar fiktif atau klaim produk yang belum tersedia.

Selesai jika seluruh bagian dan jalur proyek dapat digunakan, informasi utama tidak terpotong, navigasi tidak melompat tak terkendali, serta keyboard, sentuhan, EN/ID, reduced motion dan fallback tetap berfungsi. Build dan preview hasil `dist/` harus dapat diperiksa. Verifikasi responsif dan alur utama dilakukan sebelum fase 2; dukungan perangkat fisik dibedakan dari hasil emulasi.

## Fase 2 — Gambar dan suasana visual profesional

Tujuan: memperkaya identitas dan atmosfer halaman profesional yang struktur serta fungsinya sudah bekerja.

Pekerjaan:

1. Pilih bersama pemilik beberapa tokoh inspirasi profesional; kumpulkan nama, gambar, sumber dan kredit yang relevan. Jangan mengasumsikan tokoh favorit.
2. Tambahkan gambar sebagai bagian background, tanpa membuat section inspirasi khusus. Atur crop, kedalaman, jumlah figur dan area baca pada desktop/mobile.
3. Lengkapi atau perbarui preview halaman proyek yang memang tersedia. Preview tetap mendukung deskripsi dan kontribusi yang sudah dibangun di fase 1.
4. Buat visual kontak berupa tempat sejuk dengan dua tempat duduk santai atau meja teh. Hubungkan suasana itu dengan ajakan berbincang dan kanal komunikasi yang sudah berfungsi.
5. Kerjakan koreografi gambar yang menyatu dengan perpindahan bagian. Optimalkan dimensi, format, pemuatan aset, biaya rendering dan fallback. Periksa kembali keterbacaan serta performa setelah aset ditambahkan.

Batas fase: masih halaman profesional. Tidak mengembangkan karakter, background atau adegan kontak baru untuk Chrimson Violet. Bentuk aset profesional ditentukan melalui prototipe; memakai Three.js atau format 3D bukan kewajiban untuk menyelesaikan gambar/suasana.

Selesai jika gambar pilihan pemilik terintegrasi, teks/proyek tetap menjadi fokus, kontak menghadirkan suasana yang diminta, serta hasil visual dan performa dapat dibandingkan dengan fase 1.

## Fase 3 — Perubahan total Chrimson Violet

Tujuan: mengembangkan ulang dunia kreatif sebagai Chrimson Violet dengan karakter yang ambisius, ekspresif dan memberi sensasi, sesuai arah yang telah dibahas.

Pekerjaan:

1. Tetapkan identitas dan penerapan nama Chrimson Violet pada dunia kreatif. Pemetaan hubungan dengan nama studio/tautan alimagine yang sudah ada diputuskan secara eksplisit, bukan diasumsikan otomatis berubah.
2. Rancang struktur pengalaman, narasi, komposisi, karakter dan interaksi khusus dunia ini. Struktur profesional tidak otomatis menjadi template dunia kreatif.
3. Kembangkan ulang artwork/objek, background karakter inspirasi dan koreografi perpindahan. Tentukan penggunaan renderer atau library tambahan berdasarkan gagasan dan pengukuran.
4. Buat kontak sebagai adegan yang melibatkan pengunjung dan memberi sensasi. Contoh ditodong pistol tetap menjadi salah satu arah eksplorasi; konsep final belum dikunci.
5. Integrasikan perpindahan penuh antara dunia profesional dan Chrimson Violet. Jaga akses komunikasi, keyboard, bahasa, reduced motion dan fallback tanpa mengurangi ambisi konsepnya.

Selesai jika identitas baru, konten, artwork, interaksi dan transisi dunia kreatif terasa sebagai satu pengalaman yang utuh, serta halaman profesional tetap berfungsi setelah integrasi.

## Urutan dan batas penyelesaian

Fase 1 -> verifikasi fungsi dan navigasi -> fase 2 -> verifikasi visual/performa profesional -> fase 3.

Pemeriksaan kualitas dilakukan dalam setiap fase, tidak menunggu akhir perubahan Chrimson Violet. Build statis dan publikasi `dist/` merupakan kemampuan fondasi; rencana fase ini tidak dengan sendirinya menjalankan commit, push, merge atau deployment baru.

Fase 1 berjalan di branch `migration/professional-phase-1`, dengan sembilan bagian profesional dan output `dist/`. Hasil pemeriksaan dicatat di `QA-PHASE-1.md`. Pemilik telah meminta commit dan push ke main. Deployment migrasi tetap terpisah. Uji sentuhan pada perangkat fisik tetap diperlukan. Fase 2 dan 3 belum dimulai. Rencana teknis rinci di `artifacts/migration-plan.md` mengikuti pembagian tiga fase ini.
