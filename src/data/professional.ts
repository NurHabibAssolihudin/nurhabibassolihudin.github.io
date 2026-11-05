export type Locale = 'en' | 'id';
export type Copy = { en: string; id: string };
export const t = (value: Copy, language: Locale) => value[language];
export const words = {
  introduction: { en: "I'm NurHabib. I build modular web applications, backend services, and tools for developers.", id: 'Saya NurHabib. Saya membangun aplikasi web modular, layanan backend, dan alat bantu untuk pengembang.' },
  expertise: { en: 'Areas of work', id: 'Bidang yang saya kerjakan' },
  areas: [
    { en: 'Modular applications', id: 'Aplikasi modular' },
    { en: 'Backend & integration', id: 'Backend & integrasi sistem' },
    { en: 'Developer infrastructure', id: 'Infrastruktur pengembangan' },
  ],
  contact: { en: 'Contact me', id: 'Hubungi saya' },
  summary: { en: 'About my work', id: 'Sekilas' }, work: { en: 'Selected projects', id: 'Proyek pilihan' },
  experience: { en: 'Work experience', id: 'Pengalaman kerja' }, approach: { en: 'How I work', id: 'Cara saya bekerja' },
  view: { en: 'View selected projects', id: 'Lihat proyek pilihan' }, detail: { en: 'Read case study', id: 'Baca studi kasus' },
  back: { en: 'Back to projects', id: 'Kembali ke daftar proyek' },
  personal: { en: 'Personal project', id: 'Proyek pribadi' },
  contribution: { en: 'My role', id: 'Peran saya' },
  technology: { en: 'Technology', id: 'Teknologi' },
  responsibility: { en: 'Personal project, developed independently.', id: 'Proyek pribadi yang saya kerjakan sendiri.' },
};
export const caseCopy = {
  problem: { en: 'Problem', id: 'Masalah yang dikerjakan' },
  role: { en: 'My role', id: 'Peran saya' },
  system: { en: 'System design', id: 'Desain sistem' },
  outcome: { en: 'Outcome', id: 'Hasil pengembangan' },
  more: { en: 'Context, decisions and trade-offs', id: 'Konteks, keputusan, dan kompromi teknis' },
  constraints: { en: 'Context and constraints', id: 'Konteks dan batasan' },
  decisions: { en: 'Technical decisions', id: 'Keputusan teknis' },
  tradeoffs: { en: 'Trade-offs', id: 'Kompromi teknis' },
  learning: { en: 'What I learned', id: 'Pelajaran dari proyek ini' },
};
// Each language is written for its readers rather than matched word for word.
export const sections = {
  summary: {
    lead: { en: 'I develop applications and backend services, connect systems through APIs, and build tools for developers.', id: 'Saya mengembangkan aplikasi dan layanan backend, menghubungkan sistem melalui API, serta membuat alat bantu untuk pengembang.' },
    body: { en: 'I also build prototypes to test ideas and technical approaches.', id: 'Saya juga membuat prototipe untuk menguji ide dan pendekatan teknis.' },
    projects: { en: 'View selected projects', id: 'Lihat proyek pilihan' },
    scopeTitle: { en: 'Technical scope', id: 'Lingkup teknis' },
    scope: [
      { name: { en: 'Product applications', id: 'Aplikasi produk' }, description: { en: 'Web applications, modular business software and shared components', id: 'Aplikasi web, perangkat lunak bisnis modular, dan komponen bersama' } },
      { name: { en: 'Backend services and integration', id: 'Layanan backend dan integrasi' }, description: { en: 'APIs, data flows, service communication and automation', id: 'API, alur data, komunikasi antarlayanan, dan otomatisasi' } },
      { name: { en: 'Developer infrastructure', id: 'Infrastruktur pengembangan' }, description: { en: 'Libraries, browser storage, workers and offline data synchronization', id: 'Library, penyimpanan data di browser, worker, dan sinkronisasi data offline' } },
    ],
  },
  experience: {
    role: 'R&D Developer',
    employer: 'PT Semesta Teknologi Informatika',
    duration: { en: 'More than one year', id: 'Lebih dari satu tahun' },
    durationLabel: { en: 'Time in role', id: 'Lama bekerja' },
    profile: { en: 'View LinkedIn profile', id: 'Lihat profil LinkedIn' },
  },
  approach: {
    lead: { en: 'I handle both product and technical decisions in my personal projects, keeping planning, development and marketing connected.', id: 'Saya mengurus produk dan sisi teknisnya sekaligus, agar rencana, pengembangan, dan pemasarannya berjalan searah.' },
    steps: [
      { title: { en: 'Plan the product', id: 'Merancang produk' }, body: { en: 'Define what the product needs, plan its features and develop its brand identity.', id: 'Menentukan kebutuhan produk, merencanakan fitur, dan menyiapkan identitas merek.' } },
      { title: { en: 'Build and release', id: 'Membangun dan merilis' }, body: { en: 'Write the code and prepare a release process that fits the project.', id: 'Mengerjakan kode dan menyiapkan proses rilis sesuai kebutuhan tiap proyek.' } },
      { title: { en: 'Introduce the product', id: 'Memperkenalkan produk' }, body: { en: 'Explain what the product does and handle its marketing.', id: 'Menyiapkan cara menjelaskan produk dan menangani pemasarannya.' } },
    ],
  },
  contact: {
    title: { en: "Let's talk.", id: 'Mari ngobrol.' },
    lead: { en: 'Tell me what’s on your mind. We can take it from there.', id: 'Ceritakan apa yang sedang kamu pikirkan. Kita bisa mulai dari sana.' },
    name: { en: 'What should I call you?', id: 'Boleh tahu namamu?' },
    replyEmail: { en: 'Where can I email you?', id: 'Ke email mana saya membalas?' },
    greeting: { en: 'Hi, let’s talk about', id: 'Hai, mari bicara tentang' },
    topicFallback: { en: 'your message.', id: 'pesanmu.' },
    topics: {
      en: ['your next idea.', 'a project.', 'working together.', 'what’s on your mind.'],
      id: ['ide barumu.', 'proyek berikutnya.', 'kolaborasi.', 'hal yang kamu suka.']
    },
    send: { en: 'Send to me', id: 'Kirim ke saya' },
    sending: { en: 'Sending message', id: 'Mengirim pesan' },
    sent: { en: 'Your message has been received. Thank you for sharing it with me.', id: 'Pesanmu sudah diterima. Terima kasih sudah bercerita.' },
    failed: { en: 'Your message hasn’t gone through yet. Your words are still here; try again or send me an email.', id: 'Belum berhasil terkirim. Ceritamu masih ada di sini. Coba lagi sebentar, atau hubungi saya lewat email.' },
    unavailable: { en: 'I can’t receive messages here just yet. You can still say hello by email.', id: 'Belum bisa mengirim lewat sini. Kamu tetap bisa menyapa saya lewat email.' },
    limited: { en: 'Give it a few minutes, then try again. Your message is still here.', id: 'Beri jeda beberapa menit, ya. Ceritamu tetap ada di sini.' },
    noScript: { en: 'If this form isn’t available, you can always reach me at the email below.', id: 'Kalau form ini tidak aktif, saya tetap bisa dihubungi lewat email di bawah.' },
    photoAlt: { en: 'Two empty armchairs facing one another beside a small table, with afternoon light falling across the room.', id: 'Dua kursi kosong saling berhadapan di sisi meja kecil, dengan cahaya sore masuk ke ruangan.' },
    profiles: { en: 'Professional profiles', id: 'Profil profesional' },
  },
};
export { chapterIds } from './navigation';
