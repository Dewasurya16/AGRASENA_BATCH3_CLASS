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
// 1. JADWAL HARI INI (SIMPEL, RAPI, FONT JELAS)
// =========================================================================

async function generateDailyScheduleMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % MORNING_QUOTES.length : 0
  const quote = MORNING_QUOTES[quoteIndex]

  let msg = `🏛️ *JADWAL PEMBELAJARAN HARI INI*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day} (${dayInfo.stage})`
  }
  msg += `\n────────────────────────\n\n`

  msg += `✨ _"${quote}"_\n\n`

  if (dayInfo.isWeekend || !dayInfo.day) {
    msg += `☕ *Agenda Hari Ini:*\n`
    msg += `Hari ini adalah hari libur tatap muka. Selamat beristirahat dan memulihkan stamina bersama keluarga.\n\n`
    msg += `👉 Ketik *!besok* untuk mengintip jadwal sesi berikutnya.\n`
    msg += `🌐 Portal Kelas: ${ZOOM_CONFIG.portalUrl}`
    return { text: msg, count: 0, dayInfo }
  }

  // Ambil Jadwal Sesi Hari Ini dari Database
  let sessions = []
  try {
    const { data: allSchedules } = await supabase.from('schedules').select('*').order('created_at', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      sessions = allSchedules.filter((s) => {
        const title = s.subject_name || s.title || ''
        return title.toLowerCase().includes(`[hari ${dayInfo.day}]`)
      })

      if (sessions.length === 0) {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const currentDayName = dayNames[new Date(date).getDay()]
        sessions = allSchedules.filter((s) => (s.day || '').toLowerCase() === currentDayName.toLowerCase())
      }
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil jadwal:', e.message)
  }

  msg += `📚 *Agenda Mata Diklat:*\n`
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
      msg += `  Pemateri: ${lecturer}\n`
    })
  }

  msg += `\n🎥 *Ruang Zoom Angkatan 3:*\n`
  msg += `• *ID*: \`${ZOOM_CONFIG.meetingIdDisplay}\` | *Pass*: \`${ZOOM_CONFIG.passcode}\`\n`
  msg += `• *Link*: ${ZOOM_CONFIG.joinUrl}\n\n`

  msg += `────────────────────────\n`
  msg += `👉 Ketik *!besok* untuk melihat jadwal esok hari\n`
  msg += `🌐 Portal: ${ZOOM_CONFIG.portalUrl}`

  return { text: msg, count: sessions.length, dayInfo }
}

// =========================================================================
// 2. JADWAL BESOK (OPTIONAL AGAR TIDAK SPAM DI PAGI HARI)
// =========================================================================

async function generateTomorrowScheduleMessage(supabase, date = new Date()) {
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayInfo = getDiklatDayInfo(tomorrow)
  const fullDateFormatted = formatIndonesianDate(tomorrow)

  let msg = `🏛️ *JADWAL PEMBELAJARAN BESOK*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day} (${dayInfo.stage})`
  }
  msg += `\n────────────────────────\n\n`

  if (dayInfo.isWeekend || !dayInfo.day) {
    msg += `☕ *Agenda Esok Hari:*\n`
    msg += `Besok adalah hari libur pembelajaran tatap muka. Selamat beristirahat!\n\n`
    msg += `🌐 Portal Kelas: ${ZOOM_CONFIG.portalUrl}`
    return { text: msg, count: 0, dayInfo }
  }

  // Ambil Jadwal Sesi Besok dari Database
  let sessions = []
  try {
    const { data: allSchedules } = await supabase.from('schedules').select('*').order('created_at', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      sessions = allSchedules.filter((s) => {
        const title = s.subject_name || s.title || ''
        return title.toLowerCase().includes(`[hari ${dayInfo.day}]`)
      })
    }
  } catch (e) {}

  msg += `📚 *Agenda Mata Diklat Besok:*\n`
  if (sessions.length === 0) {
    msg += `• Sesi pembelajaran tatap muka online sesuai kurikulum *${dayInfo.stage}*.\n`
  } else {
    sessions.forEach((s) => {
      let cleanTitle = (s.subject_name || s.title || 'Mata Diklat').replace(/\[Hari\s+\d+\]\s*/i, '').trim()
      const timeStr = s.start_time && s.end_time
        ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)} WIB`
        : s.time_slot || '08:00 WIB'
      const lecturer = s.lecturer || 'Widyaiswara Pusdiklat'

      msg += `• *${timeStr}* — ${cleanTitle}\n`
      msg += `  Pemateri: ${lecturer}\n`
    })
  }

  msg += `\n🎥 *Ruang Zoom Angkatan 3:*\n`
  msg += `• *ID*: \`${ZOOM_CONFIG.meetingIdDisplay}\` | *Pass*: \`${ZOOM_CONFIG.passcode}\`\n`
  msg += `• *Link*: ${ZOOM_CONFIG.joinUrl}\n\n`

  msg += `────────────────────────\n`
  msg += `🌐 Portal: ${ZOOM_CONFIG.portalUrl}`

  return { text: msg, count: sessions.length, dayInfo }
}

// =========================================================================
// 3. PENUTUP SORE & PENGINGAT TUGAS MANDIRI AKTIF/BELUM SELESAI
// =========================================================================

async function generateClosingAndTaskMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % CLOSING_QUOTES.length : 0
  const closingQuote = CLOSING_QUOTES[quoteIndex]

  let msg = `🌟 *SESI PERKULIAHAN HARI INI SELESAI*\n`
  msg += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
  msg += `📅 ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  msg += `Alhamdulillah, perkuliahan hari ini telah selesai dengan baik. Terima kasih atas atensi dan partisipasi aktif rekan-rekan peserta sekalian.\n\n`

  msg += `✨ _"${closingQuote}"_\n\n`

  // Ambil Tugas yang BELUM SELESAI & TERBARU (Maksimal 2-3 tugas terbaru)
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
    msg += `Saat ini tidak ada tugas mandiri baru yang belum selesai. Selamat menikmati waktu istirahat sore bersama keluarga! ✨\n\n`
  } else {
    msg += `📝 *Tugas Mandiri Terbaru / Belum Selesai:*\n\n`

    tasks.forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadline = t.due_date ? formatIndonesianDate(t.due_date) : 'Segera'
      const desc = t.description ? t.description.slice(0, 110).replace(/\r?\n/g, ' ') : ''

      msg += `*${i + 1}. ${taskTitle}*\n`
      msg += `   ⏳ Tenggat: *${deadline}*\n`
      if (desc) {
        msg += `   📄 _${desc}..._\n`
      }
      msg += `\n`
    })

    msg += `📤 *Pengumpulan Tugas:*\n`
    msg += `Kirim berkas laporan (PDF) melalui *LMS Pengembangan Kejaksaan RI*:\n`
    msg += `🔗 ${ZOOM_CONFIG.lmsUrl}\n\n`
  }

  msg += `────────────────────────\n`
  msg += `👉 Ketik *!besok* untuk melihat jadwal esok hari\n`
  msg += `_Semangat mengerjakan, jaga kesehatan, dan sampai jumpa besok! ✨_`

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

module.exports = {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateTomorrowScheduleMessage,
  generateClosingAndTaskMessage,
  formatIndonesianDate,
  ZOOM_CONFIG,
}
