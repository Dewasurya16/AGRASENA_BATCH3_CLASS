import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI',
    short_name: 'Prakom 625',
    description:
      'Portal Resmi Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena — Backup Modul 120 JP, Jadwal 35 Hari, & AI Copilot.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#10141C',
    theme_color: '#0D3830',
    lang: 'id',
    dir: 'ltr',
    categories: ['education', 'productivity', 'utilities'],
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
