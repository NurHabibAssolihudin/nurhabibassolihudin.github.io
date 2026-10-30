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
  responsibility: { en: 'I develop this project independently, handling its planning, branding, development, release and marketing.', id: 'Ini proyek yang saya kerjakan sendiri, mulai dari perencanaan dan identitas merek hingga pengembangan, rilis, dan pemasaran.' },
};
// Keep picker-only copy separate so the island does not ship all static sections.
export const workCopy = {
  instruction: { en: 'Select a project to see what it does and my role in building it.', id: 'Pilih proyek untuk melihat kegunaan dan peran saya di dalamnya.' },
  select: { en: 'Select a project', id: 'Pilih proyek' },
};
// Each language is written for its readers rather than matched word for word.
export const sections = {
  summary: {
    lead: { en: 'I take my personal projects from product planning and brand identity through development, release and marketing.', id: 'Untuk proyek pribadi, saya menangani perencanaan produk, pengembangan, rilis, dan pemasarannya.' },
    body: { en: 'ORCA is a project workspace, Ocaty brings together business applications, and Oxelot provides tools for building web apps.', id: 'ORCA membantu mengatur proyek, Ocaty menyediakan modul aplikasi bisnis, dan Oxelot menyediakan alat bantu untuk membuat aplikasi web.' },
    background: { en: 'View my experience', id: 'Lihat pengalaman saya' },
    scopeTitle: { en: 'Areas of work', id: 'Lingkup pekerjaan' },
    scope: [
      { name: { en: 'Product', id: 'Produk' }, description: { en: 'Planning and brand identity', id: 'Perencanaan dan identitas merek' } },
      { name: { en: 'Development', id: 'Teknis' }, description: { en: 'Code and release', id: 'Pengembangan dan rilis' } },
      { name: { en: 'Marketing', id: 'Pemasaran' }, description: { en: 'Introducing the product', id: 'Memperkenalkan produk' } },
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
export const projects = [
  {
    id: 'project-orca', name: 'ORCA', image: '/assets/orca-workspace.png',
    kind: { en: 'Project workspace', id: 'Ruang kerja proyek' },
    summary: { en: 'Keep project documents, tasks and schedules in one workspace.', id: 'Dokumen, tugas, dan jadwal proyek dalam satu ruang kerja.' },
    context: { en: 'ORCA brings document writing, task management and project scheduling into one place.', id: 'ORCA menyediakan satu tempat untuk menulis dokumen, mengatur tugas, dan menyusun jadwal proyek.' },
    focus: { en: 'I build the workspace and its document, board and calendar views. ORCA can also run on your own server.', id: 'Saya mengembangkan ruang kerja beserta tampilan dokumen, board tugas, dan kalendernya. ORCA juga bisa dijalankan di server sendiri.' },
    reviewTitle: { en: 'Try the demo', id: 'Coba langsung' },
    evidence: { en: 'Explore the workspace with sample content. No account is needed.', id: 'Coba demo berisi data contoh untuk melihat cara kerjanya. Tidak perlu membuat akun.' },
    technologies: ['TypeScript'],
    links: [{ label: { en: 'Open demo', id: 'Buka demo' }, url: 'https://orca.ocaty.com' }],
  },
  {
    id: 'project-ocaty', name: 'Ocaty', image: '/assets/ocaty.png',
    kind: { en: 'Business applications', id: 'Aplikasi bisnis' },
    summary: { en: 'Business applications with commerce, CRM and ERP modules.', id: 'Aplikasi bisnis dengan modul penjualan, CRM, dan ERP.' },
    context: { en: 'With Ocaty, I develop separate application modules for business workflows, including commerce, CRM and ERP.', id: 'Melalui Ocaty, saya mengembangkan modul untuk kebutuhan bisnis, seperti penjualan, CRM, dan ERP.' },
    focus: { en: 'I work on frontend modules, shared interface components, and account and notification services.', id: 'Saya mengerjakan modul frontend, komponen antarmuka bersama, serta layanan akun dan notifikasi.' },
    reviewTitle: { en: 'Technical overview', id: 'Gambaran teknis' },
    evidence: { en: 'Module federation connects the frontend modules. The backend services use FastAPI and PostgreSQL.', id: 'Modul antarmukanya terhubung melalui module federation, dengan FastAPI dan PostgreSQL pada sisi backend.' },
    technologies: ['TypeScript', 'React', 'FastAPI', 'PostgreSQL'],
    links: [] as { label: Copy; url: string }[],
  },
  {
    id: 'project-oxelot', name: 'Oxelot', image: null,
    kind: { en: 'Web development library', id: 'Library pengembangan web' },
    summary: { en: 'A TypeScript library for local storage, background workers and offline data synchronization.', id: 'Library TypeScript untuk penyimpanan lokal, background worker, dan sinkronisasi data secara offline.' },
    context: { en: 'Oxelot provides browser-side storage, background workers and data synchronization for web applications with offline support.', id: 'Oxelot menyediakan penyimpanan lokal, background worker, dan sinkronisasi data untuk aplikasi web yang mendukung penggunaan offline.' },
    focus: { en: 'I develop local storage with OPFS and WASM SQLite, worker pools and offline synchronization.', id: 'Saya mengembangkan penyimpanan berbasis OPFS dan WASM SQLite, pengelolaan worker, serta sinkronisasi offline.' },
    reviewTitle: { en: 'Source and documentation', id: 'Kode dan dokumentasi' },
    evidence: { en: 'The source code and API documentation are available on GitHub to read and try.', id: 'Kode sumber dan dokumentasi API tersedia di GitHub untuk dipelajari atau dicoba.' },
    technologies: ['TypeScript', 'WASM', 'OPFS', 'Workers'],
    links: [{ label: { en: 'View repository', id: 'Lihat kode di GitHub' }, url: 'https://github.com/NurHabibAssolihudin/Oxelot' }],
  },
];

export { chapterIds } from './navigation';
