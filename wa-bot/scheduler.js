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
  lmsUrl: 'https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat',
  portalUrl: 'https://agrasena-batch-3-class.vercel.app',
}

/**
 * Kalender Kurikulum 35 Hari Diklat Fungsional Prakom
 */
const CURRICULUM_DAYS = [
  // TAHAP 1: MOOC (Hari 1 - 5)
  { day: 1, stage: 'Tahap 1 • MOOC', date: '2026-08-24', label: 'Senin, 24 Agu 2026' },
  { day: 2, stage: 'Tahap 1 • MOOC', date: '2026-08-25', label: 'Selasa, 25 Agu 2026' },
  { day: 3, stage: 'Tahap 1 • MOOC', date: '2026-08-26', label: 'Rabu, 26 Agu 2026' },
  { day: 4, stage: 'Tahap 1 • MOOC', date: '2026-08-27', label: 'Kamis, 27 Agu 2026' },
  { day: 5, stage: 'Tahap 1 • MOOC', date: '2026-08-28', label: 'Jumat, 28 Agu 2026' },

  // TAHAP 2: TMO (Hari 6 - 15)
  { day: 6, stage: 'Tahap 2 • TMO', date: '2026-08-31', label: 'Senin, 31 Agu 2026' },
  { day: 7, stage: 'Tahap 2 • TMO', date: '2026-09-01', label: 'Selasa, 1 Sep 2026' },
  { day: 8, stage: 'Tahap 2 • TMO', date: '2026-09-02', label: 'Rabu, 2 Sep 2026' },
  { day: 9, stage: 'Tahap 2 • TMO', date: '2026-09-03', label: 'Kamis, 3 Sep 2026' },
  { day: 10, stage: 'Tahap 2 • TMO', date: '2026-09-04', label: 'Jumat, 4 Sep 2026' },
  { day: 11, stage: 'Tahap 2 • TMO', date: '2026-09-07', label: 'Senin, 7 Sep 2026' },
  { day: 12, stage: 'Tahap 2 • TMO', date: '2026-09-08', label: 'Selasa, 8 Sep 2026' },
  { day: 13, stage: 'Tahap 2 • TMO', date: '2026-09-09', label: 'Rabu, 9 Sep 2026' },
  { day: 14, stage: 'Tahap 2 • TMO', date: '2026-09-10', label: 'Kamis, 10 Sep 2026' },
  { day: 15, stage: 'Tahap 2 • TMO', date: '2026-09-11', label: 'Jumat, 11 Sep 2026' },

  // TAHAP 3: Lab Prakom (Hari 16 - 30)
  { day: 16, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-14', label: 'Senin, 14 Sep 2026' },
  { day: 17, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-15', label: 'Selasa, 15 Sep 2026' },
  { day: 18, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-16', label: 'Rabu, 16 Sep 2026' },
  { day: 19, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-17', label: 'Kamis, 17 Sep 2026' },
  { day: 20, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-18', label: 'Jumat, 18 Sep 2026' },
  { day: 21, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-21', label: 'Senin, 21 Sep 2026' },
  { day: 22, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-22', label: 'Selasa, 22 Sep 2026' },
  { day: 23, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-23', label: 'Rabu, 23 Sep 2026' },
  { day: 24, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-24', label: 'Kamis, 24 Sep 2026' },
  { day: 25, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-25', label: 'Jumat, 25 Sep 2026' },
  { day: 26, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-28', label: 'Senin, 28 Sep 2026' },
  { day: 27, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-29', label: 'Selasa, 29 Sep 2026' },
  { day: 28, stage: 'Tahap 3 • Lab Prakom', date: '2026-09-30', label: 'Rabu, 30 Sep 2026' },
  { day: 29, stage: 'Tahap 3 • Lab Prakom', date: '2026-10-01', label: 'Kamis, 1 Okt 2026' },
  { day: 30, stage: 'Tahap 3 • Lab Prakom', date: '2026-10-02', label: 'Jumat, 2 Okt 2026' },

  // TAHAP 4: Seminar (Hari 31 - 35)
  { day: 31, stage: 'Tahap 4 • Seminar', date: '2026-10-05', label: 'Senin, 5 Okt 2026' },
  { day: 32, stage: 'Tahap 4 • Seminar', date: '2026-10-06', label: 'Selasa, 6 Okt 2026' },
  { day: 33, stage: 'Tahap 4 • Seminar', date: '2026-10-07', label: 'Rabu, 7 Okt 2026' },
  { day: 34, stage: 'Tahap 4 • Seminar', date: '2026-10-08', label: 'Kamis, 8 Okt 2026' },
  { day: 35, stage: 'Tahap 4 • Seminar', date: '2026-10-09', label: 'Jumat, 9 Okt 2026' },
]

/**
 * Koleksi Untaian Kata Motivasi Pagi yang Menginspirasi
 */
const MORNING_QUOTES = [
  'Kecakapan teknologi adalah lentera transformasi. Setiap baris ilmu yang kita pelajari hari ini adalah ikhtiar nyata memajukan penegakan hukum modern berbasis SPBE Kejaksaan Republik Indonesia.',
  'Ilmu tanpa integritas laksana kompas tanpa arah. Jadilah insan Pranata Komputer Adhyaksa yang cerdas, tangguh, dan menjunjung tinggi nilai Satya, Adhi, dan Wicaksana.',
  'Transformasi digital bukan sekadar tentang kecanggihan teknologi, melainkan tentang komitmen aparatur dalam melayani keadilan secara transparan, akuntabel, dan berwibawa.',
  'Keberhasilan besar tersusun dari ketekunan harian. Awali pagi ini dengan rasa syukur, doa, dan antusiasme menyerap setiap hikmah keilmuan dari para Widyaiswara.',
  'Teruslah mengasah keahlian dan berinovasi tanpa henti. Di tangan rekan-rekan sekalian, fondasi keandalan sistem informasi Kejaksaan RI dibentuk dan dijaga.',
]

/**
 * Koleksi Untaian Kata Penutup Sesi & Semangat Mengerjakan Tugas Sore
 */
const CLOSING_QUOTES = [
  'Ilmu yang diserap di ruang kelas baru akan berakar kuat saat diwujudkan dalam analisis dan kerja nyata. Selamat beristirahat sejenak, jaga stamina, lalu luangkan waktu untuk menyelesaikan tugas mandiri dengan teliti, cermat, dan berintegritas tinggi.',
  'Penugasan mandiri bukan sekadar lembar laporan administratif, melainkan cermin profesionalisme dan kesiapan rekan-rekan sebagai arsitek digital Kejaksaan RI. Kerjakan dengan kesungguhan hati.',
  'Kedisiplinan mengumpulkan tugas tepat waktu adalah cerminan integritas abdi negara. Manfaatkan waktu malam dengan bijak, hindari menunda, dan raih hasil belajar yang membanggakan.',
  'Setiap studi kasus dan tantangan teknis yang berhasil dituntaskan hari ini adalah bekal berharga bagi pengabdian di satuan kerja masing-masing. Tetap semangat dan pantang menyerah!',
]

// =========================================================================
// ANTI-SPAM SAFEGUARDS (Pencegah Pengiriman Duplikat)
// =========================================================================
let lastScheduleSentDate = null
let lastClosingSentDate = null

/**
 * Format tanggal dalam bahasa Indonesia formal
 */
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

/**
 * Dapatkan tanggal lokal YYYY-MM-DD zona waktu Asia/Jakarta
 */
function getJakartaDateStr(date = new Date()) {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
}

/**
 * Deteksi Hari Diklat berdasarkan tanggal berjalan
 */
function getDiklatDayInfo(date = new Date()) {
  const dateStr = getJakartaDateStr(date)
  const found = CURRICULUM_DAYS.find((c) => c.date === dateStr)
  if (found) return found

  // Jika hari Sabtu (6) atau Minggu (0)
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  return {
    day: null,
    stage: 'Hari Libur / Akhir Pekan',
    date: dateStr,
    label: formatIndonesianDate(d),
    isWeekend,
  }
}

/**
 * Sinkronisasi status pengiriman notifikasi dari Supabase (mencegah duplikat setelah restart)
 */
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

/**
 * Simpan status pengiriman notifikasi ke Supabase
 */
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
// 1. NOTIFIKASI JADWAL PEMBELAJARAN & ZOOM (PAGI - 07:00 WIB)
// =========================================================================

/**
 * Susun Pesan Jadwal Harian yang Rapi, Bersahabat, & Sarat Motivasi
 */
async function generateDailyScheduleMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const dateStr = getJakartaDateStr(date)
  const fullDateFormatted = formatIndonesianDate(date)

  // Ambil kutipan motivasi acak berdasarkan hari
  const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % MORNING_QUOTES.length : 0
  const quote = MORNING_QUOTES[quoteIndex]

  // Header Pesan
  let msg = `🏛️ *PENGINGAT JADWAL PEMBELAJARAN & SESI ZOOM*\n`
  msg += `*DIKLAT PRAKOM BATCH 3 — AGRASENA KEJAKSAAN RI*\n`
  msg += `🗓️ *${fullDateFormatted}*`
  if (dayInfo.day) {
    msg += ` | *Hari ke-${dayInfo.day} (${dayInfo.stage})*\n`
  } else {
    msg += `\n`
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

  // Untaian Motivasi Pagi
  msg += `✨ *Untaian Refleksi Pagi:*\n`
  msg += `_${quote}_\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

  // Jika Hari Libur / Akhir Pekan
  if (dayInfo.isWeekend || !dayInfo.day) {
    msg += `☕ *Pemberitahuan Agenda Hari Ini:*\n`
    msg += `Hari ini merupakan hari libur pembelajaran tatap muka. Manfaatkan waktu untuk memulihkan stamina bersama keluarga, mempelajari modul mandiri, atau menyelesaikan penugasan yang masih berjalan.\n\n`
    msg += `🌐 Portal Modul & Kelas: ${ZOOM_CONFIG.portalUrl}\n\n`
    msg += `_Selamat menikmati akhir pekan yang berkah dan menyenangkan! ✨_`
    return { text: msg, count: 0, dayInfo }
  }

  // Ambil Jadwal Sesi dari Database Supabase
  let sessions = []
  try {
    const { data: allSchedules } = await supabase.from('schedules').select('*').order('created_at', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      // 1. Cari yang memiliki tag [Hari X]
      sessions = allSchedules.filter((s) => {
        const title = s.subject_name || s.title || ''
        return title.toLowerCase().includes(`[hari ${dayInfo.day}]`)
      })

      // 2. Fallback: jika tidak ada tag [Hari X], filter berdasarkan nama hari
      if (sessions.length === 0) {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const currentDayName = dayNames[new Date(date).getDay()]
        sessions = allSchedules.filter((s) => (s.day || '').toLowerCase() === currentDayName.toLowerCase())
      }
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil jadwal:', e.message)
  }

  // Jika tidak ditemukan jadwal spesifik di DB, ambil fallback
  if (sessions.length === 0) {
    msg += `📋 *Agenda Kegiatan Pembelajaran:*\n`
    msg += `Hari ini berlangsung kegiatan pembelajaran sesuai kalender kurikulum *${dayInfo.stage}*.\n`
    msg += `Silakan periksa detail pemateri dan bahan paparan lengkap di Portal Resmi:\n`
    msg += `🌐 ${ZOOM_CONFIG.portalUrl}/schedules\n\n`
  } else {
    msg += `📋 *Rincian Agenda Mata Diklat Hari Ini:*\n\n`

    sessions.forEach((s, idx) => {
      // Bersihkan nama subject dari awalan [Hari X]
      let cleanTitle = (s.subject_name || s.title || 'Mata Diklat').replace(/\[Hari\s+\d+\]\s*/i, '').trim()
      const timeStr = s.start_time && s.end_time
        ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)} WIB`
        : s.time_slot || '08:00 - Selesai WIB'
      const lecturer = s.lecturer || 'Widyaiswara Pusdiklat'
      const room = s.room || 'Ruang Diklat LMS & Zoom'
      const meetingLink = s.meeting_link || ''

      msg += `📌 *Sesi #${idx + 1}: ${cleanTitle}*\n`
      msg += `   ⏰ Waktu: *${timeStr}*\n`
      msg += `   👨‍🏫 Pemateri: ${lecturer}\n`
      msg += `   🏛️ Ruangan: ${room}\n`
      if (meetingLink && meetingLink.startsWith('http')) {
        msg += `   🔗 Akses Materi LMS: ${meetingLink}\n`
      }
      msg += `\n`
    })
  }

  // Akses Ruang Zoom Tatap Muka Online Angkatan 3
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  msg += `🎥 *AKSES RESMI ZOOM TATAP MUKA ONLINE (ANGKATAN 3)*\n`
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  msg += `• *Meeting ID*: \`${ZOOM_CONFIG.meetingIdDisplay}\`\n`
  msg += `• *Passcode*: \`${ZOOM_CONFIG.passcode}\`\n`
  msg += `• *Tautan Langsung*: ${ZOOM_CONFIG.joinUrl}\n\n`

  // Panduan Kedisiplinan & Etika Belajar
  msg += `💡 *Pedoman Kedisiplinan Peserta:*
1. Presensi kehadiran dibuka 15 menit sebelum sesi pertama dimulai.
2. Format penamaan akun Zoom:
   *[No. Absen] - [Nama Lengkap] - [Satuan Kerja]*
3. Mohon berpakaian rapi sesuai ketentuan dan mengaktifkan kamera selama perkuliahan berlangsung.
4. Materi paparan & Pustaka Modul PDF (120 JP):
   🌐 ${ZOOM_CONFIG.portalUrl}/materials\n\n`

  msg += `_Selamat mengikuti kegiatan pembelajaran dengan penuh dedikasi dan semangat integritas! 🇮🇩_`

  return { text: msg, count: sessions.length, dayInfo }
}

/**
 * Kirim Pengingat Jadwal Hari Ini ke WhatsApp (Dilengkapi Anti-Spam)
 */
async function sendScheduleNotification(sock, supabase, targetJid, { force = false } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  // 1. Anti-Spam Check
  if (!force && lastScheduleSentDate === todayStr) {
    console.log(`[Anti-Spam] Notifikasi jadwal pagi (${todayStr}) sudah pernah dikirim hari ini. Melewati untuk mencegah spam.`)
    return { success: true, skipped: true, message: 'Notifikasi jadwal pagi sudah dikirim hari ini.' }
  }

  try {
    const { text, count } = await generateDailyScheduleMessage(supabase)
    await sock.sendMessage(targetJid, { text })

    // Simpan status pengiriman agar tidak spam
    lastScheduleSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_schedule_sent_date: todayStr,
      last_schedule_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil mengirim notifikasi jadwal pagi ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal mengirim notifikasi jadwal:', err)
    return { success: false, error: err.message }
  }
}

// =========================================================================
// 2. NOTIFIKASI PENUTUP KELAS & SEMANGAT TUGAS MANDIRI (SORE - 16:00 WIB)
// =========================================================================

/**
 * Susun Pesan Penutup Perkuliahan & Pengingat Tugas Mandiri Sore
 */
async function generateClosingAndTaskMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  const quoteIndex = dayInfo.day ? (dayInfo.day - 1) % CLOSING_QUOTES.length : 0
  const closingQuote = CLOSING_QUOTES[quoteIndex]

  let msg = `🌟 *PENUTUP PERKULIAHAN & PENGINGAT TUGAS MANDIRI*\n`
  msg += `*DIKLAT PRAKOM BATCH 3 — AGRASENA KEJAKSAAN RI*\n`
  msg += `🗓️ *${fullDateFormatted}*`
  if (dayInfo.day) {
    msg += ` | *Hari ke-${dayInfo.day} Selesai*\n`
  } else {
    msg += `\n`
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

  // Ucapan Apresiasi
  msg += `Alhamdulillah, seluruh rangkaian agenda perkuliahan hari ini telah selesai dengan baik. Terima kasih atas ketepatan waktu, atensi penuh, dan partisipasi aktif rekan-rekan peserta sekalian.\n\n`

  // Untaian Motivasi Tugas
  msg += `💬 *Pesan Penyemangat:*\n`
  msg += `_${closingQuote}_\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

  // Ambil Tugas Aktif dari Database
  let tasks = []
  try {
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('due_date', { ascending: true })

    tasks = dbTasks || []
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil data tugas:', e.message)
  }

  if (tasks.length === 0) {
    msg += `✅ *Status Penugasan Mandiri:*\n`
    msg += `Saat ini tidak ada penugasan mandiri baru yang mendesak. Selamat menikmati waktu istirahat sore bersama keluarga, menyegarkan pikiran, dan menyiapkan stamina untuk sesi perkuliahan esok hari.\n\n`
  } else {
    msg += `📝 *Daftar Penugasan Mandiri yang Sedang Berjalan:*\n\n`

    tasks.slice(0, 4).forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadline = t.due_date ? formatIndonesianDate(t.due_date) : 'Segera'
      const desc = t.description ? t.description.slice(0, 140).replace(/\r?\n/g, ' ') : ''

      msg += `*${i + 1}. ${taskTitle}*\n`
      msg += `   ⏳ Batas Waktu: *${deadline}*\n`
      if (desc) {
        msg += `   📄 _${desc}..._\n`
      }
      if (t.submission_link && t.submission_link.startsWith('http')) {
        msg += `   🔗 Tautan Unggah LMS: ${t.submission_link}\n`
      }
      msg += `\n`
    })

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `📌 *Catatan Penting Pengumpulan Tugas:*\n`
    msg += `• Pastikan format dokumen laporan sesuai ketentuan Widyaiswara (PDF, mencantumkan Nama, NIP, Satuan Kerja, & Angkatan).\n`
    msg += `• Hindari pengerjaan tergesa-gesa menjelang batas waktu agar hasil kajian komprehensif dan bebas plagiasi.\n`
    msg += `• Akses lembar kerja & unggah berkas melalui portal:\n`
    msg += `  🌐 ${ZOOM_CONFIG.portalUrl}/tasks\n\n`
  }

  msg += `_Jaga kesehatan, luangkan waktu istirahat yang cukup, dan sampai jumpa di ruang perkuliahan virtual besok pagi! ✨_\n`
  msg += `_Sistem Informasi Diklat Agrasena Batch 3 Kejaksaan RI_`

  return { text: msg, count: tasks.length, dayInfo }
}

/**
 * Kirim Pengingat Sore: Penutup & Tugas Mandiri (Dilengkapi Anti-Spam)
 */
async function sendTaskNotification(sock, supabase, targetJid, { force = false } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  // 1. Anti-Spam Check
  if (!force && lastClosingSentDate === todayStr) {
    console.log(`[Anti-Spam] Notifikasi penutup/tugas sore (${todayStr}) sudah pernah dikirim hari ini. Melewati untuk mencegah spam.`)
    return { success: true, skipped: true, message: 'Notifikasi penutup dan tugas sore sudah dikirim hari ini.' }
  }

  try {
    const { text, count } = await generateClosingAndTaskMessage(supabase)
    await sock.sendMessage(targetJid, { text })

    // Simpan status pengiriman agar tidak spam
    lastClosingSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_closing_sent_date: todayStr,
      last_closing_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil mengirim penutup perkuliahan & pengingat tugas ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal mengirim penutup perkuliahan:', err)
    return { success: false, error: err.message }
  }
}

// =========================================================================
// 3. CRON JOB SCHEDULER INITIALIZER
// =========================================================================

/**
 * Inisialisasi Otomatis Cron Scheduler Pagi & Sore
 */
function initScheduler(getSock, supabase, getTargetJid) {
  // Pagi: Senin s.d Jumat pukul 07:00 WIB
  const scheduleCron = process.env.SCHEDULE_REMINDER_CRON || '0 7 * * 1-5'
  // Sore: Senin s.d Jumat pukul 16:00 WIB (Selesai Kelas)
  const taskCron = process.env.TASK_REMINDER_CRON || '0 16 * * 1-5'
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'

  console.log(`[Scheduler] Memasang cron jadwal pagi: '${scheduleCron}' (Senin-Jumat, Timezone: ${timezone})`)
  console.log(`[Scheduler] Memasang cron penutup kelas & tugas sore: '${taskCron}' (Senin-Jumat, Timezone: ${timezone})`)

  // Muat riwayat pengiriman hari ini dari Supabase saat server menyala
  loadNotificationHistory(supabase)

  // 1. Cron Pagi: Jadwal Kuliah & Akses Zoom
  cron.schedule(
    scheduleCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan cron pengingat jadwal pagi (07:00 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendScheduleNotification(sock, supabase, targetJid, { force: false })
      } else {
        console.warn('[Scheduler Trigger] Lewati: Bot belum terhubung atau target JID belum disetel.')
      }
    },
    { timezone }
  )

  // 2. Cron Sore: Penutup Kelas & Semangat Tugas Mandiri
  cron.schedule(
    taskCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan cron penutup kelas & pengingat tugas sore (16:00 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendTaskNotification(sock, supabase, targetJid, { force: false })
      } else {
        console.warn('[Scheduler Trigger] Lewati: Bot belum terhubung atau target JID belum disetel.')
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
  generateClosingAndTaskMessage,
  formatIndonesianDate,
  ZOOM_CONFIG,
}
