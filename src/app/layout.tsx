import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { VisitorTracker } from '@/components/public/visitor-tracker'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI X Agrasena',
  description:
    'Platform backup materi perkuliahan, jadwal harian, penugasan, Cloud IDE, dan bank soal ujian MOOC 120 JP.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={outfit.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F6FA] dark:bg-[#0B0D11] text-[#131E29] dark:text-[#F1F5F9] antialiased selection:bg-[#0D3830]/15 selection:text-[#0D3830] transition-colors duration-200">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <VisitorTracker />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

