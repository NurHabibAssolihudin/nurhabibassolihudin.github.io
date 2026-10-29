export type Locale = 'en' | 'id';
export type Copy = { en: string; id: string };
export const t = (value: Copy, language: Locale) => value[language];
export const words = {
  hello: { en: "Hello, I'm Nur.", id: 'Halo, saya Nur.' },
  introduction: { en: 'I work on web applications, integrations and tools. I also make games with alimagine.', id: 'Saya mengerjakan aplikasi web, integrasi, dan perangkat bantu. Saya juga membuat game bersama alimagine.' },
  summary: { en: 'Overview', id: 'Ringkasan' }, work: { en: 'Selected work', id: 'Pekerjaan terpilih' },
  experience: { en: 'Experience', id: 'Pengalaman' }, approach: { en: 'How I work', id: 'Cara bekerja' },
  contact: { en: 'Get in touch', id: 'Mari berbincang' },
  view: { en: 'View selected work', id: 'Lihat pekerjaan' }, detail: { en: 'View project details', id: 'Lihat detail proyek' },
  back: { en: 'Back to selected work', id: 'Kembali ke pilihan pekerjaan' },
  next: { en: 'Next section', id: 'Bagian berikutnya' }, previous: { en: 'Previous section', id: 'Bagian sebelumnya' },
  personal: { en: 'Personal project', id: 'Proyek pribadi' },
  contribution: { en: 'My contribution', id: 'Kontribusi saya' },
  responsibility: { en: 'I handle the branding, planning, code, deployment and marketing of this personal project.', id: 'Saya menangani branding, perencanaan, kode, deployment, dan marketing proyek pribadi ini.' },
  evidence: { en: 'What you can explore', id: 'Yang dapat ditinjau' },
};
export const projects = [
  {
    id: 'project-orca', name: 'ORCA', image: '/assets/orca-workspace.png',
    kind: { en: 'A workspace for projects', id: 'Ruang kerja untuk proyek' },
    summary: { en: 'Documents, boards, tasks and a calendar, grouped in one workspace.', id: 'Dokumen, papan, tugas, dan kalender yang dikelompokkan dalam satu ruang kerja.' },
    context: { en: 'ORCA brings different ways of working on a project into spaces: writing documents, organizing tasks and following a schedule.', id: 'ORCA menyatukan beberapa cara mengerjakan proyek di dalam space: menulis dokumen, mengatur tugas, dan mengikuti jadwal.' },
    focus: { en: 'The workspace and its document, board and calendar views. The project can be self-hosted.', id: 'Ruang kerja beserta tampilan dokumen, papan, dan kalender. Proyek ini dapat di-host sendiri.' },
    evidence: { en: 'Open the public demo to explore the workspace and its sample content without creating an account.', id: 'Buka demo publik untuk mencoba ruang kerja dan konten contohnya tanpa membuat akun.' },
    stack: ['TypeScript', 'Documents', 'Boards', 'Calendar'],
    links: [{ label: { en: 'Open demo', id: 'Buka demo' }, url: 'https://orca.ocaty.com' }],
  },
  {
    id: 'project-ocaty', name: 'Ocaty', image: '/assets/ocaty.png',
    kind: { en: 'Business software', id: 'Perangkat lunak bisnis' },
    summary: { en: 'Business software with commerce, CRM and ERP modules.', id: 'Perangkat lunak bisnis dengan modul commerce, CRM, dan ERP.' },
    context: { en: 'Ocaty explores business workflows through separate application modules and the API services behind them.', id: 'Ocaty mengerjakan alur bisnis melalui modul aplikasi yang terpisah dan layanan API yang mendukungnya.' },
    focus: { en: 'Frontend modules with shared UI packages, alongside account and notification services.', id: 'Modul frontend dengan paket UI bersama, beserta layanan akun dan notifikasi.' },
    evidence: { en: 'The existing page preview describes the product. Its frontend uses module federation; the services use FastAPI and PostgreSQL.', id: 'Preview halaman yang tersedia menjelaskan produknya. Frontend memakai module federation; layanannya menggunakan FastAPI dan PostgreSQL.' },
    stack: ['TypeScript', 'React', 'FastAPI', 'PostgreSQL'],
    links: [] as { label: Copy; url: string }[],
  },
  {
    id: 'project-oxelot', name: 'Oxelot', image: null,
    kind: { en: 'Tools for web applications', id: 'Perangkat untuk aplikasi web' },
    summary: { en: 'A TypeScript library for storage, background workers and offline sync in PWAs.', id: 'Library TypeScript untuk penyimpanan, worker latar, dan sinkronisasi offline pada PWA.' },
    context: { en: 'Oxelot works on the browser side of an application: storing data, moving work into background workers and supporting offline synchronization.', id: 'Oxelot mengerjakan sisi browser sebuah aplikasi: menyimpan data, memindahkan pekerjaan ke worker latar, dan mendukung sinkronisasi offline.' },
    focus: { en: 'The library combines OPFS and WASM SQLite with a worker pool and offline synchronization.', id: 'Library ini menggabungkan OPFS dan WASM SQLite dengan kumpulan worker serta sinkronisasi offline.' },
    evidence: { en: 'Read the source and documentation in the repository to inspect the library and its APIs.', id: 'Baca kode dan dokumentasi di repositori untuk meninjau library serta API-nya.' },
    stack: ['TypeScript', 'WASM', 'OPFS', 'Workers'],
    links: [{ label: { en: 'View repository', id: 'Lihat repositori' }, url: 'https://github.com/NurHabibAssolihudin/Oxelot' }],
  },
];

export { chapterIds } from './navigation';
