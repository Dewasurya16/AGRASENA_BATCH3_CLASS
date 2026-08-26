import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Web Kelas - Class Backup & Resource Hub',
  description:
    'Platform backup materi perkuliahan, jadwal harian, penugasan, dan showcase karya mahasiswa dengan desain modern, bersih, dan intuitif.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${outfit.variable} light`}>
      <body className="min-h-screen bg-[#F4F6FA] text-[#131E29] antialiased selection:bg-[#0D3830]/15 selection:text-[#0D3830]">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
