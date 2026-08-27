'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Copy, Check, ExternalLink, MessageCircle, X, Sparkles } from "lucide-react"
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

  const activeDay = dayNumber || getCurrentDiklatDay()
  const stageObj = RAW_DAYS_DATA.find((d) => d.day === activeDay) || RAW_DAYS_DATA[0]
  const activeDayName = dayName || `${stageObj.stageName} (Hari ${activeDay})`

  const templateMessage = `*📢 INFO REKAP HARIAN DIKLAT PRAKOM BATCH 3*
*Kejaksaan RI X Agrasena (Prakom 625)*
━━━━━━━━━━━━━━━━━━━━

📅 *Status Diklat:* ${activeDayName}
⏰ *Sesi Selesai/Aktif:* ${currentScheduleTitle}

📌 *TENGGAT TUGAS TERDEKAT:*
📝 *Tugas:* ${activeTaskTitle}
⏳ *Batas Pengumpulan:* ${activeTaskDueDate}

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
      <div className="space-y-4 pt-1 text-[#18181B] dark:text-white">
        <div className="flex items-center gap-2 rounded-2xl bg-[#E6F7ED] dark:bg-emerald-950/80 p-3 border border-[#A7F3D0] dark:border-emerald-800 text-xs font-bold text-[#0D824B] dark:text-emerald-300">
          <MessageCircle className="h-4 w-4 shrink-0 text-[#0D824B] dark:text-emerald-400" />
          <span>Format pesan rapi telah disusun otomatis dan siap dibagikan ke grup angkatan.</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-[#18181B] dark:text-white">Pratinjau Teks Pesan WhatsApp:</label>
            <span className="text-[10px] font-bold text-[#6B7C93] dark:text-slate-400">Formatted Markdown</span>
          </div>
          <textarea
            readOnly
            value={templateMessage}
            rows={7}
            className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#1E2433] p-3.5 font-mono text-xs text-[#18181B] dark:text-slate-200 focus:outline-none select-all leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-[#18181B] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-full bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-black text-[#18181B] dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#0D824B] dark:text-emerald-400" />
                <span className="text-[#0D824B] dark:text-emerald-400">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#FF7643] dark:text-amber-400" />
                <span>Salin Teks Saja</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-5 py-2.5 text-xs font-black text-white transition shadow-md cursor-pointer"
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
