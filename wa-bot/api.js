const express = require('express')
const cors = require('cors')
const qrcode = require('qrcode')
const { sendScheduleNotification, sendTaskNotification } = require('./scheduler')

/**
 * Inisialisasi Express Server API Gateway
 */
function createApiServer({
  getSock,
  getQrData,
  getBotStatus,
  getTargetJid,
  setTargetJid,
  supabase,
}) {
  const app = express()
  const port = process.env.PORT || 5000
  const botSecret = process.env.BOT_SECRET_KEY || 'agrasena_prakom_super_secret_bot_key_2026'

  app.use(cors())
  app.use(express.json())

  // Middleware Autentikasi Rahasia untuk Endpoint Protected
  function verifySecret(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.body.secret || req.query.secret
    if (!token || token !== botSecret) {
      return res.status(401).json({ error: 'Akses ditolak: Token rahasia BOT_SECRET_KEY tidak valid.' })
    }
    next()
  }

  // 1. Healthcheck Publik (untuk Render / Koyeb liveness probe)
  app.get('/', (req, res) => {
    const status = getBotStatus()
    res.json({
      service: 'Agrasena WhatsApp Bot Gateway',
      status: 'active',
      whatsapp: status.connected ? 'connected' : 'disconnected',
      time: new Date().toISOString(),
    })
  })

  app.get('/health', (req, res) => {
    res.status(200).send('OK')
  })

  // 2. Status Bot
  app.get('/status', (req, res) => {
    const status = getBotStatus()
    res.json({
      ...status,
      targetGroupJid: getTargetJid(),
    })
  })

  // 3. Ambil QR Code Pairing
  app.get('/qr', async (req, res) => {
    const qrRaw = getQrData()
    const status = getBotStatus()

    if (status.connected) {
      return res.json({
        connected: true,
        message: 'Bot WhatsApp sudah terhubung! Tidak memerlukan scan QR code lagi.',
        qrImage: null,
      })
    }

    if (!qrRaw) {
      return res.json({
        connected: false,
        message: 'Menunggu inisialisasi QR Code dari WhatsApp Engine...',
        qrImage: null,
      })
    }

    try {
      const qrDataUrl = await qrcode.toDataURL(qrRaw, { margin: 2, scale: 7 })
      res.json({
        connected: false,
        qrImage: qrDataUrl,
        raw: qrRaw,
      })
    } catch (err) {
      res.status(500).json({ error: 'Gagal membuat gambar QR Code: ' + err.message })
    }
  })

  // 4. Kirim Pesan / Broadcast Manual
  app.post('/api/send', verifySecret, async (req, res) => {
    const { to, message } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Parameter pesan (message) wajib diisi teks.' })
    }

    const sock = getSock()
    const status = getBotStatus()
    if (!sock || !status.connected) {
      return res.status(503).json({ error: 'Bot WhatsApp sedang offline / belum di-scan.' })
    }

    const recipient = to || getTargetJid()
    if (!recipient) {
      return res.status(400).json({ error: 'Tujuan (to) atau target_group_jid belum ditentukan.' })
    }

    try {
      const cleanRecipient = recipient.includes('@') ? recipient : `${recipient}@s.whatsapp.net`
      const result = await sock.sendMessage(cleanRecipient, { text: message })
      res.json({
        success: true,
        messageId: result.key?.id,
        recipient: cleanRecipient,
      })
    } catch (err) {
      console.error('[API Send] Gagal mengirim pesan:', err)
      res.status(500).json({ error: 'Gagal mengirim pesan: ' + err.message })
    }
  })

  // 5. Trigger Paksa Pengingat Jadwal Hari Ini
  app.post('/api/trigger/schedule', verifySecret, async (req, res) => {
    const sock = getSock()
    const status = getBotStatus()
    if (!sock || !status.connected) {
      return res.status(503).json({ error: 'Bot WhatsApp sedang offline.' })
    }

    const targetJid = req.body.target || getTargetJid()
    if (!targetJid) {
      return res.status(400).json({ error: 'Target Group JID belum disetel.' })
    }

    const result = await sendScheduleNotification(sock, supabase, targetJid)
    if (result.success) {
      res.json({ success: true, message: 'Notifikasi jadwal berhasil dikirim ke grup.', count: result.count })
    } else {
      res.status(500).json({ error: result.error })
    }
  })

  // 6. Trigger Paksa Pengingat Tugas
  app.post('/api/trigger/task', verifySecret, async (req, res) => {
    const sock = getSock()
    const status = getBotStatus()
    if (!sock || !status.connected) {
      return res.status(503).json({ error: 'Bot WhatsApp sedang offline.' })
    }

    const targetJid = req.body.target || getTargetJid()
    if (!targetJid) {
      return res.status(400).json({ error: 'Target Group JID belum disetel.' })
    }

    const result = await sendTaskNotification(sock, supabase, targetJid)
    if (result.success) {
      res.json({ success: true, message: 'Notifikasi tugas berhasil dikirim ke grup.', count: result.count })
    } else {
      res.status(500).json({ error: result.error })
    }
  })

  // 7. Ambil Daftar Semua Grup yang Diikuti Bot (Memudahkan Pemilihan Target JID)
  app.get('/api/groups', verifySecret, async (req, res) => {
    const sock = getSock()
    const status = getBotStatus()
    if (!sock || !status.connected) {
      return res.status(503).json({ error: 'Bot WhatsApp sedang offline.' })
    }

    try {
      const groups = await sock.groupFetchAllParticipating()
      const groupList = Object.values(groups).map((g) => ({
        id: g.id,
        name: g.subject,
        participantsCount: g.participants?.length || 0,
        creation: g.creation,
        owner: g.owner,
      }))
      res.json({ success: true, groups: groupList })
    } catch (err) {
      res.status(500).json({ error: 'Gagal mengambil daftar grup: ' + err.message })
    }
  })

  // 8. Simpan Pengaturan JID Grup Target
  app.post('/api/config', verifySecret, async (req, res) => {
    const { targetGroupJid } = req.body
    if (targetGroupJid) {
      setTargetJid(targetGroupJid)
      // Simpan ke Supabase jika tersedia
      try {
        await supabase.from('wa_bot_config').upsert({
          key: 'general_settings',
          value: { target_group_jid: targetGroupJid },
          updated_at: new Date().toISOString(),
        })
      } catch (e) {
        console.warn('[API Config] Catatan: Gagal upsert konfigurasi ke Supabase:', e.message)
      }
      return res.json({ success: true, targetGroupJid })
    }
    res.status(400).json({ error: 'Parameter targetGroupJid wajib disertakan.' })
  })

  const server = app.listen(port, () => {
    console.log(`[API Server] WhatsApp Bot Gateway HTTP berjalan di port http://localhost:${port}`)
  })

  return { app, server }
}

module.exports = { createApiServer }
