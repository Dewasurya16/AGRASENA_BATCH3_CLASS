const cron = require('node-cron')

/**
 * Konfigurasi Akses Resmi Zoom Tatap Muka Online (TMO) Angkatan 3 Agrasena
 */
const ZOOM_CONFIG = {
  angkatan: 3,
  batchName: 'Agrasena Batch 3 Kejaksaan RI',
  meetingIdDisplay: '980 1123 8540',
  meetingId: '98011238540',
  passcode: 'Biropeg-24',
  joinUrl: 'https://zoom.us/j/98011238540',
  lmsUrl: 'https://pengembangan.kejaksaan.go.id/dashboard',
  portalUrl: 'https://agrasena-batch-3-class.vercel.app',
}

/**
 * Kalender Kurikulum 35 Hari Diklat Fungsional Prakom
 */
const CURRICULUM_DAYS = [
  // TAHAP 1: MOOC (Hari 1 - 5)
  { day: 1, stage: 'Tahap 1 • MOOC', date: '2026-08-24' },
  { day: 2, stage: 'Tahap 1 • MOOC', date: '2026-08-25' },
  { day: 3, stage: 'Tahap 1 • MOOC', date: '2026-08-26' },
  { day: 4, stage: 'Tahap 1 • MOOC', date: '2026-08-27' },
  { day: 5, stage: 'Tahap 1 • MOOC', date: '2026-08-28' },

  // TAHAP 2: TMO (Hari 6 - 15)
  { day: 6, stage: 'Tahap 2 • TMO', date: '2026-08-31' },
  { day: 7, stage: 'Tahap 2 • TMO', date: '2026-09-01' },
  { day: 8, stage: 'Tahap 2 • TMO', date: '2026-09-02' },
  { day: 9, stage: 'Tahap 2 • TMO', date: '2026-09-03' },
  { day: 10, stage: 'Tahap 2 • TMO', date: '2026-09-04' },
  { day: 11, stage: 'Tahap 2 • TMO', date: '2026-09-07' },
  { day: 12, stage: 'Tahap 2 • TMO', date: '2026-09-08' },
  { day: 13, stage: 'Tahap 2 • TMO', date: '2026-09-09' },
  { day: 14, stage: 'Tahap 2 • TMO', date: '2026-09-10' },
  { day: 15, stage: 'Tahap 2 • TMO', date: '2026-09-11' },

  // TAHAP 3: Lab Prakom (Hari 16 - 30)
  { day: 16, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-14' },
  { day: 17, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-15' },
  { day: 18, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-16' },
  { day: 19, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-17' },
  { day: 20, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-18' },
  { day: 21, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-21' },
  { day: 22, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-22' },
  { day: 23, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-23' },
  { day: 24, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-24' },
  { day: 25, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-25' },
  { day: 26, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-28' },
  { day: 27, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-29' },
  { day: 28, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-30' },
  { day: 29, stage: 'Tahap 3 • Lab Prakom', date: '2026-10-01' },
  { day: 30, stage: 'Tahap 3 • Lab Prakom', date: '2026-10-02' },

  // TAHAP 4: Seminar (Hari 31 - 35)
  { day: 31, stage: 'Tahap 4 • Seminar', date: '2026-10-05' },
  { day: 32, stage: 'Tahap 4 • Seminar', date: '2026-10-06' },
  { day: 33, stage: 'Tahap 4 • Seminar', date: '2026-10-07' },
  { day: 34, stage: 'Tahap 4 • Seminar', date: '2026-10-08' },
  { day: 35, stage: 'Tahap 4 • Seminar', date: '2026-10-09' },
]

/**
 * Untaian Motivasi Pagi
 */
const MORNING_QUOTES = [
  'Kecakapan teknologi adalah lentera transformasi. Setiap baris ilmu yang dipelajari hari ini adalah langkah nyata memajukan SPBE Kejaksaan RI.',
  'Ilmu tanpa integritas laksana kompas tanpa arah. Jadilah insan Prakom Adhyaksa yang cerdas, tangguh, dan berintegritas tinggi.',
  'Transformasi digital berawal dari komitmen insan aparatur dalam memberikan pelayanan hukum yang transparan dan akuntabel.',
  'Keberhasilan besar tersusun dari ketekunan harian. Awali pagi ini dengan rasa syukur, fokus, dan semangat menyerap ilmu dari Widyaiswara.',
  'Teruslah mengasah keahlian. Di tangan rekan-rekan sekalian, keandalan sistem informasi Kejaksaan Agung RI dipercayakan.',
]

/**
 * Untaian Motivasi Penutup & Tugas Sore
 */
const CLOSING_QUOTES = [
  'Ilmu yang dipelajari baru akan berakar kuat saat diwujudkan dalam analisis dan kerja nyata. Selamat beristirahat sejenak, lalu luangkan waktu menuntaskan tugas mandiri dengan teliti dan penuh dedikasi.',
  'Penugasan mandiri adalah cermin profesionalisme dan kesiapan rekan-rekan sebagai arsitek digital Kejaksaan RI. Kerjakan dengan sepenuh hati.',
  'Kedisiplinan menyelesaikan tugas tepat waktu adalah cerminan integritas abdi negara. Manfaatkan waktu malam dengan bijak dan raih hasil terbaik.',
  'Setiap tantangan teknis yang berhasil dituntaskan hari ini adalah bekal berharga bagi satuan kerja masing-masing. Tetap semangat!',
]

// =========================================================================
// ANTI-SPAM & DATE HELPERS
// =========================================================================
let lastScheduleSentDate = null
let lastClosingSentDate = null

function formatIndonesianDate(date = new Date()) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]
  const d = new Date(date)
  const dayName = days[d.getDay()]
  const dayDate = d.getDate()
  const monthName = months[d.getMonth()]
  const year = d.getFullYear()
  return `${dayName}, ${dayDate < 10 ? '0' + dayDate : dayDate} ${monthName} ${year}`
}

function getJakartaDateStr(date = new Date()) {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
}

function getDiklatDayInfo(date = new Date()) {
  const dateStr = getJakartaDateStr(date)
  const found = CURRICULUM_DAYS.find((c) => c.date === dateStr)
  if (found) return found

  const d = new Date(date)
  const dayOfWeek = d.getDay()
  return {
    day: null,
    stage: 'Hari Libur / Akhir Pekan',
    date: dateStr,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
  }
}

/**
 * Memeriksa apakah waktu saat ini di zona waktu WIB (Asia/Jakarta)
 * sudah mencapai atau melewati pukul 15:00 WIB (jam 3 sore WIB).
 */
function isPastAfternoonCutoff(date = new Date()) {
  try {
    const jakartaTimeStr = date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
    const [hour] = jakartaTimeStr.split(':').map(Number)
    return hour >= 15
  } catch {
    const utcHours = date.getUTCHours()
    const wibHours = (utcHours + 7) % 24
    return wibHours >= 15
  }
}

/**
 * Mencari hari diklat aktif berikutnya dalam kalender (melewati akhir pekan / libur).
 */
function getNextActiveDiklatDay(startDate = new Date()) {
  const cur = new Date(startDate)
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(cur)
    nextDate.setDate(nextDate.getDate() + i)
    const dayInfo = getDiklatDayInfo(nextDate)
    if (dayInfo.day && !dayInfo.isWeekend) {
      return { date: nextDate, dayInfo }
    }
  }
  return null
}

/**
 * Menghitung timestamp batas akhir tugas (23:59:59 WIB pada hari tenggat waktu).
 * Sesuai dengan kalkulasi pada website kelas (src/lib/utils.ts).
 */
function getTaskDeadlineTimestamp(dueDateStr) {
  if (!dueDateStr) return 0
  const d = new Date(dueDateStr)
  let datePart = ''
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    datePart = formatter.format(d)
  } catch {
    const match = String(dueDateStr).match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) datePart = match[0]
  }

  if (datePart) {
    const [y, m, day] = datePart.split('-').map(Number)
    const targetUTC = new Date(Date.UTC(y, m - 1, day, 16, 59, 59, 999))
    return targetUTC.getTime()
  }

  const fallback = new Date(dueDateStr)
  fallback.setHours(23, 59, 59, 999)
  return fallback.getTime()
}

/**
 * Format sisa waktu tenggat tugas dalam bahasa Indonesia (countdown)
 */
function formatRemainingTime(deadlineMs, now = Date.now()) {
  const diffMs = deadlineMs - now
  if (diffMs <= 0) return 'Tenggat telah berakhir'
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days} hari ${hours > 0 ? hours + ' jam ' : ''}lagi`
  }
  if (hours > 0) {
    return `${hours} jam ${minutes > 0 ? minutes + ' menit ' : ''}lagi`
  }
  return `${Math.max(1, minutes)} menit lagi`
}

async function loadNotificationHistory(supabase) {
  if (!supabase) return
  try {
    const { data } = await supabase.from('wa_bot_config').select('value').eq('key', 'notification_history').single()
    if (data?.value) {
      lastScheduleSentDate = data.value.last_schedule_sent_date || null
      lastClosingSentDate = data.value.last_closing_sent_date || null
    }
  } catch {}
}

async function saveNotificationHistory(supabase, update) {
  if (!supabase) return
  try {
    const { data } = await supabase.from('wa_bot_config').select('value').eq('key', 'notification_history').single()
    const current = data?.value || {}
    const updated = { ...current, ...update, updated_at: new Date().toISOString() }
    await supabase.from('wa_bot_config').upsert(
      {
        key: 'notification_history',
        value: updated,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
  } catch {}
}

// =========================================================================
// 1. DATE QUERY PARSER (UNTUK CEK JADWAL PER TANGGAL / HARI KE-N)
// =========================================================================

function parseDateQuery(query) {
  if (!query || typeof query !== 'string') {
    return { success: true, date: new Date(), queryType: 'today' }
  }

  const str = query.trim().toLowerCase()
  if (!str || str === 'hari ini' || str === 'today') {
    return { success: true, date: new Date(), queryType: 'today' }
  }

  if (str === 'besok' || str === 'tomorrow') {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return { success: true, date: d, queryType: 'tomorrow' }
  }

  if (str === 'kemarin' || str === 'yesterday') {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return { success: true, date: d, queryType: 'yesterday' }
  }

  // 1. Pola nomor hari diklat: "12", "hari 12", "h12", "ke-12"
  const dayMatch = str.match(/^(?:hari\s+(?:ke-?)?|h|ke-?)?(\d{1,2})$/i)
  if (dayMatch) {
    const dayNum = parseInt(dayMatch[1], 10)
    if (dayNum >= 1 && dayNum <= 35) {
      const cur = CURRICULUM_DAYS.find((c) => c.day === dayNum)
      if (cur) {
        const [y, m, d] = cur.date.split('-').map(Number)
        const targetDate = new Date(y, m - 1, d, 8, 0, 0)
        return { success: true, date: targetDate, dayNum, queryType: 'dayNumber' }
      }
    }
  }

  // 2. Pola nama bulan: "8 Sep", "8 September", "08 September 2026", "8-Sep-2026"
  const monthMap = {
    jan: 0, januari: 0,
    feb: 1, februari: 1,
    mar: 2, maret: 2,
    apr: 3, april: 3,
    mei: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    ags: 7, agust: 7, agustus: 7,
    sep: 8, sept: 8, september: 8,
    okt: 9, oktober: 9,
    nov: 10, november: 10,
    des: 11, desember: 11,
  }

  const textDateMatch = str.match(/^(\d{1,2})\s*[-/ ]\s*([a-zA-Z]+)(?:\s*[-/ ]\s*(\d{2,4}))?$/)
  if (textDateMatch) {
    const day = parseInt(textDateMatch[1], 10)
    const mStr = textDateMatch[2].toLowerCase()
    let foundMonth = null
    for (const [key, val] of Object.entries(monthMap)) {
      if (mStr.startsWith(key)) {
        foundMonth = val
        break
      }
    }
    if (foundMonth !== null && day >= 1 && day <= 31) {
      let year = textDateMatch[3] ? parseInt(textDateMatch[3], 10) : 2026
      if (year < 100) year += 2000
      const targetDate = new Date(year, foundMonth, day, 8, 0, 0)
      return { success: true, date: targetDate, queryType: 'date' }
    }
  }

  // 3. Pola numerik: "DD-MM-YYYY", "DD/MM/YYYY", "DD/MM", "YYYY-MM-DD", "DD.MM.YYYY"
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const targetDate = new Date(year, month, day, 8, 0, 0)
    return { success: true, date: targetDate, queryType: 'date' }
  }

  const ddmmyyyyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{2,4}))?$/)
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1], 10)
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1
    let year = ddmmyyyyMatch[3] ? parseInt(ddmmyyyyMatch[3], 10) : 2026
    if (year < 100) year += 2000
    const targetDate = new Date(year, month, day, 8, 0, 0)
    return { success: true, date: targetDate, queryType: 'date' }
  }

  return { success: false }
}

// =========================================================================
// 2. GENERATOR JADWAL PEMBELAJARAN (RAPI, MENARIK & TIDAK PANJANG)
// =========================================================================

async function getSessionsForDate(supabase, targetDate, dayInfo) {
  if (!supabase) return []
  let sessions = []
  try {
    const { data: allSchedules } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      if (dayInfo && dayInfo.day) {
        sessions = allSchedules.filter((s) => {
          const title = s.subject_name || s.title || ''
          return title.toLowerCase().includes(`[hari ${dayInfo.day}]`)
        })
      }

      if (sessions.length === 0) {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const currentDayName = dayNames[new Date(targetDate).getDay()]
        sessions = allSchedules.filter((s) => (s.day || '').toLowerCase() === currentDayName.toLowerCase())
      }
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil jadwal:', e.message)
  }
  return sessions
}

function formatSessionsText(sessions, dayInfo) {
  let text = ''
  if (!sessions || sessions.length === 0) {
    text += `• Sesi pembelajaran berlangsung sesuai kurikulum *${dayInfo?.stage || 'Pusdiklat'}*.\n`
  } else {
    sessions.forEach((s) => {
      let cleanTitle = (s.subject_name || s.title || 'Mata Diklat').replace(/\[Hari\s+\d+\]\s*/i, '').trim()
      const timeStr = s.start_time && s.end_time
        ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)} WIB`
        : s.time_slot || '08:00 WIB'
      const lecturer = s.lecturer || 'Widyaiswara Pusdiklat'

      text += `• *${timeStr}* — ${cleanTitle}\n`
      text += `  👤 ${lecturer}\n`
    })
  }
  return text
}

async function getActiveDeadlineTasks(supabase) {
  if (!supabase) return []
  const now = Date.now()
  let tasks = []
  try {
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('due_date', { ascending: true })

    if (dbTasks && dbTasks.length > 0) {
      tasks = dbTasks.filter((t) => {
        const status = (t.status || '').toLowerCase().trim()
        // Jangan tampilkan yang berstatus selesai
        if (status === 'completed' || status === 'selesai' || status === 'done') return false
        // Cukup tampilkan yang masih ada deadline saja (belum lewat batas waktu)
        if (!t.due_date) return false
        const deadlineMs = getTaskDeadlineTimestamp(t.due_date)
        return deadlineMs > now
      })
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil tugas:', e.message)
  }
  return tasks
}

function formatTasksText(tasks) {
  const now = Date.now()
  let text = ''
  if (!tasks || tasks.length === 0) {
    text += `📝 *Status Penugasan Mandiri:*\n`
    text += `Saat ini *tidak ada tugas aktif* yang memiliki tenggat waktu berjalan (semua tugas telah selesai atau melewati batas waktu). Selamat beristirahat! 🎉\n\n`
  } else {
    text += `📝 *Tugas Mandiri Aktif (Masih Ada Deadline):*\n\n`
    tasks.forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadlineMs = getTaskDeadlineTimestamp(t.due_date)
      const formattedDueDate = formatIndonesianDate(t.due_date)
      const remainingStr = formatRemainingTime(deadlineMs, now)
      const desc = t.description ? t.description.slice(0, 90).replace(/\r?\n/g, ' ') : ''

      text += `*${i + 1}. ${taskTitle}*\n`
      text += `   ⏳ Tenggat: *${formattedDueDate} (23:59 WIB)* • _(${remainingStr})_\n`
      if (desc) {
        text += `   📄 _${desc}..._\n`
      }
      text += `\n`
    })

    text += `📤 *Pengumpulan Tugas:*\n`
    text += `Unggah laporan (PDF) melalui LMS Kejaksaan:\n`
    text += `👉 ${ZOOM_CONFIG.lmsUrl}\n\n`
  }
  return text
}

async function generateScheduleMessage(supabase, date = new Date(), options = {}) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)
  const { isMorningCron = false } = options

  let msg = isMorningCron
    ? `🔔 *REMINDER KELAS PAGI & JADWAL PEMBELAJARAN*\n`
    : `🏛️ *JADWAL PEMBELAJARAN*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
    if (dayInfo.stage) msg += ` (${dayInfo.stage})`
  }
  msg += `\n────────────────────────\n\n`

  if (isMorningCron) {
    const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % MORNING_QUOTES.length : 0
    msg += `✨ _"${MORNING_QUOTES[quoteIndex]}"_\n\n`
    if (!dayInfo.isWeekend && dayInfo.day) {
      msg += `⏰ *Waktu Siaga:* Pukul *07:40 WIB*\n`
      msg += `📌 _Pengingat persiapan kelas: Sesi tatap muka dimulai sebentar lagi. Mohon rekan-rekan bersiap di Zoom & mengisi presensi harian._\n\n`
    }
  }

  if (dayInfo.isWeekend || !dayInfo.day) {
    msg += `☕ *Agenda:*\n`
    msg += `Hari libur pembelajaran tatap muka. Selamat beristirahat!\n\n`
    msg += `🎥 *Akses Zoom & Materi:*\n`
    msg += `Buka Portal Kelas 👉 ${ZOOM_CONFIG.portalUrl}\n\n`
    msg += `────────────────────────\n`
    msg += `💡 *Petunjuk Perintah:*\n`
    msg += `• *!jadwal besok* — Jadwal esok hari\n`
    msg += `• *!jadwal <tgl/hari>* — Cth: *!jadwal 8 Sep* atau *!jadwal 12*\n`
    msg += `• *!tugas* — Cek tugas | *!help* — Menu panduan`
    return { text: msg, count: 0, dayInfo }
  }

  // Ambil Jadwal Sesi dari Database
  const sessions = await getSessionsForDate(supabase, date, dayInfo)

  msg += `📚 *Mata Diklat:*\n`
  msg += formatSessionsText(sessions, dayInfo)

  // AKSES ZOOM: HANYA LINK PORTAL KELAS
  msg += `\n🎥 *Akses Ruang Zoom:*\n`
  msg += `Tautan Zoom resmi dapat dibuka via Portal Kelas:\n`
  msg += `👉 ${ZOOM_CONFIG.portalUrl}\n\n`

  msg += `────────────────────────\n`
  msg += `💡 *Petunjuk Perintah:*\n`
  msg += `• *!jadwal besok* — Jadwal esok hari\n`
  msg += `• *!jadwal <tgl/hari>* — Cth: *!jadwal 8 Sep* atau *!jadwal 12*\n`
  msg += `• *!tugas* — Cek tugas mandiri | *!help* — Menu panduan`

  return { text: msg, count: sessions.length, dayInfo }
}

async function generateDailyScheduleMessage(supabase, date = new Date(), options = {}) {
  const isAfternoon = isPastAfternoonCutoff(date)

  // KETIKA SUDAH MELEWATI JAM 3 SORE WIB (15:00 WIB):
  // Otomatis tampilkan status kelas hari ini telah selesai,
  // tampilkan "DIKLAT LANJUT BESOK", dan berikan rincian jadwal pembelajaran besok!
  if (isAfternoon && !options.isMorningCron && !options.forceToday) {
    const todayInfo = getDiklatDayInfo(date)
    const todayFormatted = formatIndonesianDate(date)

    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowInfo = getDiklatDayInfo(tomorrow)
    const tomorrowFormatted = formatIndonesianDate(tomorrow)

    let msg = `🏁 *SESI DIKLAT HARI INI TELAH SELESAI (15:00 WIB)*\n`
    msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
    msg += `📅 ${todayFormatted}`
    if (todayInfo.day) {
      msg += ` | Hari ke-${todayInfo.day}`
      if (todayInfo.stage) msg += ` (${todayInfo.stage})`
    }
    msg += `\n────────────────────────\n\n`
    msg += `Alhamdulillah, sesi pembelajaran tatap muka hari ini telah selesai pada pukul *15:00 WIB*. Selamat beristirahat sejenak rekan-rekan sekalian! 👏\n\n`

    msg += `⏩ *DIKLAT LANJUT BESOK:*\n`
    msg += `📅 ${tomorrowFormatted}`
    if (tomorrowInfo.day) {
      msg += ` | Hari ke-${tomorrowInfo.day}`
      if (tomorrowInfo.stage) msg += ` (${tomorrowInfo.stage})`
    }
    msg += `\n────────────────────────\n\n`

    if (tomorrowInfo.isWeekend || !tomorrowInfo.day) {
      msg += `☕ *Agenda Besok:*\n`
      msg += `Hari libur pembelajaran tatap muka (Akhir Pekan). Selamat beristirahat bersama keluarga!\n\n`

      const nextActive = getNextActiveDiklatDay(date)
      if (nextActive) {
        msg += `📌 *Pembelajaran Tatap Muka Berlanjut Pada:*\n`
        msg += `📅 *${formatIndonesianDate(nextActive.date)}* | Hari ke-${nextActive.dayInfo.day} (${nextActive.dayInfo.stage})\n\n`

        const nextSessions = await getSessionsForDate(supabase, nextActive.date, nextActive.dayInfo)
        msg += `📚 *Mata Diklat:*\n`
        msg += formatSessionsText(nextSessions, nextActive.dayInfo)
      }
    } else {
      const tomorrowSessions = await getSessionsForDate(supabase, tomorrow, tomorrowInfo)
      msg += `📚 *Mata Diklat Besok:*\n`
      msg += formatSessionsText(tomorrowSessions, tomorrowInfo)

      msg += `\n⏰ *Waktu Siaga Besok:* Pukul *07:40 WIB*\n`
      msg += `📌 _Pengingat persiapan kelas: Mohon rekan-rekan bersiap di Zoom & mengisi presensi harian tepat waktu esok pagi._\n`
    }

    msg += `\n🎥 *Akses Ruang Zoom:*\n`
    msg += `Tautan Zoom resmi dapat dibuka via Portal Kelas:\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}\n\n`

    msg += `────────────────────────\n`
    msg += `💡 *Petunjuk Perintah:*\n`
    msg += `• *!jadwal hari ini* — Tetap ingin melihat rekapan jadwal hari ini\n`
    msg += `• *!jadwal <tgl/hari>* — Cth: *!jadwal 11 Sep* atau *!jadwal 15*\n`
    msg += `• *!tugas* — Cek tugas mandiri aktif | *!help* — Menu panduan`

    return { text: msg, count: 0, dayInfo: todayInfo, tomorrowInfo, isAfterCutoff: true }
  }

  return generateScheduleMessage(supabase, date, options)
}

async function generateTomorrowScheduleMessage(supabase, date = new Date()) {
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return generateScheduleMessage(supabase, tomorrow, { isManualQuery: true })
}

async function generateScheduleForQuery(supabase, query) {
  const parsed = parseDateQuery(query)
  if (!parsed.success) {
    let msg = `⚠️ *Format Tanggal Belum Sesuai*\n`
    msg += `────────────────────────\n`
    msg += `Gunakan format berikut:\n`
    msg += `• *!jadwal 8 Sep* atau *!jadwal 10 September*\n`
    msg += `• *!jadwal 12* (Cek jadwal Diklat Hari ke-12)\n`
    msg += `• *!jadwal 08-09-2026* atau *!jadwal 8/9*\n`
    msg += `• *!jadwal besok* (Jadwal esok hari)\n\n`
    msg += `💡 _Ketik *!jadwal* tanpa tanggal untuk melihat jadwal hari ini._`
    return { text: msg, count: 0, error: true }
  }

  // Jika queryType adalah 'today' dan waktu sudah lewat 15:00 WIB:
  // Tampilkan jadwal hari ini dengan catatan bahwa kelas sudah selesai dan diklat lanjut besok
  if (parsed.queryType === 'today' && isPastAfternoonCutoff()) {
    const result = await generateScheduleMessage(supabase, parsed.date, { isManualQuery: true, forceToday: true })
    const note = `💡 _Catatan: Sesi tatap muka hari ini sudah selesai pukul 15:00 WIB. Diklat lanjut besok (Ketik *!jadwal* atau *!jadwal besok*)._\n\n`
    return { ...result, text: note + result.text }
  }

  return generateScheduleMessage(supabase, parsed.date, { isManualQuery: true })
}

// =========================================================================
// 3. PENUTUP SORE & PENGINGAT TUGAS MANDIRI AKTIF
// =========================================================================

async function generateClosingAndTaskMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  let msg = `🏁 *NOTIFIKASI KELAS SELESAI & TUGAS MANDIRI*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % CLOSING_QUOTES.length : 0
  msg += `✨ _"${CLOSING_QUOTES[quoteIndex]}"_\n\n`

  msg += `Alhamdulillah, sesi pembelajaran tatap muka hari ini telah selesai pada pukul *15:00 WIB*. Selamat beristirahat sejenak dan melanjutkan aktivitas rekan-rekan sekalian! 👏\n\n`

  // 1. DIKLAT LANJUT BESOK (JADWAL ESOK HARI)
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowInfo = getDiklatDayInfo(tomorrow)
  const tomorrowFormatted = formatIndonesianDate(tomorrow)

  msg += `⏩ *DIKLAT LANJUT BESOK:*\n`
  msg += `📅 ${tomorrowFormatted}`
  if (tomorrowInfo.day) {
    msg += ` | Hari ke-${tomorrowInfo.day}`
    if (tomorrowInfo.stage) msg += ` (${tomorrowInfo.stage})`
  }
  msg += `\n────────────────────────\n`

  if (tomorrowInfo.isWeekend || !tomorrowInfo.day) {
    msg += `☕ *Agenda Besok:*\n`
    msg += `Hari libur pembelajaran tatap muka (Akhir Pekan). Selamat beristirahat bersama keluarga!\n\n`

    const nextActive = getNextActiveDiklatDay(date)
    if (nextActive) {
      msg += `📌 *Pembelajaran Tatap Muka Berlanjut Pada:*\n`
      msg += `📅 *${formatIndonesianDate(nextActive.date)}* | Hari ke-${nextActive.dayInfo.day} (${nextActive.dayInfo.stage})\n\n`
    }
  } else {
    const tomorrowSessions = await getSessionsForDate(supabase, tomorrow, tomorrowInfo)
    msg += `📚 *Mata Diklat Besok:*\n`
    msg += formatSessionsText(tomorrowSessions, tomorrowInfo)
    msg += `\n⏰ *Waktu Siaga Besok:* Pukul *07:40 WIB*\n\n`
  }

  msg += `────────────────────────\n\n`

  // 2. TUGAS MANDIRI AKTIF (HANYA YANG BELUM SELESAI & MASIH ADA DEADLINE)
  const tasks = await getActiveDeadlineTasks(supabase)
  msg += formatTasksText(tasks)

  msg += `────────────────────────\n`
  msg += `💡 *Petunjuk Perintah:*\n`
  msg += `• *!jadwal besok* — Jadwal esok hari\n`
  msg += `• *!jadwal <tgl/hari>* — Cth: *!jadwal 11 Sep*\n`
  msg += `• *!tugas* — Cek tugas mandiri aktif\n`
  msg += `• *!help* — Menu panduan lengkap`

  return { text: msg, count: tasks.length, dayInfo }
}

/**
 * Generator Khusus Perintah !tugas (Menampilkan Tugas yang Masih Ada Deadline)
 */
async function generateTaskListMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  let msg = `📝 *DAFTAR TUGAS MANDIRI AKTIF*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  // HANYA AMBIL TUGAS YANG BELUM SELESAI & MASIH ADA DEADLINE AKTIF
  const tasks = await getActiveDeadlineTasks(supabase)
  msg += formatTasksText(tasks)

  msg += `────────────────────────\n`
  msg += `💡 *Petunjuk Perintah:*\n`
  msg += `• *!jadwal* — Cek jadwal pembelajaran\n`
  msg += `• *!modul* — Cari modul & materi diklat\n`
  msg += `• *!help* — Menu panduan lengkap`

  return { text: msg, count: tasks.length }
}

// =========================================================================
// 4. DISPATCHERS DENGAN ANTI-SPAM (HANYA 1X SEHARI)
// =========================================================================

async function sendScheduleNotification(sock, supabase, targetJid, { force = false, isMorningCron = true } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  if (!force && lastScheduleSentDate === todayStr) {
    console.log(`[Anti-Spam] Jadwal pagi (${todayStr}) sudah pernah terkirim. Melewati agar tidak spam.`)
    return { success: true, skipped: true, message: 'Jadwal hari ini sudah terkirim.' }
  }

  try {
    const { text, count } = await generateDailyScheduleMessage(supabase, new Date(), { isMorningCron })
    await sock.sendMessage(targetJid, { text })

    lastScheduleSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_schedule_sent_date: todayStr,
      last_schedule_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil kirim notifikasi pengingat kelas pagi ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal kirim jadwal:', err)
    return { success: false, error: err.message }
  }
}

async function sendTaskNotification(sock, supabase, targetJid, { force = false } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  if (!force && lastClosingSentDate === todayStr) {
    console.log(`[Anti-Spam] Penutup kelas & tugas sore (${todayStr}) sudah pernah terkirim. Melewati agar tidak spam.`)
    return { success: true, skipped: true, message: 'Penutup kelas sore sudah terkirim.' }
  }

  try {
    const { text, count } = await generateClosingAndTaskMessage(supabase)
    await sock.sendMessage(targetJid, { text })

    lastClosingSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_closing_sent_date: todayStr,
      last_closing_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil kirim notifikasi kelas selesai & tugas ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal kirim penutup kelas:', err)
    return { success: false, error: err.message }
  }
}

// =========================================================================
// 5. CRON INITIALIZER
// =========================================================================

function initScheduler(getSock, supabase, getTargetJid) {
  const scheduleCron = process.env.SCHEDULE_REMINDER_CRON || '40 7 * * *'
  const taskCron = process.env.TASK_REMINDER_CRON || '0 15 * * *'
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'

  console.log(`[Scheduler] Memasang cron pengingat kelas pagi: '${scheduleCron}' (Jam 07:40 WIB, Timezone: ${timezone})`)
  console.log(`[Scheduler] Memasang cron notifikasi kelas selesai: '${taskCron}' (Jam 15:00 WIB, Timezone: ${timezone})`)

  loadNotificationHistory(supabase)

  // 1. Cron Pagi 07:40 WIB
  cron.schedule(
    scheduleCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan pengingat jadwal & kelas pagi (07:40 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendScheduleNotification(sock, supabase, targetJid, { force: false, isMorningCron: true })
      }
    },
    { timezone }
  )

  // 2. Cron Sore 15:00 WIB
  cron.schedule(
    taskCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan notifikasi kelas selesai & tugas sore (15:00 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendTaskNotification(sock, supabase, targetJid, { force: false })
      }
    },
    { timezone }
  )
}

// =========================================================================
// 6. PROGRES DIKLAT 35 HARI & PENCARIAN MODUL
// =========================================================================

function generateProgressMessage() {
  const dayInfo = getDiklatDayInfo(new Date())
  const fullDateFormatted = formatIndonesianDate(new Date())
  const totalDays = 35
  const dayNum = dayInfo.day || 11
  const pct = ((dayNum / totalDays) * 100).toFixed(1)
  const barLen = 12
  const filled = Math.min(barLen, Math.max(1, Math.round((dayNum / totalDays) * barLen)))
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled)
  const sisa = Math.max(0, totalDays - dayNum)

  let nextStageInfo = 'Tahap 3 • Lab Prakom (Mulai 14 Sep 2026)'
  if (dayNum > 15 && dayNum <= 30) {
    nextStageInfo = 'Tahap 4 • Seminar Proyek (Mulai 05 Okt 2026)'
  } else if (dayNum > 30) {
    nextStageInfo = 'Penyusunan Laporan Akhir & Penutupan Diklat'
  }

  let msg = `📊 *PROGRES DIKLAT AGRASENA BATCH 3*\n`
  msg += `*Kejaksaan Republik Indonesia*\n`
  msg += `📅 ${fullDateFormatted}\n`
  msg += `────────────────────────\n\n`
  msg += `• *Hari Pelatihan:* Ke-${dayNum} dari ${totalDays} Hari Kerja\n`
  msg += `• *Progres Angkatan:* [${bar}] *${pct}%*\n`
  msg += `• *Tahap Saat Ini:* ${dayInfo.stage || 'Tahap 2 • TMO'}\n`
  msg += `• *Tahap Selanjutnya:* ${nextStageInfo}\n`
  msg += `• *Sisa Pelatihan:* ${sisa} hari kerja lagi\n\n`
  msg += `────────────────────────\n`
  msg += `✨ _Tetap semangat dan jaga kekompakan rekan-rekan Prakom Adhyaksa!_\n`
  msg += `🌐 *Portal Kelas:* ${ZOOM_CONFIG.portalUrl}`

  return { text: msg }
}

async function searchMaterialsMessage(supabase, query) {
  if (!supabase) {
    return { text: '⚠️ Koneksi database website belum siap.' }
  }

  const cleanQuery = (query || '').trim()

  if (!cleanQuery) {
    // Tampilkan 3 modul terbaru
    let materials = []
    try {
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      materials = data || []
    } catch {}

    let msg = `📚 *PUSTAKA MODUL DIKLAT (120 JP)*\n`
    msg += `*Diklat Prakom Batch 3 • Agrasena*\n`
    msg += `────────────────────────\n\n`
    msg += `Beberapa materi pembelajaran tersedia:\n\n`

    if (materials.length > 0) {
      materials.forEach((m, idx) => {
        const sizeStr = m.file_size ? ` | ${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : ''
        msg += `*${idx + 1}. ${m.title}*\n`
        msg += `   📁 ${m.subject_name || 'Modul Pembelajaran'}${sizeStr}\n`
      })
      msg += `\n`
    }

    msg += `────────────────────────\n`
    msg += `💡 *Tips:* Ketik *!modul <kata kunci>* untuk mencari spesifik.\n`
    msg += `   _Contoh:_ *!modul lms* atau *!modul jarkom*\n`
    msg += `🌐 *Pustaka Lengkap:* ${ZOOM_CONFIG.portalUrl}/materials`
    return { text: msg }
  }

  // Cari di database Supabase
  let results = []
  try {
    const { data } = await supabase
      .from('materials')
      .select('*')
      .or(`title.ilike.%${cleanQuery}%,subject_name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)
      .limit(4)

    results = data || []
  } catch (err) {
    console.error('[Search Materials Error]', err.message)
  }

  if (results.length === 0) {
    let msg = `📚 *MODUL TIDAK DITEMUKAN*\n`
    msg += `────────────────────────\n`
    msg += `Tidak ditemukan modul dengan kata kunci: *"${cleanQuery}"*\n\n`
    msg += `💡 _Coba gunakan kata kunci lain (misal: *!modul lms*, *!modul data*, atau *!modul prakom*)._\n\n`
    msg += `🌐 *Buka Pustaka Lengkap di Portal:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}/materials`
    return { text: msg }
  }

  let msg = `📚 *HASIL PENCARIAN MODUL*\n`
  msg += `Kata kunci: *"${cleanQuery}"*\n`
  msg += `────────────────────────\n\n`

  results.forEach((m, idx) => {
    const sizeStr = m.file_size ? ` | ${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : ''
    msg += `*${idx + 1}. ${m.title}*\n`
    msg += `   📁 ${m.subject_name || 'Modul'}${sizeStr}\n`
  })

  msg += `\n────────────────────────\n`
  msg += `📖 *Unduh / Baca Modul Lengkap di Portal:*\n`
  msg += `👉 ${ZOOM_CONFIG.portalUrl}/materials`

  return { text: msg }
}

// =========================================================================
// 7. PENGUMUMAN RESMI DIKLAT
// =========================================================================

async function generateAnnouncementMessage(supabase) {
  if (!supabase) {
    return { text: '⚠️ Koneksi database website belum siap.' }
  }

  let announcements = []
  try {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(2)

    announcements = data || []
  } catch (err) {
    console.error('[Announcement Fetch Error]', err.message)
  }

  if (announcements.length === 0) {
    let msg = `📢 *PENGUMUMAN KELAS AGRASENA BATCH 3*\n`
    msg += `*Kejaksaan Republik Indonesia*\n`
    msg += `────────────────────────\n\n`
    msg += `Saat ini belum ada pengumuman baru dari panitia atau widyaiswara.\n\n`
    msg += `🌐 *Portal Pengumuman:* ${ZOOM_CONFIG.portalUrl}/announcements`
    return { text: msg }
  }

  let msg = `📢 *PENGUMUMAN RESMI DIKLAT*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena*\n`
  msg += `────────────────────────\n\n`

  announcements.forEach((a, idx) => {
    const dateFormatted = formatIndonesianDate(a.created_at)
    const authorStr = a.author ? `👤 ${a.author} | ` : ''
    let cleanContent = (a.content || '').replace(/\r?\n/g, ' ').trim()
    if (cleanContent.length > 160) {
      cleanContent = cleanContent.slice(0, 160) + '...'
    }

    msg += `*${idx + 1}. ${a.title}*\n`
    msg += `   ${authorStr}📅 ${dateFormatted}\n`
    if (cleanContent) {
      msg += `   _${cleanContent}_\n`
    }
    msg += `\n`
  })

  msg += `────────────────────────\n`
  msg += `📖 *Baca Pengumuman Selengkapnya di Portal:*\n`
  msg += `👉 ${ZOOM_CONFIG.portalUrl}/announcements`

  return { text: msg }
}

module.exports = {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateTomorrowScheduleMessage,
  generateScheduleForQuery,
  generateClosingAndTaskMessage,
  generateTaskListMessage,
  generateProgressMessage,
  searchMaterialsMessage,
  generateAnnouncementMessage,
  parseDateQuery,
  formatIndonesianDate,
  formatRemainingTime,
  getTaskDeadlineTimestamp,
  isPastAfternoonCutoff,
  getNextActiveDiklatDay,
  CURRICULUM_DAYS,
  ZOOM_CONFIG,
}
