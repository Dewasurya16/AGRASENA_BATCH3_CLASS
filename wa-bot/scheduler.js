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

async function generateScheduleMessage(supabase, date = new Date(), options = {}) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)
  const { isMorningCron = false } = options

  let msg = `🏛️ *JADWAL PEMBELAJARAN*\n`
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
  let sessions = []
  try {
    const { data: allSchedules } = await supabase.from('schedules').select('*').order('created_at', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      if (dayInfo.day) {
        sessions = allSchedules.filter((s) => {
          const title = s.subject_name || s.title || ''
          return title.toLowerCase().includes(`[hari ${dayInfo.day}]`)
        })
      }

      if (sessions.length === 0) {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const currentDayName = dayNames[new Date(date).getDay()]
        sessions = allSchedules.filter((s) => (s.day || '').toLowerCase() === currentDayName.toLowerCase())
      }
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil jadwal:', e.message)
  }

  msg += `📚 *Mata Diklat:*\n`
  if (sessions.length === 0) {
    msg += `• Sesi pembelajaran berlangsung sesuai kurikulum *${dayInfo.stage}*.\n`
  } else {
    sessions.forEach((s) => {
      let cleanTitle = (s.subject_name || s.title || 'Mata Diklat').replace(/\[Hari\s+\d+\]\s*/i, '').trim()
      const timeStr = s.start_time && s.end_time
        ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)} WIB`
        : s.time_slot || '08:00 WIB'
      const lecturer = s.lecturer || 'Widyaiswara Pusdiklat'

      msg += `• *${timeStr}* — ${cleanTitle}\n`
      msg += `  👤 ${lecturer}\n`
    })
  }

  // AKSES ZOOM: HANYA LINK PORTAL KELAS (TANPA ID / PASSCODE / LINK ZOOM LANGSUNG)
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

  return generateScheduleMessage(supabase, parsed.date, { isManualQuery: true })
}

// =========================================================================
// 3. PENUTUP SORE & PENGINGAT TUGAS MANDIRI AKTIF
// =========================================================================

async function generateClosingAndTaskMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  let msg = `🌟 *PENUTUP KELAS & TUGAS MANDIRI*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  msg += `Alhamdulillah, perkuliahan hari ini telah selesai dengan baik. Selamat beristirahat sejenak rekan-rekan sekalian! ✨\n\n`

  // Ambil Tugas yang BELUM SELESAI & TERBARU
  let tasks = []
  try {
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(3)

    tasks = dbTasks || []
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil tugas:', e.message)
  }

  if (tasks.length === 0) {
    msg += `📝 *Status Penugasan Mandiri:*\n`
    msg += `Saat ini tidak ada tugas aktif yang belum selesai. Selamat beristirahat sore bersama keluarga!\n\n`
  } else {
    msg += `📝 *Tugas Mandiri Aktif:*\n\n`

    tasks.forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadline = t.due_date ? formatIndonesianDate(t.due_date) : 'Segera'
      const desc = t.description ? t.description.slice(0, 90).replace(/\r?\n/g, ' ') : ''

      msg += `*${i + 1}. ${taskTitle}*\n`
      msg += `   ⏳ Tenggat: *${deadline}*\n`
      if (desc) {
        msg += `   📄 _${desc}..._\n`
      }
      msg += `\n`
    })

    msg += `📤 *Pengumpulan Tugas:*\n`
    msg += `Unggah laporan (PDF) melalui LMS Kejaksaan:\n`
    msg += `👉 ${ZOOM_CONFIG.lmsUrl}\n\n`
  }

  msg += `────────────────────────\n`
  msg += `💡 *Petunjuk Perintah:*\n`
  msg += `• *!jadwal besok* — Jadwal esok hari\n`
  msg += `• *!jadwal <tgl/hari>* — Cth: *!jadwal 8 Sep*\n`
  msg += `• *!help* — Menu panduan lengkap`

  return { text: msg, count: tasks.length, dayInfo }
}

// =========================================================================
// 4. DISPATCHERS DENGAN ANTI-SPAM (HANYA 1X SEHARI)
// =========================================================================

async function sendScheduleNotification(sock, supabase, targetJid, { force = false } = {}) {
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
    const { text, count } = await generateDailyScheduleMessage(supabase)
    await sock.sendMessage(targetJid, { text })

    lastScheduleSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_schedule_sent_date: todayStr,
      last_schedule_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil kirim notifikasi jadwal pagi ke ${targetJid}`)
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

    console.log(`[Scheduler] Berhasil kirim penutup kelas & tugas ke ${targetJid}`)
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
  const scheduleCron = process.env.SCHEDULE_REMINDER_CRON || '0 7 * * 1-5'
  const taskCron = process.env.TASK_REMINDER_CRON || '0 16 * * 1-5'
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'

  console.log(`[Scheduler] Memasang cron jadwal pagi: '${scheduleCron}' (Senin-Jumat, Timezone: ${timezone})`)
  console.log(`[Scheduler] Memasang cron penutup kelas & tugas sore: '${taskCron}' (Senin-Jumat, Timezone: ${timezone})`)

  loadNotificationHistory(supabase)

  // 1. Cron Pagi 07:00 WIB
  cron.schedule(
    scheduleCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan pengingat jadwal pagi (07:00 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendScheduleNotification(sock, supabase, targetJid, { force: false })
      }
    },
    { timezone }
  )

  // 2. Cron Sore 16:00 WIB
  cron.schedule(
    taskCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan penutup perkuliahan & tugas sore (16:00 WIB)...')
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

module.exports = {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateTomorrowScheduleMessage,
  generateScheduleForQuery,
  generateClosingAndTaskMessage,
  generateProgressMessage,
  searchMaterialsMessage,
  parseDateQuery,
  formatIndonesianDate,
  CURRICULUM_DAYS,
  ZOOM_CONFIG,
}
