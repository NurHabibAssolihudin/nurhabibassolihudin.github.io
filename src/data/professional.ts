export type Locale = 'en' | 'id';
export type Copy = { en: string; id: string };
export const t = (value: Copy, language: Locale) => value[language];
export const words = {
  introduction: { en: 'I develop web applications, system integrations and tools for developers.', id: 'Saya mengembangkan aplikasi web, integrasi sistem, dan library untuk pengembang.' },
  summary: { en: 'About my work', id: 'Sekilas' }, work: { en: 'Selected projects', id: 'Proyek pilihan' },
  experience: { en: 'Work experience', id: 'Pengalaman kerja' }, approach: { en: 'How I work', id: 'Cara saya bekerja' },
  view: { en: 'View my projects', id: 'Lihat proyek saya' }, detail: { en: 'About this project', id: 'Tentang proyek ini' },
  back: { en: 'Back to projects', id: 'Kembali ke daftar proyek' },
  personal: { en: 'Personal project', id: 'Proyek pribadi' },
  contribution: { en: 'My role', id: 'Peran saya' },
  technology: { en: 'Technology', id: 'Teknologi' },
  responsibility: { en: 'Personal project, developed independently.', id: 'Proyek pribadi yang saya kerjakan sendiri.' },
};
// Keep picker-only copy separate so the island does not ship all static sections.
export const workCopy = {
  instruction: { en: 'Select a project for its description and development details.', id: 'Pilih proyek untuk melihat deskripsi dan rincian pengembangannya.' },
  select: { en: 'Select a project', id: 'Pilih proyek' },
};
// Each language is written for its readers rather than matched word for word.
export const sections = {
  summary: {
    lead: { en: 'R&D Developer at PT Semesta Teknologi Informatika.', id: 'R&D Developer di PT Semesta Teknologi Informatika.' },
    body: { en: 'Outside work, I develop ORCA, Ocaty and Oxelot as personal projects.', id: 'Di luar pekerjaan, saya mengembangkan ORCA, Ocaty, dan Oxelot sebagai proyek pribadi.' },
    background: { en: 'View my experience', id: 'Lihat pengalaman saya' },
    scopeTitle: { en: 'Technical focus', id: 'Fokus teknis' },
    scope: [
      { name: { en: 'Web applications', id: 'Aplikasi web' }, description: { en: 'Interfaces and backend services', id: 'Antarmuka dan layanan backend' } },
      { name: { en: 'System integration', id: 'Integrasi sistem' }, description: { en: 'Data exchange between applications', id: 'Pertukaran data antaraplikasi' } },
      { name: { en: 'Developer libraries', id: 'Library untuk pengembang' }, description: { en: 'Local storage and data synchronization', id: 'Penyimpanan lokal dan sinkronisasi data' } },
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
