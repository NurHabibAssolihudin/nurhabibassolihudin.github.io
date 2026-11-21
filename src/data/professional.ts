export type Locale = 'en' | 'id';
export type Copy = { en: string; id: string };
export const t = (value: Copy, language: Locale) => value[language];
export const words = {
  introduction: { en: 'I build modular web applications, backend services, and tools for developers.', id: 'Saya membangun aplikasi web modular, layanan backend, dan alat bantu untuk pengembang.' },
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
    lead: { en: 'Have a project in mind or a role you’d like to discuss? A short note is enough to get started.', id: 'Ada proyek yang ingin kamu bahas atau tawaran kerja? Pesan singkat sudah cukup untuk memulai.' },
    emailDirect: { en: 'Prefer email?', id: 'Lebih nyaman lewat email?' },
    write: { en: 'Write me a note', id: 'Tulis pesan' },
    topicLabel: { en: 'Pick a starting point (optional)', id: 'Pilih topik (opsional)' },
    message: { en: 'What would you like to discuss?', id: 'Apa yang ingin kamu bahas?' },
    messageHint: { en: 'Tell me briefly what you need and what you’d like to achieve.', id: 'Ceritakan sedikit tentang kebutuhanmu dan apa yang ingin kamu capai.' },
    name: { en: 'What should I call you?', id: 'Boleh tahu namamu?' },
    replyEmail: { en: 'Where can I email you?', id: 'Ke email mana saya membalas?' },
    topics: [
      {id: 'project', label: {en: 'Project', id: 'Proyek'}, hint: {en: 'What would you like to build or improve? Is there a target date?', id: 'Apa yang ingin kamu buat atau perbaiki? Ada target waktu?'}},
      {id: 'role', label: {en: 'Job opportunity', id: 'Peluang kerja'}, hint: {en: 'Tell me about the role and what your team is working on.', id: 'Ceritakan peran yang kamu tawarkan dan apa yang sedang dikerjakan timmu.'}},
      {id: 'other', label: {en: 'Other', id: 'Topik lain'}, hint: {en: 'A question, an idea, or a quick hello is welcome.', id: 'Boleh mulai dari satu pertanyaan, ide, atau sekadar menyapa.'}}
    ],
    send: { en: 'Send to me', id: 'Kirim ke saya' },
    sending: { en: 'Sending message', id: 'Mengirim pesan' },
    sent: { en: 'Your message has been received. Thank you for sharing it with me.', id: 'Pesanmu sudah diterima. Terima kasih sudah bercerita.' },
    failed: { en: 'Your message hasn’t gone through yet. Your words are still here; try again or send me an email.', id: 'Belum berhasil terkirim. Ceritamu masih ada di sini. Coba lagi sebentar, atau hubungi saya lewat email.' },
    unavailable: { en: 'I can’t receive messages here just yet. You can still say hello by email.', id: 'Belum bisa mengirim lewat sini. Kamu tetap bisa menyapa saya lewat email.' },
    limited: { en: 'Give it a few minutes, then try again. Your message is still here.', id: 'Beri jeda beberapa menit, ya. Ceritamu tetap ada di sini.' },
    noScript: { en: 'You can reach me directly using the email address listed here.', id: 'Kamu bisa langsung menghubungi saya lewat alamat email yang tertera.' },
    profiles: { en: 'Professional profiles', id: 'Profil profesional' },
  },
};
export { chapterIds } from './navigation';
