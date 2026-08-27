'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  Search,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  Tag,
  User,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

interface Reply {
  id: string
  authorName: string
  authorSatker: string
  isOfficial?: boolean
  content: string
  createdAt: string
}

interface DiscussionThread {
  id: string
  authorName: string
  authorSatker: string
  tag: string
  title: string
  content: string
  upvotes: number
  createdAt: string
  replies: Reply[]
}

const TAGS_LIST = ["Semua", "#TugasMandiri", "#Database", "#Jaringan", "#SeminarAkhir", "#LMS", "#Umum"]

export function DiscussionsHub() {
  const [threads, setThreads] = React.useState<DiscussionThread[]>([])
  const [selectedTag, setSelectedTag] = React.useState("Semua")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [expandedThreadId, setExpandedThreadId] = React.useState<string | null>(null)
  const [votedMap, setVotedMap] = React.useState<Record<string, boolean>>({})

  // Form State for new thread
  const [formName, setFormName] = React.useState("")
  const [formSatker, setFormSatker] = React.useState("Kejaksaan Negeri Soppeng")
  const [formTag, setFormTag] = React.useState("#TugasMandiri")
  const [formTitle, setFormTitle] = React.useState("")
  const [formContent, setFormContent] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reply Input State
  const [replyTextMap, setReplyTextMap] = React.useState<Record<string, string>>({})
  const [isReplyingMap, setIsReplyingMap] = React.useState<Record<string, boolean>>({})

  // Load discussions
  const fetchDiscussions = async () => {
    try {
      const res = await fetch("/api/discussions")
      const data = await res.json()
      if (data.discussions) {
        setThreads(data.discussions)
      }
    } catch {
      // Fallback
    }
  }

  React.useEffect(() => {
    fetchDiscussions()

    try {
      const savedName = localStorage.getItem("prakom_user_name")
      const savedSatker = localStorage.getItem("prakom_user_satker")
      const savedVotes = localStorage.getItem("prakom_discussion_votes")
      if (savedName) setFormName(savedName)
      if (savedSatker) setFormSatker(savedSatker)
      if (savedVotes) setVotedMap(JSON.parse(savedVotes))
    } catch {
      // Ignore
    }
  }, [])

  // Filtered threads
  const filteredThreads = React.useMemo(() => {
    return threads.filter((t) => {
      const matchTag = selectedTag === "Semua" || t.tag === selectedTag
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.authorSatker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchTag && matchSearch
    })
  }, [threads, selectedTag, searchQuery])

  // Submit new thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formContent.trim() || !formSatker.trim()) {
      alert("Harap lengkapi judul pertanyaan, satuan kerja, dan isi pesan.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_thread",
          authorName: formName || "Rekan Prakom",
          authorSatker: formSatker,
          tag: formTag,
          title: formTitle,
          content: formContent
        })
      })

      const data = await res.json()
      if (data.success && data.thread) {
        setThreads((prev) => [data.thread, ...prev])
        setIsModalOpen(false)
        setFormTitle("")
        setFormContent("")
      }
    } catch {
      alert("Gagal mengirim pertanyaan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Upvote thread
  const handleUpvote = async (threadId: string) => {
    if (votedMap[threadId]) return

    setVotedMap((prev) => {
      const updated = { ...prev, [threadId]: true }
      localStorage.setItem("prakom_discussion_votes", JSON.stringify(updated))
      return updated
    })

    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    )

    try {
      await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", threadId })
      })
    } catch {
      // Ignore
    }
  }

  // Submit reply
  const handleSendReply = async (threadId: string) => {
    const text = replyTextMap[threadId]?.trim()
    if (!text) return

    setIsReplyingMap((prev) => ({ ...prev, [threadId]: true }))

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          threadId,
          authorName: formName || "Rekan Prakom",
          authorSatker: formSatker || "Kejaksaan RI",
          content: text
        })
      })

      const data = await res.json()
      if (data.success && data.reply) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId ? { ...t, replies: [...t.replies, data.reply] } : t
          )
        )
        setReplyTextMap((prev) => ({ ...prev, [threadId]: "" }))
      }
    } catch {
      alert("Gagal mengirim balasan.")
    } finally {
      setIsReplyingMap((prev) => ({ ...prev, [threadId]: false }))
    }
  }

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Forum Kolaborasi Peserta</span>
              </span>
              <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300">
                Akses Instan Tanpa Login
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
              Papan Diskusi & Tanya Jawab <br className="hidden sm:block" />
              <span className="text-[#0D824B] dark:text-emerald-400">Komunitas Prakom Batch 3</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed">
              Ruang bertukar solusi teknis, tips pengerjaan tugas harian LMS, konfigurasi server, dan persiapan naskah seminar antar-rekan Pranata Komputer Kejaksaan se-Indonesia.
            </p>
          </div>

          <Button
            variant="orange"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="font-black text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer self-start sm:self-center"
            icon={<Plus className="h-4 w-4" />}
          >
            Tulis Pertanyaan
          </Button>
        </div>
      </motion.div>

      {/* Filter and Search Controls */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE] dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik diskusi / satker..."
              className="h-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2433] pl-10 pr-4 text-xs font-medium text-[#18181B] dark:text-white placeholder-[#9AA8BA] dark:placeholder-slate-400 focus:border-[#0D824B] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {TAGS_LIST.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedTag === t
                    ? "bg-[#0D824B] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thread Cards List */}
      <div className="space-y-4">
        {filteredThreads.length === 0 ? (
          <div className="rounded-[32px] bg-white dark:bg-[#12161F] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h4 className="font-bold text-base text-[#131E29] dark:text-white">Tidak Ada Diskusi yang Sesuai</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Jadilah yang pertama menuliskan pertanyaan atau topik diskusi untuk rekan seangkatan.
            </p>
            <Button variant="orange" size="sm" onClick={() => setIsModalOpen(true)}>
              Tulis Pertanyaan Baru
            </Button>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isExpanded = expandedThreadId === thread.id
            const isVoted = Boolean(votedMap[thread.id])

            return (
              <motion.div
                key={thread.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] bg-white dark:bg-[#161B26] p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Author Info & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 flex items-center justify-center text-[#0D824B] dark:text-emerald-300 font-black text-xs">
                      {thread.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#131E29] dark:text-white leading-none">
                        {thread.authorName}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {thread.authorSatker}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold text-[#0D824B] dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                    {thread.tag}
                  </span>
                </div>

                {/* Title and Content */}
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-black text-[#18181B] dark:text-white leading-snug">
                    {thread.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {thread.content}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpvote(thread.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      isVoted
                        ? "bg-[#E6F7ED] dark:bg-emerald-950/50 text-[#0D824B] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Bermanfaat ({thread.upvotes})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                    className="flex items-center gap-1.5 font-bold text-[#0D824B] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{thread.replies.length} Tanggapan</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Expanded Replies Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3"
                    >
                      {/* Replies List */}
                      <div className="space-y-2.5">
                        {thread.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                              reply.isOfficial
                                ? "bg-[#F0FDF4] dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                                : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-[#131E29] dark:text-white flex items-center gap-1.5">
                                {reply.authorName}
                                {reply.isOfficial && (
                                  <span className="bg-[#0D824B] text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                                    Official
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400">{reply.authorSatker}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input Box */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyTextMap[thread.id] || ""}
                          onChange={(e) =>
                            setReplyTextMap((prev) => ({ ...prev, [thread.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendReply(thread.id)
                          }}
                          placeholder="Tuliskan solusi atau tanggapan Anda..."
                          className="h-10 flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D28] px-3.5 text-xs text-[#18181B] dark:text-white placeholder-slate-400 focus:border-[#0D824B] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(thread.id)}
                          disabled={isReplyingMap[thread.id]}
                          className="h-10 px-4 bg-[#0D824B] hover:bg-[#0B6B3E] text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Modal Ask Question */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tulis Pertanyaan / Topik Diskusi Baru"
          description="Pertanyaan Anda dapat dibaca dan dijawab oleh seluruh rekan angkatan dan pengurus kelas."
          className="max-w-2xl"
        >
          <form onSubmit={handleCreateThread} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Anda:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] px-3 text-xs font-semibold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asal Satker (Kejati / Kejari):
                </label>
                <input
                  type="text"
                  value={formSatker}
                  onChange={(e) => setFormSatker(e.target.value)}
                  placeholder="Contoh: Kejari Soppeng"
                  required
                  className="h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] px-3 text-xs font-bold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Topik:
              </label>
              <select
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] px-3 text-xs font-bold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none"
              >
                {TAGS_LIST.filter((t) => t !== "Semua").map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Pertanyaan:
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Tuliskan inti pertanyaan dengan jelas..."
                required
                className="h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] px-3 text-xs font-bold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Uraian Lengkap:
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={4}
                required
                placeholder="Ceritakan detail kendala teknis, materi, atau pertanyaan yang ingin didiskusikan..."
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] p-3 text-xs font-medium text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="orange"
                size="md"
                disabled={isSubmitting}
                className="font-black text-xs shadow-sm cursor-pointer"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pertanyaan"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  )
}
