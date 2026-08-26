'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Sparkles,
  X,
  Send,
  User,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Code2,
  Database,
  BookOpen
} from 'lucide-react'
import { getCurrentDiklatDay, RAW_DAYS_DATA } from '@/lib/roadmap-utils'

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  codeSnippet?: string
}

const QUICK_PROMPTS = [
  'Jadwal & materi hari ini',
  'Cara hitung Angka Kredit (AK)',
  'Jelaskan 4 Domain SPBE',
  'Bantu buat query SQL database',
  'Format laporan tugas mandiri'
]

/**
 * Format markdown parser to render bold, italic, code, headings, lists, and tables beautifully
 */
function FormattedChatMessage({ text, onCopy }: { text: string; onCopy?: (snippet: string) => void }) {
  // Check if text contains code blocks ```...```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', lang: match[1] || 'code', content: match[2].trim() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return <CodeBlock key={pIdx} lang={part.lang || 'code'} code={part.content} onCopy={onCopy} />
        }
        return <TextMarkdownBlock key={pIdx} text={part.content} />
      })}
    </div>
  )
}

function CodeBlock({ lang, code, onCopy }: { lang: string; code: string; onCopy?: (s: string) => void }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (onCopy) onCopy(code)
  }

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0F1319] shadow-sm text-emerald-300 font-mono text-[11px]">
      <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-800">
        <span className="font-semibold uppercase text-slate-300">{lang || 'Script'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>
      <div className="overflow-x-auto p-3">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

function TextMarkdownBlock({ text }: { text: string }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={lIdx} className="h-0.5" />
        }

        // Heading 3
        if (line.startsWith('### ')) {
          return (
            <h5 key={lIdx} className="font-extrabold text-xs sm:text-sm text-[#0D3830] dark:text-emerald-400 mt-2 mb-0.5">
              {renderInlineFormatted(line.replace('### ', ''))}
            </h5>
          )
        }
        // Heading 2
        if (line.startsWith('## ')) {
          return (
            <h4 key={lIdx} className="font-black text-sm text-[#0D3830] dark:text-emerald-300 mt-2.5 mb-1">
              {renderInlineFormatted(line.replace('## ', ''))}
            </h4>
          )
        }
        // Heading 1
        if (line.startsWith('# ')) {
          return (
            <h3 key={lIdx} className="font-black text-sm sm:text-base text-[#0D3830] dark:text-emerald-300 mt-3 mb-1">
              {renderInlineFormatted(line.replace('# ', ''))}
            </h3>
          )
        }

        // Horizontal Line
        if (trimmed.startsWith('---') || trimmed.startsWith('━━━')) {
          return <hr key={lIdx} className="my-2 border-slate-200 dark:border-slate-700/60" />
        }

        // Bullet Point Lists
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^([•\-\*]\s+)/, '')
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-emerald-500 font-bold select-none">•</span>
              <div className="flex-1">{renderInlineFormatted(content)}</div>
            </div>
          )
        }

        // Numbered Lists (1. , 2. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
        if (numMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-0.5">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 select-none text-[11px]">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInlineFormatted(numMatch[2])}</div>
            </div>
          )
        }

        return <p key={lIdx}>{renderInlineFormatted(line)}</p>
      })}
    </div>
  )
}

function renderInlineFormatted(text: string) {
  // Matches **bold**, *italic*, and `inline-code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-extrabold text-[#0D3830] dark:text-emerald-300">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={idx} className="italic text-slate-700 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          className="rounded bg-slate-100 dark:bg-[#1E2433] px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/80"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [currentDayNum, setCurrentDayNum] = React.useState(3)

  // User Profile State
  const [userName, setUserName] = React.useState('')
  const [userSatker, setUserSatker] = React.useState('')
  const [isNameSet, setIsNameSet] = React.useState(false)
  const [isEditingProfile, setIsEditingProfile] = React.useState(false)
  const [tempNameInput, setTempNameInput] = React.useState('')
  const [tempSatkerInput, setTempSatkerInput] = React.useState('')

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load saved state on mount
  React.useEffect(() => {
    const today = getCurrentDiklatDay()
    setCurrentDayNum(today)

    try {
      const savedName = localStorage.getItem('prakom_user_name')
      const savedSatker = localStorage.getItem('prakom_user_satker')

      if (savedName) {
        setUserName(savedName)
        setUserSatker(savedSatker || '')
        setTempNameInput(savedName)
        setTempSatkerInput(savedSatker || '')
        setIsNameSet(true)
        setMessages([
          {
            id: 'msg-welcome',
            sender: 'ai',
            text: `Halo Pak/Ibu **${savedName}**${savedSatker ? ` (${savedSatker})` : ''}! 👋

Hari ini adalah **Hari ke-${today} (${RAW_DAYS_DATA.find((d) => d.day === today)?.date || '26 Agu 2026'}) — ${RAW_DAYS_DATA.find((d) => d.day === today)?.stageName || 'Tahap 1 • MOOC'}**.

Saya siap membantu:
• 📅 Jadwal diklat hari ini & besok
• 💻 Pemecahan error kodingan (SQL, Python, Bash, JS, Docker, dsb.)
• 📈 Perhitungan Angka Kredit (AK / DUPAK) & SPBE
• 📝 Panduan tugas & pertanyaan umum lainnya

Silakan tanyakan apa saja!`,
            timestamp: 'Baru saja'
          }
        ])
      } else {
        setIsNameSet(false)
        setMessages([
          {
            id: 'msg-ask-name',
            sender: 'ai',
            text: `Halo rekan Pranata Komputer Batch 3! 👋 Saya **AI Widyaiswara & Copilot Prakom 625**.

Sebelum kita mulai berdiskusi, boleh perkenalkan nama Anda dan asal Satuan Kerja Kejaksaan Anda? Saya akan mengingat nama Anda untuk sesi berikutnya. 😊`,
            timestamp: 'Baru saja'
          }
        ])
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isTyping])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle Save User Name / Profile
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempNameInput.trim()) return

    const cleanName = tempNameInput.trim()
    const cleanSatker = tempSatkerInput.trim()

    setUserName(cleanName)
    setUserSatker(cleanSatker)
    setIsNameSet(true)
    setIsEditingProfile(false)

    try {
      localStorage.setItem('prakom_user_name', cleanName)
      if (cleanSatker) localStorage.setItem('prakom_user_satker', cleanSatker)
    } catch {
      // Ignore
    }

    const today = currentDayNum
    const stageObj = RAW_DAYS_DATA.find((d) => d.day === today) || RAW_DAYS_DATA[2]

    setMessages((prev) => [
      ...prev,
      {
        id: `user-name-${Date.now()}`,
        sender: 'user',
        text: `Nama saya ${cleanName}${cleanSatker ? ` dari ${cleanSatker}` : ''}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      {
        id: `ai-greet-${Date.now()}`,
        sender: 'ai',
        text: `Salam kenal, Pak/Ibu **${cleanName}**${cleanSatker ? ` (${cleanSatker})` : ''}! ✨

Saya telah mengingat profil Anda. Hari ini adalah **Hari ke-${today} (${stageObj.date}, ${stageObj.dayOfWeek})** pada **${stageObj.stageName}**.

Silakan tanyakan materi harian, kendala kodingan, atau hal apapun yang ingin Anda diskusikan!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }
    ])
  }

  // Fallback in-browser knowledge if connection is offline
  const generateOfflineResponse = (userText: string): { response: string; code?: string } => {
    const q = userText.toLowerCase()
    const todayObj = RAW_DAYS_DATA.find((d) => d.day === currentDayNum) || RAW_DAYS_DATA[2]
    const tomorrowObj = RAW_DAYS_DATA.find((d) => d.day === currentDayNum + 1) || RAW_DAYS_DATA[3]

    if (q.includes('jadwal') || q.includes('hari ini') || q.includes('besok')) {
      return {
        response: `📅 **JADWAL REAL-TIME DIKLAT PRAKOM BATCH 3**
━━━━━━━━━━━━━━━━━━━━
• **Hari Ini (Hari ${currentDayNum} - ${todayObj.date}):** ${todayObj.stageName} (${todayObj.stageSubtitle})
  Jam: 08:00 - 15:30 WIB • Topik: Tata Kelola TI & SPBE Nasional (120 JP)
• **Besok (Hari ${currentDayNum + 1} - ${tomorrowObj.date}):** ${tomorrowObj.stageName} (${tomorrowObj.stageSubtitle})
  Sesi akan otomatis berlanjut besok pagi pukul 08:00 WIB.`
      }
    }

    if (q.includes('angka kredit') || q.includes('ak') || q.includes('dupak') || q.includes('pak')) {
      return {
        response: `📈 **PANDUAN ANGKA KREDIT PRAKOM (PermenPAN-RB No. 32/2020)**
━━━━━━━━━━━━━━━━━━━━
• **Target Minimal Ahli Pertama**: 12.5 AK/tahun (Predikat Baik).
• **Target Minimal Ahli Muda**: 25.0 AK/tahun.

**Bukti Fisik yang Sah**:
1. Surat Perintah Tugas (SPT) dari pimpinan satker.
2. Laporan pelaksanaan kegiatan teknis (spesifikasi, skrip query, manual book).
3. Pengesahan tanda tangan atasan langsung.`
      }
    }

    if (q.includes('sql') || q.includes('query') || q.includes('database')) {
      return {
        response: `🗄️ **KODE QUERY SQL DATABASE (PostgreSQL)**
Berikut contoh query agregasi performa data kepegawaian:`,
        code: `SELECT 
    satker, 
    jenjang, 
    COUNT(*) AS total_peserta, 
    ROUND(AVG(ak)::numeric, 2) AS rata_rata_ak
FROM pegawai_prakom
GROUP BY satker, jenjang
ORDER BY rata_rata_ak DESC;`
      }
    }

    return {
      response: `Baik Pak/Ibu **${userName || 'Rekan'}**, pertanyaan Anda mengenai **"${userText}"** telah dicatat.

Silakan akses materi lengkap di menu **[Materi PDF](/materials)** atau uji kemampuan di **[Kuis MOOC](/quiz)**.`
    }
  }

  // Send Message to Groq API with DB Context
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    }

    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInput('')
    setIsTyping(true)

    // Call /api/ai/chat with server-side Groq Key and Context
    try {
      const formattedHistory = nextHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          userName: userName || 'Rekan Prakom',
          userSatker: userSatker || 'Kejaksaan RI',
          currentDayNumber: currentDayNum,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          }
        ])
      } else {
        const fallback = generateOfflineResponse(query)
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: fallback.response,
            codeSnippet: fallback.code,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          }
        ])
      }
    } catch {
      const fallback = generateOfflineResponse(query)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallback.response,
          codeSnippet: fallback.code,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetChat = () => {
    const today = currentDayNum
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'ai',
        text: `Percakapan telah direset. Halo Pak/Ibu **${userName || 'Rekan Prakom'}**! Ada yang ingin ditanyakan terkait materi Hari ke-${today} atau kendala kodingan Anda?`,
        timestamp: 'Baru saja'
      }
    ])
  }

  return (
    <>
      {/* Floating Trigger Button on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2 rounded-full bg-[#0D3830] dark:bg-emerald-600 hover:bg-[#082822] dark:hover:bg-emerald-700 px-4 py-3 text-white shadow-xl shadow-black/25 border-2 border-white/20 cursor-pointer"
        >
          <Bot className="h-5 w-5 text-white" />
          <span className="font-bold text-xs">
            {userName ? `Hai, ${userName.split(' ')[0]}` : 'Tanya AI'}
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.button>
      </div>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[460px] h-[560px] max-h-[82vh] rounded-[28px] bg-white dark:bg-[#12161F] border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/30 flex flex-col overflow-hidden text-[#18181B] dark:text-[#F1F5F9]"
          >
            {/* 1. Header (Clean & Minimalist) */}
            <div className="flex items-center justify-between p-3.5 px-4 bg-[#FAFBFD] dark:bg-[#181D28] border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D3830] dark:bg-emerald-600 text-white shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#131E29] dark:text-white">AI Copilot Prakom</h4>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#0D824B] dark:text-emerald-400 px-1.5 py-0.2 text-[9px] font-bold">
                      Hari {currentDayNum}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {userName ? `${userName}${userSatker ? ` • ${userSatker}` : ''}` : 'Asisten Cerdas Diklat 120 JP'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isNameSet && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    title="Ubah Profil Nama"
                    className={`rounded-full p-1.5 transition cursor-pointer ${isEditingProfile ? 'bg-slate-200 dark:bg-slate-700 text-[#0D3830]' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset Percakapan"
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Tutup"
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 2. Edit Profile Modal (If user wants to edit name) */}
            {isEditingProfile && (
              <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#181D28] border-b border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#0D3830] dark:text-emerald-400" />
                    <span>Ubah Nama & Satker Anda</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
                <form onSubmit={handleSaveName} className="space-y-2">
                  <input
                    required
                    type="text"
                    value={tempNameInput}
                    onChange={(e) => setTempNameInput(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12161F] p-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempSatkerInput}
                    onChange={(e) => setTempSatkerInput(e.target.value)}
                    placeholder="Satuan Kerja (Kejari / Kejati)"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12161F] p-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0D3830] dark:bg-emerald-600 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            )}

            {/* 3. Name Onboarding Form (First time greeting) */}
            {!isNameSet && (
              <div className="p-4 bg-[#E6F7ED] dark:bg-emerald-950/60 border-b border-[#A7F3D0] dark:border-emerald-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D824B] dark:text-emerald-300">
                  <User className="h-4 w-4" />
                  <span>Perkenalkan Diri Anda:</span>
                </div>
                <form onSubmit={handleSaveName} className="space-y-2">
                  <input
                    required
                    type="text"
                    value={tempNameInput}
                    onChange={(e) => setTempNameInput(e.target.value)}
                    placeholder="Nama Lengkap (Contoh: Budi Santoso, S.Kom.)"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12161F] p-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempSatkerInput}
                    onChange={(e) => setTempSatkerInput(e.target.value)}
                    placeholder="Satuan Kerja (Contoh: Kejari Soppeng)"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12161F] p-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0D824B] hover:bg-[#0A6C3E] py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Simpan & Mulai Diskusi
                  </button>
                </form>
              </div>
            )}

            {/* 4. Quick Prompt Chips */}
            <div className="p-2 px-3 bg-[#F4F6FA] dark:bg-[#151922] border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(qp)}
                  className="rounded-full bg-white dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-[#0D3830] dark:hover:border-emerald-500 hover:text-[#0D3830] dark:hover:text-emerald-400 transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* 5. Messages Scroll Area with Rich Markdown Renderer */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 overscroll-contain text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0D3830] dark:bg-emerald-600 text-white mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className="max-w-[88%] space-y-1">
                    <div
                      className={`rounded-2xl p-3 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0D3830] dark:bg-emerald-700 text-white rounded-tr-xs shadow-xs font-medium'
                          : 'bg-white dark:bg-[#1A202C] text-[#18181B] dark:text-[#E2E8F0] border border-slate-200 dark:border-slate-700/80 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {/* Rich Markdown Parser (Eliminates raw ** asterisks) */}
                      <FormattedChatMessage text={msg.text} />

                      {/* Code Block if any */}
                      {msg.codeSnippet && (
                        <div className="mt-2 rounded-xl bg-[#0F1319] p-2.5 text-emerald-300 font-mono text-[11px] overflow-x-auto relative">
                          <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5">
                            <span>Script / Query</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.codeSnippet!, msg.id)}
                              className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                            >
                              {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedId === msg.id ? 'Tersalin' : 'Salin'}</span>
                            </button>
                          </div>
                          <pre>
                            <code>{msg.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className={`text-[9px] text-slate-400 font-mono px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-slate-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0D3830] dark:bg-emerald-600 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-2xl text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1">AI sedang berpikir & menyusun jawaban...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 6. Input Footer */}
            <div className="p-2.5 px-3 bg-[#FAFBFD] dark:bg-[#181D28] border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan atau kendala kodingan Anda..."
                  className="flex-1 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161F] px-3.5 py-1.5 text-xs text-[#18181B] dark:text-[#F1F5F9] placeholder-slate-400 focus:border-[#0D3830] dark:focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D3830] dark:bg-emerald-600 hover:bg-[#082822] text-white disabled:opacity-40 transition shadow-xs cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
