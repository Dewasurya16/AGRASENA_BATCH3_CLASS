'use client'

import * as React from "react"
import {
  Clock,
  User,
  Video,
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
  Eye,
  Coffee,
  HelpCircle,
  PlayCircle,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"

export interface SessionItem {
  id: string
  timeRange: string
  title: string
  instructor?: string
  isBreak?: boolean
  attendanceStatus?: "present" | "pending"
  resources: Array<{
    id: string
    type: "pdf" | "zoom" | "video" | "quiz" | "article"
    title: string
    duration?: string
    status?: "completed" | "in_progress" | "pending"
    link?: string
    fileUrl?: string
  }>
}

const DEFAULT_SESSIONS: SessionItem[] = [
  {
    id: "ses-1",
    timeRange: "08:00 - 08:30",
    title: "Registrasi & Unduh Materi Sesi Pagi",
    attendanceStatus: "present",
    resources: [
      {
        id: "res-1",
        type: "pdf",
        title: "Virtual Background & Panduan Perkuliahan",
        duration: "10 mnt",
        status: "completed",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: "ses-2",
    timeRange: "08:30 - 11:30",
    title: "Pemrograman Web Lanjut — Arsitektur Next.js 15 & Supabase SSR (3 SKS)",
    instructor: "Dr. Eng. Irfan Hakim, S.T., M.T.",
    attendanceStatus: "present",
    resources: [
      {
        id: "res-2",
        type: "zoom",
        title: "Tautan Ruang Zoom — Kelas Utama",
        duration: "Live",
        status: "completed",
        link: "https://zoom.us/j/1234567890",
      },
      {
        id: "res-3",
        type: "pdf",
        title: "Slide Modul 04 — Server Actions & Database RLS",
        duration: "15 mnt",
        status: "completed",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "res-4",
        type: "quiz",
        title: "Kuis Singkat — Pemahaman SSR vs CSR",
        duration: "20 mnt",
        status: "completed",
        link: "https://pengembangan.kejaksaan.go.id/dashboard",
      },
    ],
  },
  {
    id: "ses-3",
    timeRange: "11:30 - 13:00",
    title: "ISHOMA (Istirahat, Sholat, Makan)",
    isBreak: true,
    resources: [],
  },
  {
    id: "ses-4",
    timeRange: "13:00 - 15:30",
    title: "Praktikum Mandiri & Implementasi REST API / Supabase Storage (2 JP)",
    instructor: "Bambang Sudarsono, M.Kom",
    attendanceStatus: "pending",
    resources: [
      {
        id: "res-5",
        type: "video",
        title: "Video Tutorial — Upload File ke Storage Bucket class-materials",
        duration: "15 mnt",
        status: "completed",
        link: "https://youtube.com",
      },
      {
        id: "res-6",
        type: "pdf",
        title: "Dokumen PDF — Lembar Kerja Praktikum 04",
        duration: "15 mnt",
        status: "in_progress",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "res-7",
        type: "article",
        title: "Tugas Pengumpulan — Unggah Kode ke GitHub Repository",
        duration: "Tenggat 23:59",
        status: "pending",
        link: "https://github.com",
      },
    ],
  },
]

export function SessionTimeline({ sessions }: { sessions?: SessionItem[] }) {
  const [list, setList] = React.useState<SessionItem[]>(
    sessions && sessions.length > 0 ? sessions : DEFAULT_SESSIONS
  )
  const [previewPdf, setPreviewPdf] = React.useState<{ title: string; url: string } | null>(null)
  const [activeDay, setActiveDay] = React.useState("Hari Ini (Rabu)")

  const handleToggleAttendance = (id: string) => {
    setList(
      list.map((s) =>
        s.id === id
          ? {
              ...s,
              attendanceStatus: s.attendanceStatus === "present" ? "pending" : "present",
            }
          : s
      )
    )
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-[#0D3830]" />
      case "zoom":
        return <Video className="h-4 w-4 text-[#2563EB]" />
      case "video":
        return <PlayCircle className="h-4 w-4 text-[#7E22CE]" />
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-[#B47D00]" />
      default:
        return <FileText className="h-4 w-4 text-[#6B7C93]" />
    }
  }

  return (
    <section id="agenda" className="space-y-6">
      {/* Header Bar matching the reference design */}
      <div className="rounded-[32px] bg-white p-6 soft-card-shadow border border-slate-100/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#0D3830]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#131E29]">
                Agenda & Materi Pembelajaran Harian
              </h3>
              <p className="text-xs text-[#6B7C93]">
                Alur sesi perkuliahan, bahan ajar, dan status presensi per jam pelajaran
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#0D3830] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
              Semester Ganjil 2026/2027
            </span>
            <span className="rounded-full bg-[#E6F7ED] px-3 py-1 text-xs font-bold text-[#0D824B]">
              Tahap 1 • Sesi Aktif
            </span>
          </div>
        </div>

        {/* Day/Date Sub-Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B7C93] pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#131E29]">{activeDay}</span>
            <span>•</span>
            <span className="font-mono text-[#0D824B] font-semibold">08:00 — 15:30 WIB</span>
          </div>

          <span className="rounded-full bg-[#FFEADA] px-2.5 py-0.5 text-[11px] font-bold text-[#EA580C]">
            Total 4 Sesi Pembelajaran
          </span>
        </div>
      </div>

      {/* Structured Time-Block Session Cards */}
      <div className="space-y-4">
        {list.map((session) => {
          if (session.isBreak) {
            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-[24px] bg-[#FFF4D6]/60 border border-[#FFE7A3] p-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#B47D00] min-w-[90px]">
                    {session.timeRange}
                  </span>
                  <div className="flex items-center gap-2 font-bold text-[#131E29]">
                    <Coffee className="h-4 w-4 text-[#B47D00]" />
                    <span>{session.title}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#B47D00]">
                  Waktu Istirahat & Ibadah
                </span>
              </div>
            )
          }

          const isPresent = session.attendanceStatus === "present"

          return (
            <div
              key={session.id}
              className="rounded-[28px] bg-white p-5 sm:p-6 soft-card-shadow border border-slate-100/90 space-y-4 transition-all hover:border-[#0D3830]/30"
            >
              {/* Session Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-[#F8FAFC] px-3 py-1 font-mono text-xs font-bold text-[#0D3830] border border-slate-200 shrink-0">
                    {session.timeRange}
                  </span>

                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm sm:text-base text-[#131E29]">
                      {session.title}
                    </h4>
                    {session.instructor && (
                      <p className="flex items-center gap-1.5 text-xs text-[#6B7C93]">
                        <User className="h-3.5 w-3.5 text-[#0D3830]" />
                        <span>Pemateri: <strong>{session.instructor}</strong></span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Attendance Status Toggle Button */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleToggleAttendance(session.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isPresent
                        ? "bg-[#E6F7ED] text-[#0D824B] border border-[#A7F3D0] shadow-xs"
                        : "bg-slate-100 text-[#6B7C93] hover:bg-[#0D3830] hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isPresent ? "Sudah Absen" : "Klik untuk Absen"}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Resources List */}
              <div className="space-y-2 pt-1">
                {session.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-3 border border-slate-100 hover:bg-white hover:shadow-xs transition-all gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/60">
                        {getResourceIcon(res.type)}
                      </div>
                      <span className="font-semibold text-xs text-[#131E29] line-clamp-1">
                        {res.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                      {res.duration && (
                        <span className="font-mono text-[11px] text-[#8C9BAE]">
                          {res.duration}
                        </span>
                      )}

                      {res.status && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            res.status === "completed"
                              ? "bg-[#E6F7ED] text-[#0D824B]"
                              : res.status === "in_progress"
                              ? "bg-[#FFF4D6] text-[#B47D00]"
                              : "bg-[#FFEAE9] text-[#E11D48]"
                          }`}
                        >
                          {res.status === "completed"
                            ? "Selesai"
                            : res.status === "in_progress"
                            ? "Proses"
                            : "Belum"}
                        </span>
                      )}

                      {/* Action trigger: PDF Modal or External Link */}
                      {res.fileUrl ? (
                        <button
                          onClick={() => setPreviewPdf({ title: res.title, url: res.fileUrl! })}
                          className="inline-flex items-center gap-1 font-bold text-xs text-[#0D3830] hover:text-[#FF7643] transition cursor-pointer"
                        >
                          <span>Buka Materi</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ) : res.link ? (
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-xs text-[#0D3830] hover:text-[#FF7643] transition"
                        >
                          <span>Buka Sesi</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal PDF Viewer */}
      {previewPdf && (
        <Modal
          isOpen={Boolean(previewPdf)}
          onClose={() => setPreviewPdf(null)}
          title={previewPdf.title}
          description="Pratinjau Materi Sesi Pembelajaran Langsung"
          className="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden h-[60vh]">
              <iframe
                src={previewPdf.url}
                className="w-full h-full"
                title={previewPdf.title}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#8C9BAE] font-mono">
                Sumber: Supabase Storage / PDF Resource
              </span>
              <div className="flex gap-2">
                <a href={previewPdf.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="md" icon={<ExternalLink className="h-4 w-4" />}>
                    Tab Baru
                  </Button>
                </a>
                <a href={previewPdf.url} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="orange" size="md" icon={<Download className="h-4 w-4" />}>
                    Unduh Berkas
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
