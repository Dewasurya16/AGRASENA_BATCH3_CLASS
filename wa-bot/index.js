require('dotenv').config()
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys')
const pino = require('pino')
const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

const { initScheduler, sendScheduleNotification, sendTaskNotification, formatIndonesianDate } = require('./scheduler')
const { createApiServer } = require('./api')

// 1. Inisialisasi Kredensial Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

let supabase = null
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project')) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log('[Database] Supabase client berhasil diinisialisasi:', supabaseUrl)
} else {
  console.warn('[Database] Peringatan: Supabase URL/Key belum dikonfigurasi lengkap di .env!')
}

// 2. State Global Bot
let sock = null
let currentQr = null
let targetGroupJid = process.env.TARGET_GROUP_JID || ''
let botStatus = {
  connected: false,
  phoneNumber: null,
  pushName: null,
  connectedAt: null,
}

const authFolder = path.join(__dirname, 'auth_info_baileys')
if (!fs.existsSync(authFolder)) {
  fs.mkdirSync(authFolder, { recursive: true })
}

/**
 * Update Status Operasional Bot ke Supabase
 */
async function syncStatusToSupabase(isConnected, userInfo = {}) {
  if (!supabase) return
  try {
    await supabase.from('wa_bot_config').upsert({
      key: 'bot_runtime_status',
      value: {
        connected: isConnected,
        phone_number: userInfo.phoneNumber || null,
        push_name: userInfo.pushName || null,
        last_seen: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    // Non-blocking
  }
}

/**
 * Ambil Pengaturan Target Grup dari Supabase (jika ada)
 */
async function loadTargetGroupFromSupabase() {
  if (!supabase) return
  try {
    const { data } = await supabase.from('wa_bot_config').select('value').eq('key', 'general_settings').single()
    if (data?.value?.target_group_jid) {
      targetGroupJid = data.value.target_group_jid
      console.log('[Config] Memuat Target Group JID dari database:', targetGroupJid)
    }
  } catch (e) {
    // Abaikan jika tabel belum ada
  }
}

/**
 * Handle Pesan Perintah Interaktif di Grup atau DM
 */
async function handleIncomingMessage(m) {
  if (!m.messages || !m.messages[0]) return
  const msg = m.messages[0]
  if (msg.key.fromMe) return // Abaikan pesan yang dikirim oleh bot sendiri

  const from = msg.key.remoteJid
  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    ''

  const cleanBody = body.trim()
  if (!cleanBody.startsWith('!')) return // Hanya proses teks yang diawali tanda seru

  const command = cleanBody.toLowerCase().split(/\s+/)[0]
  console.log(`[Command Masuk] Dari: ${from} | Teks: "${cleanBody}"`)

  try {
    // 1. Perintah !id (Mengetahui ID Grup ini secara instan)
    if (command === '!id' || command === '!jid') {
      const isGroup = from.endsWith('@g.us')
      let reply = `🆔 *INFORMASI IDENTITAS WHATSAPP*\n━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `• *Tipe Obrolan*: ${isGroup ? 'Grup WhatsApp' : 'Obrolan Pribadi (DM)'}\n`
      reply += `• *ID Obrolan (JID)*: \`${from}\`\n\n`
      if (isGroup) {
        reply += `💡 _Salin ID di atas dan masukkan ke dashboard web untuk menetapkan grup ini sebagai target pengingat harian!_`
      }
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 2. Perintah !help / !menu
    if (command === '!help' || command === '!menu') {
      let reply = `🤖 *ASISTEN DIKLAT AGRASENA BATCH 3*\n`
      reply += `*KEJAKSAAN REPUBLIK INDONESIA*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `Halo! Saya adalah bot pengingat resmi kelas Diklat. Berikut daftar perintah yang bisa Anda gunakan:\n\n`
      reply += `📌 *!jadwal* — Cek jadwal perkuliahan hari ini & besok\n`
      reply += `📝 *!tugas* — Cek daftar penugasan mandiri yang aktif\n`
      reply += `🔗 *!link* — Akses cepat portal web, Zoom, & Google Drive modul\n`
      reply += `🆔 *!id* — Mengetahui ID/JID grup ini\n`
      reply += `ℹ️ *!info* — Informasi penyelenggaraan Diklat Prakom RI\n\n`
      reply += `_Website Kelas:_ https://agrasena-batch3.vercel.app`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 3. Perintah !jadwal
    if (command === '!jadwal') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(4)

      if (!schedules || schedules.length === 0) {
        await sock.sendMessage(from, { text: '📅 Belum ada data jadwal yang terdaftar di sistem.' }, { quoted: msg })
        return
      }

      let reply = `📅 *AGENDA PEMBELAJARAN TERDEKAT*\n`
      reply += `*DIKLAT PRAKOM BATCH 3 KEJAKSAAN RI*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`

      schedules.forEach((s, idx) => {
        const title = s.title || s.subject || 'Sesi Pembelajaran'
        const time = s.time_slot || s.time || (s.start_time ? `${s.start_time} - ${s.end_time}` : '08:00 WIB')
        const lecturer = s.lecturer || s.instructor || 'Widyaiswara'
        const zoom = s.zoom_link || 'Lihat di website'
        reply += `📌 *Sesi #${s.day_number || idx + 1}: ${title}*\n`
        reply += `   ⏰ Waktu: ${time}\n`
        reply += `   👨‍🏫 Pemateri: ${lecturer}\n`
        reply += `   🔗 Zoom: ${zoom}\n\n`
      })

      reply += `🌐 Jadwal lengkap 35 hari: https://agrasena-batch3.vercel.app/schedules`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 4. Perintah !tugas
    if (command === '!tugas') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(5)

      if (!tasks || tasks.length === 0) {
        await sock.sendMessage(from, { text: '✅ Selamat! Belum ada tugas aktif yang belum selesai.' }, { quoted: msg })
        return
      }

      let reply = `📝 *DAFTAR PENUGASAN AKTIF*\n`
      reply += `*DIKLAT PRAKOM BATCH 3 KEJAKSAAN RI*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`

      tasks.forEach((t, i) => {
        const title = t.title || t.name || 'Tugas Mandiri'
        const deadline = t.due_date ? formatIndonesianDate(t.due_date) : 'Segera'
        reply += `*${i + 1}. ${title}*\n`
        reply += `   ⏳ Batas Waktu: ${deadline}\n`
        if (t.description) reply += `   _${t.description.slice(0, 80)}..._\n`
        reply += `\n`
      })

      reply += `🌐 Unggah tugas di: https://agrasena-batch3.vercel.app/tasks`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 5. Perintah !link
    if (command === '!link') {
      let reply = `🔗 *TAUTAN RESMI DIKLAT PRAKOM BATCH 3*\n`
      reply += `*AGRASENA KEJAKSAAN REPUBLIK INDONESIA*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`
      reply += `🌐 *Portal Website Kelas*:\nhttps://agrasena-batch3.vercel.app\n\n`
      reply += `📚 *Pustaka Modul PDF (120 JP)*:\nhttps://agrasena-batch3.vercel.app/materials\n\n`
      reply += `📅 *Kalender Jadwal 35 Hari*:\nhttps://agrasena-batch3.vercel.app/schedules\n\n`
      reply += `💬 *Forum Diskusi Rekan Kelas*:\nhttps://agrasena-batch3.vercel.app/discussions\n\n`
      reply += `_Simpan tautan ini untuk memudahkan kegiatan pembelajaran Anda._`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 6. Perintah !info
    if (command === '!info') {
      let reply = `🏛️ *DIKLAT FUNGSIONAL PRANATA KOMPUTER*\n`
      reply += `*ANGKATAN III (AGRASENA) KEJAKSAAN RI TAHUN 2026*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`
      reply += `• *Durasi Pelatihan*: 35 Hari Kerja (120 JP)\n`
      reply += `• *Penyelenggara*: Badan Diklat Kejaksaan RI & Pusdiklat BPS RI\n`
      reply += `• *Tujuan*: Penguatan Kompetensi Jabatan Fungsional Prakom dalam Transformasi Digital SPBE Kejaksaan RI.\n\n`
      reply += `Portal Resmi: https://agrasena-batch3.vercel.app`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }
  } catch (err) {
    console.error('[Command Error]', err)
  }
}

/**
 * Hubungkan Socket WhatsApp (Baileys)
 */
async function connectToWhatsApp() {
  console.log('[WhatsApp Engine] Memulai inisialisasi koneksi Baileys...')
  const { state, saveCreds } = await useMultiFileAuthState(authFolder)
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`[WhatsApp Engine] Menggunakan versi Baileys v${version.join('.')} (isLatest: ${isLatest})`)

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['Agrasena Bot Diklat', 'Chrome', '1.0.0'],
    defaultQueryTimeoutMs: 60000,
  })

  // Simpan kredensial setiap ada pembaruan auth token
  sock.ev.on('creds.update', saveCreds)

  // Event Pembaruan Koneksi & QR Code
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      currentQr = qr
      console.log('\n[QR Code] QR Code baru telah dihasilkan! Silakan scan melalui WhatsApp di HP Anda:')
      console.log('------------------------------------------------------------')
    }

    if (connection === 'open') {
      currentQr = null
      const userJid = sock.user?.id || ''
      const phoneNumber = userJid.split(':')[0] || userJid.split('@')[0]
      const pushName = sock.user?.name || 'Agrasena Bot'

      botStatus = {
        connected: true,
        phoneNumber,
        pushName,
        connectedAt: new Date().toISOString(),
      }

      console.log(`\n============================================================`)
      console.log(`✅ [BERHASIL TERHUBUNG] Bot WhatsApp Aktif!`)
      console.log(`   Nama Akun    : ${pushName}`)
      console.log(`   Nomor HP     : ${phoneNumber}`)
      console.log(`   Grup Target  : ${targetGroupJid || '(Belum disetel, ketik !id di grup Anda)'}`)
      console.log(`============================================================\n`)

      await syncStatusToSupabase(true, { phoneNumber, pushName })
    }

    if (connection === 'close') {
      currentQr = null
      botStatus = {
        connected: false,
        phoneNumber: null,
        pushName: null,
        connectedAt: null,
      }

      const statusCode = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut

      console.log(`[WhatsApp Engine] Koneksi terputus (Status Code: ${statusCode}). Reconnect: ${shouldReconnect}`)
      await syncStatusToSupabase(false)

      if (shouldReconnect) {
        console.log('[WhatsApp Engine] Menghubungkan ulang dalam 5 detik...')
        setTimeout(connectToWhatsApp, 5000)
      } else {
        console.log('[WhatsApp Engine] Sesi dikeluarkan / Logged out. Silakan scan QR ulang.')
        try {
          fs.rmSync(authFolder, { recursive: true, force: true })
        } catch (e) {}
        setTimeout(connectToWhatsApp, 3000)
      }
    }
  })

  // Event Pesan Masuk (Auto Reply / Commands)
  sock.ev.on('messages.upsert', handleIncomingMessage)
}

// 3. Jalankan Aplikasi
async function start() {
  await loadTargetGroupFromSupabase()

  // Inisialisasi API Server Express
  createApiServer({
    getSock: () => sock,
    getQrData: () => currentQr,
    getBotStatus: () => botStatus,
    getTargetJid: () => targetGroupJid,
    setTargetJid: (newJid) => {
      targetGroupJid = newJid
      console.log('[Config] Target Group JID diperbarui:', newJid)
    },
    supabase,
  })

  // Inisialisasi Cron Scheduler
  initScheduler(
    () => (botStatus.connected ? sock : null),
    supabase,
    () => targetGroupJid
  )

  // Hubungkan ke WhatsApp
  connectToWhatsApp()
}

start().catch((err) => {
  console.error('[Fatal Error] Gagal memulai bot:', err)
})
