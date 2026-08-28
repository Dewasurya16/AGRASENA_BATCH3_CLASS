import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { VisitorTracker } from '@/components/public/visitor-tracker'
import { PWARegister } from '@/components/pwa-register'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#10141C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://agrasena-batch-3-class.vercel.app'),
  applicationName: 'Web Kelas Prakom 625',
  title: {
    default: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI X Agrasena',
    template: '%s | Diklat Prakom Batch 3 Kejaksaan RI',
  },
  description:
    'Portal resmi backup materi perkuliahan 120 JP, jadwal roadmap 35 hari, generator draf proposal inovasi 5 Bab, template DUPAK/SPMK BPS, forum diskusi, dan bank soal ujian Diklat Fungsional Pranata Komputer Kejaksaan RI Tahun 2026.',
  keywords: [
    'Diklat Pranata Komputer',
    'Prakom Kejaksaan RI',
    'Agrasena Batch 3',
    'SPBE Kejaksaan RI',
    'DUPAK Prakom',
    'Badan Diklat Kejaksaan RI',
    'AI Makalah Diklat',
    'Roadmap Prakom',
  ],
  authors: [{ name: 'Dewa Sinar Surya, S.Kom.', url: 'https://github.com/Dewasurya16' }],
  creator: 'Dewa Sinar Surya, S.Kom.',
  publisher: 'Pusdiklat Kejaksaan RI X Agrasena',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Prakom 625',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://agrasena-batch-3-class.vercel.app',
    title: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI X Agrasena',
    description:
      'Portal backup materi modul 120 JP, roadmap 35 hari, AI generator makalah inovasi 5 Bab, dan template DUPAK resmi.',
    siteName: 'Web Kelas Diklat Prakom Batch 3',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Logo Diklat Prakom Kejaksaan RI',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI',
    description:
      'Portal backup materi modul 120 JP, roadmap 35 hari, AI generator makalah inovasi 5 Bab, dan template DUPAK resmi.',
    images: ['/icon-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={outfit.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F6FA] dark:bg-[#14181F] text-[#131E29] dark:text-[#D8E0EC] antialiased selection:bg-[#0D3830]/15 selection:text-[#0D3830] transition-colors duration-250">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <PWARegister />
          <VisitorTracker />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

