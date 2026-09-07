const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '.env') })
if (!process.env.SUPABASE_URL) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
}

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys')
const pino = require('pino')
const { createClient } = require('@supabase/supabase-js')

const {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateClosingAndTaskMessage,
  formatIndonesianDate,
  ZOOM_CONFIG,
} = require('./scheduler')
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
        phone_number: userInfo.phoneNumber || botStatus.phoneNumber || null,
        push_name: userInfo.pushName || botStatus.pushName || null,
        last_seen: new Date().toISOString(),
        target_group_jid: targetGroupJid || null,
      },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
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
    if (data?.value?.target_group_jid && data.value.target_group_jid !== targetGroupJid) {
      targetGroupJid = data.value.target_group_jid
      console.log('[Config] Memuat Target Group JID dari database:', targetGroupJid)
    }
  } catch (e) {
    // Abaikan jika tabel belum ada
  }
}

/**
 * Polling & Memproses Antrean Aksi dari Web Dashboard (Supabase Cloud Bridge)
 */
async function processPendingActions() {
  if (!supabase || !sock || !botStatus.connected) return

  try {
    const { data, error } = await supabase
      .from('wa_bot_config')
      .select('value')
      .eq('key', 'pending_actions')
      .single()

    if (error || !data || !Array.isArray(data.value) || data.value.length === 0) {
      return
    }

    const actions = data.value
    const pending = actions.filter((a) => a.status === 'pending')

    if (pending.length === 0) return

    for (const action of pending) {
      console.log(`[Bridge Action] Memproses aksi dari web: ${action.type}`)
      try {
        if (action.type === 'send') {
          const to = action.to || targetGroupJid
          if (to) {
            await sock.sendMessage(to, { text: action.message })
            console.log(`[Bridge Action] Berhasil kirim pesan siaran ke ${to}`)
          }
        } else if (action.type === 'trigger_schedule') {
          const to = action.target || targetGroupJid
          if (to) {
            await sendScheduleNotification(sock, supabase, to)
            console.log(`[Bridge Action] Berhasil kirim pengingat jadwal ke ${to}`)
          }
        } else if (action.type === 'trigger_task') {
          const to = action.target || targetGroupJid
          if (to) {
            await sendTaskNotification(sock, supabase, to)
            console.log(`[Bridge Action] Berhasil kirim pengingat tugas ke ${to}`)
          }
        }
        action.status = 'completed'
        action.processed_at = new Date().toISOString()
      } catch (err) {
        console.error(`[Bridge Action Error]`, err)
        action.status = 'failed'
        action.error = err.message
      }
    }

    // Simpan status kembali ke Supabase (maksimal 20 riwayat terakhir)
    await supabase.from('wa_bot_config').upsert({
      key: 'pending_actions',
      value: actions.slice(-20),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
  } catch (e) {
    // Non-blocking
  }
}

// Anti-Spam Command Cooldown: jeda minimal antar perintah per obrolan (6 detik)
const chatCommandCooldowns = new Map()

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

  // Anti-Spam: batas cooldown 6 detik antar-perintah di obrolan yang sama
  const now = Date.now()
  const lastTime = chatCommandCooldowns.get(from) || 0
  if (now - lastTime < 6000) {
    console.log(`[Anti-Spam] Perintah "${cleanBody}" dari ${from} diabaikan sementara (cooldown 6 detik).`)
    return
  }
  chatCommandCooldowns.set(from, now)

  const command = cleanBody.toLowerCase().split(/\s+/)[0]
  console.log(`[Command Masuk] Dari: ${from} | Teks: "${cleanBody}"`)

  try {
    // 1. Perintah !id / !jid (Mengetahui ID Obrolan ini secara instan)
    if (command === '!id' || command === '!jid') {
      const isGroup = from.endsWith('@g.us')
      let reply = `🆔 *INFORMASI IDENTITAS WHATSAPP*\n━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `• *Tipe Obrolan*: ${isGroup ? 'Grup WhatsApp' : 'Obrolan Pribadi (DM)'}\n`
      reply += `• *ID Obrolan (JID)*:\n\`${from}\`\n\n`
      if (isGroup) {
        reply += `💡 *Tips Praktis:*\n`
        reply += `Ketik *!setgrup* di grup ini sekarang untuk langsung menetapkan grup ini sebagai target pengingat otomatis tanpa perlu salin ID ke web!`
      }
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 1b. Perintah !setgrup / !settarget (Auto-set grup ini sebagai target pengingat)
    if (command === '!setgrup' || command === '!settarget') {
      const isGroup = from.endsWith('@g.us')
      if (!isGroup) {
        await sock.sendMessage(
          from,
          { text: '⚠️ Perintah *!setgrup* hanya dapat dijalankan di dalam Grup WhatsApp kelas.' },
          { quoted: msg }
        )
        return
      }

      targetGroupJid = from
      if (supabase) {
        try {
          const { data: currentCfg } = await supabase
            .from('wa_bot_config')
            .select('value')
            .eq('key', 'general_settings')
            .single()

          const val = currentCfg?.value || {}
          val.target_group_jid = from
          await supabase.from('wa_bot_config').upsert({
            key: 'general_settings',
            value: val,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'key' })
        } catch (e) {
          console.error('[Config Save Error]', e)
        }
      }

      let reply = `✅ *TARGET GRUP BERHASIL DIATUR!*\n━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `Grup ini resmi ditetapkan sebagai target pengingat notifikasi otomatis Diklat Agrasena Batch 3.\n\n`
      reply += `• *ID Grup*: \`${from}\`\n`
      reply += `• *Jadwal Pengingat Kuliah Pagi*: 07:00 WIB\n`
      reply += `• *Jadwal Penutup & Tugas Sore*: 16:00 WIB\n\n`
      reply += `_Semua pengingat dan siaran dari dashboard web sekarang akan otomatis masuk ke grup ini._`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 1c. Perintah !status
    if (command === '!status') {
      let reply = `🤖 *STATUS SISTEM BOT WHATSAPP*\n━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `• *Status Bot*: 🟢 Aktif & Terhubung\n`
      reply += `• *Nama Akun*: ${botStatus.pushName || 'Bot Kelas'}\n`
      reply += `• *Nomor*: ${botStatus.phoneNumber || '-'}\n`
      reply += `• *Target Grup Saat Ini*: ${targetGroupJid ? `\`${targetGroupJid}\`` : '⚠️ Belum Disetel (Ketik !setgrup)'}\n`
      reply += `• *Waktu Server*: ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB\n\n`
      reply += `_Website Portal:_ https://agrasena-batch-3-class.vercel.app`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 2. Perintah !help / !menu
    if (command === '!help' || command === '!menu') {
      let reply = `🤖 *ASISTEN DIKLAT AGRASENA BATCH 3*\n`
      reply += `*KEJAKSAAN REPUBLIK INDONESIA*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n`
      reply += `Halo! Saya adalah bot asisten resmi kelas Diklat. Berikut daftar perintah yang bisa Anda gunakan:\n\n`
      reply += `📌 *!jadwal* — Cek jadwal mata diklat & akses Zoom hari ini\n`
      reply += `📝 *!tugas* — Cek daftar penugasan mandiri aktif & tenggat waktu\n`
      reply += `🔗 *!link* — Akses cepat portal web kelas, Zoom, & modul\n`
      reply += `🆔 *!id* — Mengetahui ID/JID obrolan ini\n`
      reply += `⚙️ *!setgrup* — Tetapkan grup ini sebagai target pengingat\n`
      reply += `📊 *!status* — Cek status koneksi bot\n`
      reply += `ℹ️ *!info* — Informasi Diklat Prakom RI\n\n`
      reply += `_Website Kelas:_ https://agrasena-batch-3-class.vercel.app`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 3. Perintah !jadwal (Menampilkan jadwal hari ini lengkap dengan Zoom dan kata motivasi)
    if (command === '!jadwal') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { text } = await generateDailyScheduleMessage(supabase)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4. Perintah !tugas (Menampilkan tugas aktif & pesan penyemangat)
    if (command === '!tugas') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { text } = await generateClosingAndTaskMessage(supabase)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 5. Perintah !link
    if (command === '!link') {
      let reply = `🔗 *TAUTAN RESMI DIKLAT PRAKOM BATCH 3*\n`
      reply += `*AGRASENA KEJAKSAAN REPUBLIK INDONESIA*\n`
      reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`
      reply += `🎥 *Ruang Zoom Tatap Muka Online (Angkatan 3)*:\n`
      reply += `• Link: ${ZOOM_CONFIG.joinUrl}\n`
      reply += `• Meeting ID: \`${ZOOM_CONFIG.meetingIdDisplay}\`\n`
      reply += `• Passcode: \`${ZOOM_CONFIG.passcode}\`\n\n`
      reply += `🌐 *Portal Website Kelas*:\n${ZOOM_CONFIG.portalUrl}\n\n`
      reply += `📚 *Pustaka Modul PDF (120 JP)*:\n${ZOOM_CONFIG.portalUrl}/materials\n\n`
      reply += `📅 *Kalender Jadwal 35 Hari*:\n${ZOOM_CONFIG.portalUrl}/schedules\n\n`
      reply += `📝 *Unggah Penugasan Mandiri*:\n${ZOOM_CONFIG.portalUrl}/tasks\n\n`
      reply += `🏛️ *LMS Ruang Diklat Kejaksaan*:\n${ZOOM_CONFIG.lmsUrl}\n\n`
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
      reply += `Portal Resmi: https://agrasena-batch-3-class.vercel.app`
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
      try {
        const qrTerminal = await require('qrcode').toString(qr, { type: 'terminal', small: true })
        console.log(qrTerminal)
      } catch (e) {}
      console.log('------------------------------------------------------------')
      console.log('💡 Atau buka Dashboard Web: /admin/dashboard (Tab Bot WhatsApp) untuk scan QR gambar!')
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

  // Heartbeat berkala ke Supabase setiap 15 detik & sinkronisasi target group
  setInterval(async () => {
    if (botStatus.connected && sock) {
      await syncStatusToSupabase(true)
      await loadTargetGroupFromSupabase()
    }
  }, 15000)

  // Polling pemrosesan antrean aksi dari Web Dashboard Vercel setiap 2.5 detik
  setInterval(processPendingActions, 2500)
}

start().catch((err) => {
  console.error('[Fatal Error] Gagal memulai bot:', err)
})

