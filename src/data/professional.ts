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
// Keep picker-only copy separate so the island does not ship all static sections.
export const workCopy = {
  instruction: { en: 'Pick a project. Open the story behind it.', id: 'Pilih proyek untuk membaca cerita pengembangannya.' },
  select: { en: 'Select a project', id: 'Pilih proyek' },
  pause: { en: 'Pause movement', id: 'Jeda gerakan' },
  resume: { en: 'Resume movement', id: 'Lanjutkan gerakan' },
  gesture: { en: 'Drag to browse. Select a card to read.', id: 'Geser untuk memilih. Buka kartu untuk membaca.' },
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
    lead: { en: 'Have a project in mind, a role to discuss, or a question about my work? Send me an email.', id: 'Ada proyek, peluang kerja, atau hal lain yang ingin dibahas? Kirim email dan ceritakan kebutuhanmu.' },
    email: { en: 'Send me an email', id: 'Kirim email' },
    profiles: { en: 'Professional profiles', id: 'Profil profesional' },
  },
};
export { chapterIds } from './navigation';
