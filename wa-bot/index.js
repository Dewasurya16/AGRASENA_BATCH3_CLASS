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
  Browsers,
} = require('@whiskeysockets/baileys')
const pino = require('pino')
const { createClient } = require('@supabase/supabase-js')

const {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateTomorrowScheduleMessage,
  generateScheduleForQuery,
  generateClosingAndTaskMessage,
  generateProgressMessage,
  searchMaterialsMessage,
  generateAnnouncementMessage,
  formatIndonesianDate,
  ZOOM_CONFIG,
} = require('./scheduler')
const { askAiAssistant } = require('./ai')
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
            await sendScheduleNotification(sock, supabase, to, { force: true })
            console.log(`[Bridge Action] Berhasil kirim pengingat jadwal ke ${to}`)
          }
        } else if (action.type === 'trigger_task') {
          const to = action.target || targetGroupJid
          if (to) {
            await sendTaskNotification(sock, supabase, to, { force: true })
            console.log(`[Bridge Action] Berhasil kirim pengingat tugas ke ${to}`)
          }
        } else if (action.type === 'trigger_tomorrow') {
          const to = action.target || targetGroupJid
          if (to) {
            const { text } = await generateTomorrowScheduleMessage(supabase)
            await sock.sendMessage(to, { text })
            console.log(`[Bridge Action] Berhasil kirim jadwal besok ke ${to}`)
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
  const args = cleanBody.slice(command.length).trim()
  console.log(`[Command Masuk] Dari: ${from} | Teks: "${cleanBody}"`)

  try {
    // 1. Perintah !id / !jid (Mengetahui ID Obrolan ini secara instan)
    if (command === '!id' || command === '!jid') {
      const isGroup = from.endsWith('@g.us')
      let reply = `🆔 *IDENTITAS WHATSAPP*\n`
      reply += `────────────────────────\n`
      reply += `• *Tipe:* ${isGroup ? 'Grup WhatsApp' : 'Obrolan Pribadi (DM)'}\n`
      reply += `• *JID:* \`${from}\`\n\n`
      if (isGroup) {
        reply += `💡 *Tips:* Ketik *!setgrup* untuk menetapkan grup ini sebagai target pengingat otomatis.`
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

      let reply = `✅ *TARGET GRUP BERHASIL DISETEL!*\n`
      reply += `────────────────────────\n`
      reply += `Grup ini resmi ditetapkan sebagai penerima pengingat otomatis Diklat Agrasena Batch 3.\n\n`
      reply += `• *ID Grup:* \`${from}\`\n`
      reply += `• *Jadwal Pagi:* 07:00 WIB\n`
      reply += `• *Penutup & Tugas:* 16:00 WIB\n\n`
      reply += `_Semua pengingat & siaran web sekarang otomatis masuk ke grup ini._`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 1c. Perintah !status
    if (command === '!status') {
      let reply = `🤖 *STATUS SISTEM BOT*\n`
      reply += `────────────────────────\n`
      reply += `• *Status:* 🟢 Aktif & Terhubung\n`
      reply += `• *Nama Akun:* ${botStatus.pushName || 'Bot Kelas'}\n`
      reply += `• *Nomor:* ${botStatus.phoneNumber || '-'}\n`
      reply += `• *Target Grup:* ${targetGroupJid ? '✅ Terhubung' : '⚠️ Belum Disetel'}\n`
      reply += `• *Waktu:* ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB\n\n`
      reply += `🌐 *Portal:* ${ZOOM_CONFIG.portalUrl}`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 2. Perintah !help / !menu / !petunjuk / !panduan
    if (command === '!help' || command === '!menu' || command === '!petunjuk' || command === '!panduan') {
      let reply = `🤖 *PANDUAN BOT AGRASENA BATCH 3*\n`
      reply += `*Kejaksaan Republik Indonesia*\n`
      reply += `────────────────────────\n`
      reply += `Daftar perintah yang dapat digunakan:\n\n`
      reply += `📌 *!jadwal*\n`
      reply += `└ Jadwal pembelajaran hari ini\n\n`
      reply += `📅 *!jadwal <tanggal / hari>*\n`
      reply += `└ Cek jadwal per tanggal / hari ke-N (cth: *!jadwal 8 Sep*)\n\n`
      reply += `⏰ *!besok*\n`
      reply += `└ Cek jadwal perkuliahan esok hari\n\n`
      reply += `📝 *!tugas*\n`
      reply += `└ Daftar tugas mandiri yang aktif\n\n`
      reply += `📢 *!pengumuman*\n`
      reply += `└ Siaran pengumuman resmi diklat terbaru\n\n`
      reply += `👥 *!tagall <pesan>*\n`
      reply += `└ Panggil / tag seluruh anggota di grup\n\n`
      reply += `📚 *!modul <topik>*\n`
      reply += `└ Cari modul & materi PDF (cth: *!modul jarkom*)\n\n`
      reply += `📊 *!progress*\n`
      reply += `└ Tracker progres diklat 35 hari\n\n`
      reply += `🤖 *!tanya <pertanyaan>*\n`
      reply += `└ Tanya Asisten AI Prakom seputar materi / SPBE\n\n`
      reply += `🔗 *!link*\n`
      reply += `└ Akses Portal Kelas (Zoom), modul & LMS\n\n`
      reply += `ℹ️ *!status*\n`
      reply += `└ Cek status koneksi bot\n\n`
      reply += `────────────────────────\n`
      reply += `🌐 *Portal:* ${ZOOM_CONFIG.portalUrl}`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 3. Perintah !jadwal / !tgl / !tanggal (Mendukung Cek Jadwal Hari Ini atau Per Tanggal)
    if (command === '!jadwal' || command === '!tgl' || command === '!tanggal') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      if (args) {
        // Cek per tanggal atau hari ke-N
        const { text } = await generateScheduleForQuery(supabase, args)
        await sock.sendMessage(from, { text }, { quoted: msg })
      } else {
        // Default hari ini
        const { text } = await generateDailyScheduleMessage(supabase)
        await sock.sendMessage(from, { text }, { quoted: msg })
      }
      return
    }

    // 3b. Perintah !besok (Jadwal Esok Hari)
    if (command === '!besok') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { text } = await generateTomorrowScheduleMessage(supabase)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4. Perintah !tugas (Penugasan Mandiri Aktif)
    if (command === '!tugas') {
      if (!supabase) {
        await sock.sendMessage(from, { text: '⚠️ Koneksi database website belum siap.' }, { quoted: msg })
        return
      }

      const { text } = await generateClosingAndTaskMessage(supabase)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4b. Perintah !modul / !materi (Pencarian Modul Diklat)
    if (command === '!modul' || command === '!materi') {
      const { text } = await searchMaterialsMessage(supabase, args)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4c. Perintah !progress / !tahap (Tracker Progres Diklat 35 Hari)
    if (command === '!progress' || command === '!progres' || command === '!tahap') {
      const { text } = generateProgressMessage()
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4d. Perintah !tanya / !ai / !ask (Asisten Cerdas AI Prakom)
    if (command === '!tanya' || command === '!ai' || command === '!ask') {
      const { text } = await askAiAssistant(args)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4e. Perintah !pengumuman / !berita (Pengumuman Resmi Terkini)
    if (command === '!pengumuman' || command === '!berita') {
      const { text } = await generateAnnouncementMessage(supabase)
      await sock.sendMessage(from, { text }, { quoted: msg })
      return
    }

    // 4f. Perintah !tagall / !everyone / !panggil / !hidetag (Panggil Semua Anggota Grup)
    if (command === '!tagall' || command === '!everyone' || command === '!panggil' || command === '!hidetag') {
      const isGroup = from.endsWith('@g.us')
      if (!isGroup) {
        await sock.sendMessage(
          from,
          { text: '⚠️ Perintah *!tagall* hanya dapat digunakan di dalam Grup WhatsApp kelas.' },
          { quoted: msg }
        )
        return
      }

      try {
        const groupMeta = await sock.groupMetadata(from)
        const participants = (groupMeta.participants || []).map((p) => p.id)

        if (participants.length === 0) {
          await sock.sendMessage(from, { text: '⚠️ Gagal membaca daftar anggota grup.' }, { quoted: msg })
          return
        }

        const customNote = args ? args : 'Perhatian seluruh rekan peserta Diklat Agrasena Batch 3!'
        let tagText = `📢 *PANGGILAN SELURUH ANGGOTA KELAS*\n`
        tagText += `*Diklat Prakom Batch 3 • Agrasena Kejaksaan RI*\n`
        tagText += `────────────────────────\n\n`
        tagText += `📝 *Pesan:*\n`
        tagText += `${customNote}\n\n`
        tagText += `👥 *Total Peserta Disebut:* ${participants.length} Anggota\n`
        tagText += `────────────────────────\n`
        tagText += `🌐 *Portal:* ${ZOOM_CONFIG.portalUrl}`

        await sock.sendMessage(
          from,
          {
            text: tagText,
            mentions: participants,
          },
          { quoted: msg }
        )
      } catch (err) {
        console.error('[TagAll Error]', err.message)
        await sock.sendMessage(from, { text: '⚠️ Gagal memanggil anggota grup: ' + err.message }, { quoted: msg })
      }
      return
    }

    // 5. Perintah !link / !zoom / !portal (Hanya mengarahkan ke Portal Kelas)
    if (command === '!link' || command === '!zoom' || command === '!portal') {
      let reply = `🔗 *TAUTAN RESMI DIKLAT PRAKOM BATCH 3*\n`
      reply += `*Diklat Agrasena • Kejaksaan RI 2026*\n`
      reply += `────────────────────────\n\n`
      reply += `🌐 *Portal Kelas (Akses Zoom & Materi):*\n`
      reply += `👉 ${ZOOM_CONFIG.portalUrl}\n\n`
      reply += `📅 *Kalender & Jadwal Perkuliahan:*\n`
      reply += `👉 ${ZOOM_CONFIG.portalUrl}/schedules\n\n`
      reply += `📝 *Unggah Penugasan Mandiri:*\n`
      reply += `👉 ${ZOOM_CONFIG.portalUrl}/tasks\n\n`
      reply += `📚 *Pustaka Modul Pembelajaran:*\n`
      reply += `👉 ${ZOOM_CONFIG.portalUrl}/materials\n\n`
      reply += `🏛️ *LMS Ruang Diklat Kejaksaan:*\n`
      reply += `👉 ${ZOOM_CONFIG.lmsUrl}\n\n`
      reply += `────────────────────────\n`
      reply += `💡 _Ketik *!jadwal* untuk melihat jadwal hari ini._`
      await sock.sendMessage(from, { text: reply }, { quoted: msg })
      return
    }

    // 6. Perintah !info
    if (command === '!info') {
      let reply = `🏛️ *DIKLAT FUNGSIONAL PRANATA KOMPUTER*\n`
      reply += `*ANGKATAN III (AGRASENA) KEJAKSAAN RI 2026*\n`
      reply += `────────────────────────\n`
      reply += `• *Pelatihan:* 35 Hari Kerja (120 JP)\n`
      reply += `• *Penyelenggara:* Badan Diklat Kejaksaan RI & Pusdiklat BPS RI\n`
      reply += `• *Tujuan:* Peningkatan Kompetensi SDM SPBE Kejaksaan RI\n\n`
      reply += `🌐 *Portal:* ${ZOOM_CONFIG.portalUrl}`
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
    browser: Browsers.windows('Desktop'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: 60000,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
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

