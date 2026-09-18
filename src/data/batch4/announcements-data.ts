export interface AnnouncementRecord {
  id: string
  title: string
  content: string
  is_urgent: boolean
  is_active: boolean
  author: string
  created_at: string
  batch?: string | number
}

export const DEFAULT_BATCH4_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: "ann-b4-launch",
    title: "🚀 Portal Resmi Agrasena Batch 4 Telah Aktif!",
    content:
      "Yth. Bapak/Ibu Rekan Peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI,\n\nSelamat datang di portal perkuliahan kelas Agrasena Batch 4. Portal ini telah disiapkan untuk mendukung kelancaran pembelajaran Anda selama 35 hari:\n\n1. 📅 Kalender Roadmap 35 Hari & Jadwal Sesi Pembelajaran.\n2. 📚 Pustaka Modul Resmi Kurikulum 120 JP.\n3. 🎯 Latihan Kuis & Simulasi Ujian Mandiri MOOC.\n4. 🤖 Asisten AI Penyusunan Makalah & Laporan Laboratorium Satker.\n5. 📄 Format Dokumen, SPT, dan Matriks Butir DUPAK / Angka Kredit BPS.\n\nInformasi tautan virtual Zoom resmi akan diperbarui langsung oleh panitia admin kelas. Selamat mengikuti diklat dan sukses selalu!",
    is_urgent: true,
    is_active: true,
    author: "Panitia & Tim Pengelola Portal Batch 4",
    created_at: "2026-09-18T00:00:00.000Z",
    batch: "batch-4",
  },
]
