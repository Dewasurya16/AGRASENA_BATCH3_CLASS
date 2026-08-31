import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI',
    short_name: 'Prakom 625',
    description:
      'Portal Kelas Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena — Backup Modul 120 JP, Jadwal 35 Hari, & AI Copilot.',
    id: '/?source=pwa',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#10141C',
    theme_color: '#0D3830',
    lang: 'id',
    dir: 'ltr',
    categories: ['education', 'productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Roadmap 35 Hari',
        short_name: 'Roadmap',
        description: 'Jadwal dan Roadmap 35 Hari Diklat',
        url: '/schedules',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Pustaka Materi PDF',
        short_name: 'Materi',
        description: 'Modul & Materi 120 JP',
        url: '/materials',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'AI Generator Makalah',
        short_name: 'AI Makalah',
        description: 'Generator Draf Proposal Inovasi 5 Bab',
        url: '/paper-generator',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Bank Soal Ujian',
        short_name: 'Bank Soal',
        description: 'Latihan Ujian & Bank Soal Prakom',
        url: '/exam-prep',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
  }
}
