'use client'

import * as React from "react"
import { Copy, Check, ExternalLink, MessageCircle } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { getCurrentDiklatDay, RAW_DAYS_DATA } from "@/lib/roadmap-utils"

export interface WhatsAppShareModalProps {
  isOpen: boolean
  onClose: () => void
  dayNumber?: number
  dayName?: string
  currentScheduleTitle?: string
  activeTaskTitle?: string
  activeTaskDueDate?: string
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  dayNumber,
  dayName,
  currentScheduleTitle = "Tata Kelola TI & SPBE Nasional (120 JP)",
  activeTaskTitle = "Tugas Mandiri Pembelajaran Diklat",
  activeTaskDueDate = "Hari Ini, 23:59 WIB",
}: WhatsAppShareModalProps) {
  const [copied, setCopied] = React.useState(false)

  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Minggu, 6 = Sabtu
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const activeDay = dayNumber || getCurrentDiklatDay()
  const stageObj = RAW_DAYS_DATA.find((d) => d.day === activeDay) || RAW_DAYS_DATA[0]
  const activeDayName = isWeekend
    ? `Rehat Akhir Pekan • Menuju Hari ${activeDay} (${stageObj.dayOfWeek}, ${stageObj.date})`
    : (dayName || `${stageObj.stageName} (Hari ${activeDay})`)

  const effectiveScheduleTitle = isWeekend
    ? `Sesi Pekan Depan: Building Learning Commitment (${stageObj.dayOfWeek}, 09:30 WIB)`
    : currentScheduleTitle

  const effectiveTaskSection = isWeekend
    ? `📌 *STATUS TUGAS:*
✨ Tidak ada tanggungan tugas mendesak (Masa Rehat Akhir Pekan) • Selamat beristirahat!`
    : `📌 *TENGGAT TUGAS TERDEKAT:*
📝 *Tugas:* ${activeTaskTitle}
⏳ *Batas Pengumpulan:* ${activeTaskDueDate}`

  const templateMessage = `*📢 INFO REKAP HARIAN DIKLAT PRAKOM BATCH 3*
*Kejaksaan RI X Agrasena (Prakom 625)*
━━━━━━━━━━━━━━━━━━━━

📅 *Status Diklat:* ${activeDayName}
⏰ *Sesi Selesai/Aktif:* ${effectiveScheduleTitle}

${effectiveTaskSection}

━━━━━━━━━━━━━━━━━━━━
🔗 *Akses Pustaka Modul & Roadmap:*
https://pengembangan.kejaksaan.go.id

💻 *Ruang Diklat Virtual Zoom:*
https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat

_Semangat belajar rekan-rekan Pranata Komputer Batch 3! ✨_`

  const handleCopy = () => {
    navigator.clipboard.writeText(templateMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(templateMessage)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Salin Rekap Harian ke WhatsApp">
      <div className="space-y-3.5 pt-1 text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/80 p-2.5 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Format rekap harian telah disusun rapi dan siap disalin atau dibagikan ke grup WhatsApp kelas.</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Pratinjau Teks Pesan WhatsApp:</label>
            <span className="text-[10px] font-bold text-slate-400">Formatted Markdown</span>
          </div>
          <textarea
            readOnly
            value={templateMessage}
            rows={8}
            className="w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-slate-50 dark:bg-[#161B26] p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none select-all leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-[8px] bg-slate-100 dark:bg-[#161B26] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-[8px] bg-white dark:bg-[#1B2130] px-4 py-2 text-xs font-black text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-orange-500 dark:text-amber-400" />
                <span>Salin Teks Saja</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-[8px] bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white transition shadow-2xs cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-white" />
            <span>Kirim Langsung ke WA</span>
            <ExternalLink className="h-3 w-3 text-white/70" />
          </button>
        </div>
      </div>
    </Modal>
  )
}
