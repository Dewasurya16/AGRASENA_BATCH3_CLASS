const cron = require('node-cron')

/**
 * Format tanggal dalam bahasa Indonesia
 */
function formatIndonesianDate(date = new Date()) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const d = new Date(date)
  const dayName = days[d.getDay()]
  const dayDate = d.getDate()
  const monthName = months[d.getMonth()]
  const year = d.getFullYear()
  return `${dayName}, ${dayDate < 10 ? '0' + dayDate : dayDate} ${monthName} ${year}`
}

/**
 * Kirim Pengingat Jadwal Hari Ini ke Grup WhatsApp
 */
async function sendScheduleNotification(sock, supabase, targetJid) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10)

    // Ambil data jadwal dari Supabase
    let query = supabase.from('schedules').select('*')
    // Cek jadwal hari ini jika ada kolom session_date atau date
    const { data: allSchedules, error } = await query.order('created_at', { ascending: true })

    if (error) {
      console.error('[Scheduler] Gagal mengambil jadwal:', error.message)
      return { success: false, error: error.message }
    }

    // Filter jadwal yang cocok dengan hari ini atau ambil sesi terdekat
    const todaySchedules = (allSchedules || []).filter((s) => {
      if (s.session_date && s.session_date.startsWith(todayStr)) return true
      if (s.date && s.date.startsWith(todayStr)) return true
      return false
    })

    const schedulesToDisplay = todaySchedules.length > 0 ? todaySchedules : (allSchedules || []).slice(0, 3)
    const isExactToday = todaySchedules.length > 0

    let message = `🏛️ *PENGINGAT JADWAL PEMBELAJARAN*\n`
    message += `*DIKLAT PRAKOM BATCH 3 — AGRASENA KEJAKSAAN RI*\n`
    message += `🗓️ Tanggal: *${formatIndonesianDate()}*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    if (isExactToday) {
      message += `Selamat pagi rekan-rekan peserta! Berikut agenda mata diklat yang berlangsung hari ini:\n\n`
    } else {
      message += `Selamat pagi rekan-rekan! Berikut agenda sesi perkuliahan aktif Diklat:\n\n`
    }

    schedulesToDisplay.forEach((item, index) => {
      const title = item.title || item.subject || 'Sesi Pembelajaran'
      const time = item.time_slot || item.time || (item.start_time ? `${item.start_time} - ${item.end_time}` : '08:00 WIB s.d Selesai')
      const lecturer = item.lecturer || item.instructor || item.speaker || 'Widyaiswara Pusdiklat'
      const zoomLink = item.zoom_link || item.meeting_url || item.link || 'Link tersedia di Portal Kelas'
      const dayNumber = item.day_number || item.session_day || index + 1

      message += `📌 *Sesi #${dayNumber}: ${title}*\n`
      message += `   ⏰ Waktu: ${time}\n`
      message += `   👨‍🏫 Pemateri: ${lecturer}\n`
      message += `   🔗 Link Sesi: ${zoomLink}\n\n`
    })

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `💡 *Informasi Peserta:*\n`
    message += `• Presensi kehadiran dibuka 15 menit sebelum materi dimulai.\n`
    message += `• Modul PDF dan materi paparan dapat diakses di portal:\n`
    message += `  🌐 https://agrasena-batch3.vercel.app/schedules\n\n`
    message += `_Pesan otomatis Sistem Informasi Diklat Agrasena Batch 3_`

    await sock.sendMessage(targetJid, { text: message })
    console.log(`[Scheduler] Berhasil mengirim jadwal harian ke ${targetJid}`)
    return { success: true, count: schedulesToDisplay.length }
  } catch (err) {
    console.error('[Scheduler] Error saat mengirim notifikasi jadwal:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Kirim Pengingat Batas Waktu Tugas Mandiri ke Grup WhatsApp
 */
async function sendTaskNotification(sock, supabase, targetJid) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  try {
    const { data: allTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('due_date', { ascending: true })

    if (error) {
      console.error('[Scheduler] Gagal mengambil tugas:', error.message)
      return { success: false, error: error.message }
    }

    if (!allTasks || allTasks.length === 0) {
      console.log('[Scheduler] Tidak ada tugas aktif yang perlu diingatkan.')
      return { success: true, count: 0, message: 'Tidak ada tugas aktif.' }
    }

    let message = `⚠️ *PENGINGAT PENUGASAN MANDIRI & UJIAN*\n`
    message += `*DIKLAT PRAKOM BATCH 3 — AGRASENA KEJAKSAAN RI*\n`
    message += `🗓️ Tanggal: *${formatIndonesianDate()}*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `Halo rekan-rekan peserta! Mohon periksa tenggat waktu penugasan mandiri berikut:\n\n`

    allTasks.slice(0, 5).forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadline = t.due_date ? formatIndonesianDate(t.due_date) : 'Segera'
      const desc = t.description ? `   _${t.description.slice(0, 100)}..._\n` : ''

      message += `📝 *${i + 1}. ${taskTitle}*\n`
      message += `   ⏳ Tenggat: *${deadline}*\n`
      if (desc) message += desc
      message += `\n`
    })

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `Segera selesaikan dan unggah laporan tugas Anda melalui website:\n`
    message += `🌐 https://agrasena-batch3.vercel.app/tasks\n\n`
    message += `_Semangat & selamat mengerjakan! 💪_`

    await sock.sendMessage(targetJid, { text: message })
    console.log(`[Scheduler] Berhasil mengirim notifikasi tugas ke ${targetJid}`)
    return { success: true, count: allTasks.length }
  } catch (err) {
    console.error('[Scheduler] Error saat mengirim notifikasi tugas:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Inisialisasi Otomatis Cron Scheduler
 */
function initScheduler(getSock, supabase, getTargetJid) {
  const scheduleCron = process.env.SCHEDULE_REMINDER_CRON || '0 7 * * *'
  const taskCron = process.env.TASK_REMINDER_CRON || '0 16 * * *'
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'

  console.log(`[Scheduler] Memasang cron jadwal harian: '${scheduleCron}' (Timezone: ${timezone})`)
  console.log(`[Scheduler] Memasang cron pengingat tugas: '${taskCron}' (Timezone: ${timezone})`)

  // 1. Cron Pagi: Jadwal Kuliah Hari Ini
  cron.schedule(
    scheduleCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan pengingat jadwal pagi...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendScheduleNotification(sock, supabase, targetJid)
      } else {
        console.warn('[Scheduler Trigger] Lewati: Bot belum terhubung atau target JID belum disetel.')
      }
    },
    { timezone }
  )

  // 2. Cron Sore: Pengingat Deadline Tugas
  cron.schedule(
    taskCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan pengingat deadline tugas sore...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendTaskNotification(sock, supabase, targetJid)
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
  formatIndonesianDate,
}
