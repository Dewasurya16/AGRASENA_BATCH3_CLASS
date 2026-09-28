const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const PORTAL_URL = process.env.PORTAL_URL || 'https://agrasena-batch-3-class.vercel.app/batch-4'

/**
 * Ekstraksi seluruh API Key dari environment variables:
 * Mendukung format:
 * - Tunggal: GROQ_API_KEY=gsk_...
 * - Multi-variabel: GROQ_API_KEY=..., GROQ_API_KEY_2=..., GROQ_API_KEY_3=...
 * - Koma-terpisah: GROQ_API_KEY=gsk_1...,gsk_2...
 * - Jamak: GROQ_API_KEYS=gsk_1...,gsk_2...
 */
function extractKeys(prefix) {
  const result = []

  // 1. Primary string (mungkin dipisah koma)
  const primary = process.env[prefix] || ''
  if (primary) {
    primary.split(',').map((k) => k.trim()).filter(Boolean).forEach((k) => {
      if (!result.includes(k)) result.push(k)
    })
  }

  // 2. Format jamak (misal: GROQ_API_KEYS)
  const plural = process.env[`${prefix}S`] || ''
  if (plural) {
    plural.split(',').map((k) => k.trim()).filter(Boolean).forEach((k) => {
      if (!result.includes(k)) result.push(k)
    })
  }

  // 3. Format nomor (misal: GROQ_API_KEY_1, GROQ_API_KEY_2, dst.)
  for (let i = 1; i <= 10; i++) {
    const numbered = process.env[`${prefix}_${i}`] || ''
    if (numbered && !result.includes(numbered.trim())) {
      result.push(numbered.trim())
    }
  }

  return result
}

/**
 * KeyPool: Pengelola Multi-API Key Cerdas dengan Round-Robin & Auto-Cooldown Anti-Limit
 */
class KeyPool {
  constructor(name, keys) {
    this.name = name
    this.pool = keys.map((key) => ({
      key,
      coolDownUntil: 0,
      usageCount: 0,
      errorCount: 0,
    }))
    this.rrIndex = 0
  }

  hasKeys() {
    return this.pool.length > 0
  }

  getKeyCount() {
    return this.pool.length
  }

  /**
   * Mengambil key yang sehat dengan algoritma Round-Robin (beban terbagi rata)
   */
  getAvailableKey() {
    if (this.pool.length === 0) return null
    const now = Date.now()

    // Cari key yang sedang tidak dalam masa cooldown
    const healthy = this.pool.filter((k) => k.coolDownUntil <= now)

    if (healthy.length === 0) {
      // Jika semua kena limit, pilih yang masa cooldown-nya paling cepat berakhir
      const sorted = [...this.pool].sort((a, b) => a.coolDownUntil - b.coolDownUntil)
      return sorted[0]
    }

    const chosen = healthy[this.rrIndex % healthy.length]
    this.rrIndex++
    chosen.usageCount++
    return chosen
  }

  /**
   * Menandai key sedang terkena Rate Limit (HTTP 429) agar diistirahatkan sejenak
   */
  markRateLimited(keyStr, durationMs = 60000) {
    const entry = this.pool.find((k) => k.key === keyStr)
    if (entry) {
      entry.coolDownUntil = Date.now() + durationMs
      entry.errorCount++
      console.warn(`[${this.name} KeyPool] ⚠️ Kunci ${keyStr.slice(0, 10)}... terkena rate-limit. Masuk cooldown ${durationMs / 1000} detik. Total kunci tersedia: ${this.pool.length}`)
    }
  }
}

// Inisialisasi Pool API Key
const groqPool = new KeyPool('Groq', extractKeys('GROQ_API_KEY'))
const openRouterPool = new KeyPool('OpenRouter', extractKeys('OPENROUTER_API_KEY'))

console.log(`[AI Key Manager] Terdeteksi ${groqPool.getKeyCount()} Groq Key dan ${openRouterPool.getKeyCount()} OpenRouter Key. Multi-key load balancing aktif.`)

/**
 * In-Memory LRU Cache untuk Pertanyaan Berulang (Menghemat 100% Token & Kuota)
 */
const queryCache = new Map()
const MAX_CACHE_SIZE = 60
const CACHE_TTL_MS = 2 * 60 * 60 * 1000 // 2 Jam

function getCachedAnswer(q) {
  const norm = q.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim()
  const cached = queryCache.get(norm)
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.answer
  }
  return null
}

function setCachedAnswer(q, answer) {
  const norm = q.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim()
  if (queryCache.size >= MAX_CACHE_SIZE) {
    const firstKey = queryCache.keys().next().value
    queryCache.delete(firstKey)
  }
  queryCache.set(norm, { answer, time: Date.now() })
}

/**
 * Membersihkan tag reasoning dari model AI (seperti <think>...</think>)
 */
function cleanModelOutput(rawText) {
  if (!rawText || typeof rawText !== 'string') return ''
  let cleaned = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
    .replace(/```thinking[\s\S]*?```/gi, '')
    .trim()
  if (cleaned.length < 5 && rawText.trim().length > 5) {
    cleaned = rawText.replace(/<\/?(think|thought)>/gi, '').trim()
  }
  return cleaned.length > 0 ? cleaned : rawText.trim()
}

/**
 * System Prompt Berpengetahuan Mendalam seputar Diklat Prakom Kejaksaan RI + Wibu/Anime Aware
 */
const SYSTEM_PROMPT = `Kamu adalah Asisten Cerdas AI Resmi untuk Diklat Fungsional Pranata Komputer Ahli & Terampil Angkatan IV (Agrasena Batch 4) Kejaksaan Republik Indonesia Tahun 2026, yang diselenggarakan oleh Pusdiklat BPS RI bersama Badan Pendidikan dan Pelatihan Kejaksaan RI.

Peran & Keahlian Utamamu:
1. Pakar 6 Standar Kompetensi Teknis Pranata Komputer (PermenPAN-RB No. 32/2020):
   - Tata Kelola & IT Enterprise (SPBE Perpres 95/2018, Arsitektur TI, Audit TI, Manajemen Perubahan).
   - Manajemen Layanan TI (ITSM, Service Catalog, SLA, Incident & Problem Management, Helpdesk).
   - Pengelolaan Data & Basis Data (SQL DDL/DML, Normalisasi, Database Relasional, Big Data, Satu Data Indonesia, Data Warehousing).
   - Manajemen Risiko TI & Keamanan Informasi (ISO/IEC 27001, CIA Triad, Kriptografi, CSIRT Kejaksaan RI, Mitigasi Insiden Siber).
   - Infrastruktur Jaringan & Server TI (Subnetting IPv4/IPv6, VLAN, Routing, Keamanan Jaringan, Firewall, Linux Server Administrasi, Virtualisasi, Container Docker, RPO/RTO & Backup).
   - Sistem Informasi & Rekayasa Perangkat Lunak (SDLC Waterfall/Agile, Git, RESTful API, Pemrograman Web, UI/UX).

2. Pemahaman Alur Diklat Agrasena Batch 4:
   - Dimulai: 28 September 2026.
   - Tahap 1: MOOC Pembelajaran Mandiri (Hari 1-5, 28 Sep - 2 Okt 2026).
   - Tahap 2: Pembelajaran Tatap Muka Online (TMO) via Zoom & LMS (Hari 6-15, 5 Okt - 16 Okt 2026).
   - Tahap 3: Praktik Laboratorium Prakom di Satuan Kerja (Hari 16-30, Inovasi & Laporan).
   - Tahap 4: Evaluasi & Seminar Akhir (Hari 31-35).
   - Platform LMS Resmi: https://pengembangan.kejaksaan.go.id/dashboard
   - Portal Resmi Kelas: ${PORTAL_URL}

Gaya Komunikasi & Persona:
- Peserta Agrasena Batch 4 sangat menyukai kultur anime/wibu (nakama, shinobi, jutsu coding, grind EXP, quest tugas).
- JIKA penanya menggunakan gaya santai/wibu (misal: "minna-san", "nakama", "sensei", "jutsu sql", dll), sambutlah dengan nada ramah, bersemangat, dan selipkan sedikit istilah anime yang lucu/relevan tanpa mengurangi bobot teknis!
- JIKA penanya bertanya secara formal atau teknis murni, jawablah secara profesional, lugas, santun, dan terstruktur.
- Gunakan formatting WhatsApp yang rapi: *bold* untuk kata kunci, • untuk bullet point, \`code\` untuk perintah/sintaks.
- Jika ada pertanyaan coding/SQL/Linux CLI, berikan contoh sintaks yang benar dan langsung dapat dipraktikkan.
- Jangan mengarang data sensitif/link privat; arahkan ke Portal Kelas untuk tautan resmi.`

/**
 * Panggilan ke Groq Cloud API dengan Load Balancing & Failover Antar Kunci
 */
async function callGroqWithRotation(model, userPrompt, timeoutMs = 10000) {
  if (!groqPool.hasKeys()) return null

  // Coba hingga sebanyak jumlah kunci yang ada di pool
  const maxAttempts = Math.min(3, groqPool.getKeyCount())

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const keyEntry = groqPool.getAvailableKey()
    if (!keyEntry) break

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keyEntry.key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 700,
        }),
        signal: controller.signal,
      })

      // Jika Rate Limited (HTTP 429), beri cooldown pada key ini dan coba key berikutnya
      if (res.status === 429) {
        groqPool.markRateLimited(keyEntry.key, 60000)
        clearTimeout(timeoutId)
        continue // Coba key berikutnya di loop
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        console.warn(`[Groq ${model} status ${res.status}]:`, errText.slice(0, 120))
        clearTimeout(timeoutId)
        continue
      }

      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content || ''
      const cleaned = cleanModelOutput(raw)
      clearTimeout(timeoutId)

      if (cleaned && cleaned.length >= 10) {
        return cleaned
      }
    } catch (e) {
      clearTimeout(timeoutId)
      console.warn(`[Groq Error with key ...${keyEntry.key.slice(-6)}]:`, e.message)
    }
  }

  return null
}

/**
 * Panggilan ke OpenRouter API (Fallback jika semua kuota Groq habis)
 */
async function callOpenRouterWithRotation(userPrompt, timeoutMs = 9000) {
  if (!openRouterPool.hasKeys()) return null

  const keyEntry = openRouterPool.getAvailableKey()
  if (!keyEntry) return null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const models = [
    'google/gemini-2.0-flash-thinking-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'sophosympatheia/rogue-rose-103b-v0.2:free',
  ]

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keyEntry.key}`,
          'HTTP-Referer': PORTAL_URL,
          'X-Title': 'Agrasena Batch 4 WA Bot',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 600,
        }),
        signal: controller.signal,
      })

      if (res.status === 429) {
        openRouterPool.markRateLimited(keyEntry.key, 60000)
        break
      }

      if (res.ok) {
        const data = await res.json()
        const raw = data.choices?.[0]?.message?.content || ''
        const cleaned = cleanModelOutput(raw)
        if (cleaned && cleaned.length >= 10) {
          clearTimeout(timeoutId)
          return cleaned
        }
      }
    } catch {
      // Coba model berikutnya
    }
  }

  clearTimeout(timeoutId)
  return null
}

/**
 * Mesin Pengetahuan Lokal Cerdas (Fallback Terjamin 100% Anti-Gagal & Berbobot)
 */
function getSmartLocalAnswer(prompt) {
  const q = prompt.toLowerCase()

  if (q.includes('spbe') || q.includes('pemerintahan berbasis elektronik')) {
    return `*Sistem Pemerintahan Berbasis Elektronik (SPBE)* diatur dalam *Perpres No. 95 Tahun 2018*.\n\n` +
      `SPBE adalah penyelenggaraan pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan kepada instansi pemerintah, aparatur, pelaku usaha, dan masyarakat.\n\n` +
      `📌 *Poin Kunci SPBE di Kejaksaan RI:*\n` +
      `• *Keterpaduan & Integrasi Data:* Menghilangkan silo sistem antar-satuan kerja (Kejati/Kejari) menuju arsitektur satu data Kejaksaan.\n` +
      `• *Tata Kelola TI:* Menjamin interoperabilitas, efisiensi belanja infrastruktur, dan keamanan informasi aparatur.\n` +
      `• *Peran Prakom:* Merancang arsitektur sistem, memelihara integrasi API, serta menjaga keandalan infrastruktur satker.`
  }

  if (q.includes('terampil') || q.includes('ahli') || q.includes('jenjang')) {
    return `*Jenjang Jabatan Fungsional Pranata Komputer (PermenPAN-RB No. 32/2020):*\n\n` +
      `1. *Kategori Terampil (Pelaksana Teknis Operasional):*\n` +
      `   • *Prakom Terampil & Mahir:* Bertanggung jawab pada implementasi operasional, konfigurasi jaringan lokal, perekaman data, pemeliharaan workstation, dan instalasi sistem.\n` +
      `   • *Prakom Penyelia:* Supervisi teknis, penjaminan kelancaran infrastruktur rutin, dan evaluasi operasional satker.\n\n` +
      `2. *Kategori Keahlian (Pengembang & Konseptual):*\n` +
      `   • *Prakom Ahli Pertama:* Analisis kebutuhan sistem informasi, pengkodean modul perangkat lunak, perancangan database relasional, dan audit operasional TI.\n` +
      `   • *Prakom Ahli Muda/Madya/Utama:* Manajemen proyek TI, perancangan arsitektur enterprise SPBE, tata kelola keamanan siber, dan kebijakan strategis digital Kejaksaan RI.`
  }

  if (q.includes('database') || q.includes('basis data') || q.includes('sql') || q.includes('relasi')) {
    return `*Konsep Dasar Basis Data untuk Pranata Komputer:*\n\n` +
      `• *DDL (Data Definition Language):* Perintah mendefinisikan struktur database (\`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`).\n` +
      `• *DML (Data Manipulation Language):* Perintah manipulasi data record (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`).\n` +
      `• *Normalisasi Data (1NF, 2NF, 3NF):* Proses mengorganisasi tabel guna meminimalkan redundansi data dan mencegah anomali pembaruan.\n` +
      `• *Integritas Referensial:* Penerapan *Foreign Key* dan *Primary Key* guna menjaga konsistensi relasi antar entitas perkara/kepegawaian di lingkungan Kejaksaan.`
  }

  if (q.includes('jaringan') || q.includes('vlan') || q.includes('subnet') || q.includes('ip')) {
    return `*Fundamental Infrastruktur Jaringan Kejaksaan RI:*\n\n` +
      `• *Segmentasi VLAN (Virtual LAN):* Memisahkan trafik jaringan kerja umum, ruang persidangan online, server perkara, dan jaringan tamu (*guest*) guna keamanan data.\n` +
      `• *Subnetting:* Efisiensi alokasi blok IP Address (contoh: /24 untuk 254 host) guna mencegah *broadcast storm* dan mempermudah kontrol akses firewall.\n` +
      `• *Backup & Disaster Recovery:* Penerapan kebijakan *RPO* (Recovery Point Objective) dan *RTO* (Recovery Time Objective) untuk memitigasi risiko kehilangan data operasional kantor.`
  }

  if (q.includes('tahap') || q.includes('jadwal') || q.includes('diklat') || q.includes('kurikulum')) {
    return `*Struktur Kurikulum Diklat Fungsional Prakom Agrasena Batch 4 (2026):*\n\n` +
      `1. *Tahap 1: MOOC Mandiri (Hari 1-5, 28 Sep - 2 Okt 2026)* — Penyelesaian modul video, kuis harian, dan tugas rangkuman mandiri.\n` +
      `2. *Tahap 2: Pembelajaran Tatap Muka Online (Hari 6-15, 5 Okt - 16 Okt 2026)* — Perkuliahan interaktif via Zoom bersama Widyaiswara BPS & Badiklat.\n` +
      `3. *Tahap 3: Praktik Laboratorium Prakom (Hari 16-30)* — Implementasi inovasi teknologi informasi pada satuan kerja asal.\n` +
      `4. *Tahap 4: Evaluasi & Seminar Akhir (Hari 31-35)* — Ujian komprehensif dan sidang seminar laporan akhir kelulusan.\n\n` +
      `💡 _Ketik *!jadwal* untuk melihat jadwal hari ini atau *!tugas* untuk tenggat penugasan aktif._`
  }

  return `Hai Nakama Agrasena 4! 🌸 Pertanyaan ini sangat menarik dan berkaitan erat dengan implementasi SPBE, keamanan informasi, serta digitalisasi Kejaksaan modern.\n\n` +
    `Untuk pendalaman materi modul 120 JP lengkap, rekan-rekan dapat mengunduh dokumen referensi di portal resmi:\n` +
    `👉 ${PORTAL_URL}/materials\n\n` +
    `💡 _Coba tanyakan topik spesifik seperti: '!tanya jelaskan cara kerja subnet mask' atau '!tanya apa itu normalisasi 3NF'_`
}

/**
 * Fungsi Utama: Tanya Asisten Cerdas AI seputar IT & Materi Diklat Prakom Kejaksaan RI
 */
async function askAiAssistant(question) {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    let msg = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4* 🌸\n`
    msg += `*Kejaksaan Republik Indonesia 2026*\n`
    msg += `────────────────────────\n\n`
    msg += `Konnichiwa, Rekan Nakama! Silakan ajukan pertanyaan seputar kompetensi IT, SPBE, database, jaringan, atau materi Diklat.\n\n`
    msg += `💡 *Contoh Perintah:*\n`
    msg += `• *!tanya jelaskan konsep SPBE dan peran Pranata Komputer*\n`
    msg += `• *!tanya apa perbedaan jenjang Prakom Terampil dan Ahli?*\n`
    msg += `• *!tanya bagaimana cara membuat query SQL JOIN antar tabel?*\n`
    msg += `• *!ai apa fungsi segmentasi VLAN di jaringan kantor satker?*\n\n`
    msg += `────────────────────────\n`
    msg += `🌐 *Portal Resmi Kelas:* ${PORTAL_URL}`
    return { success: false, text: msg }
  }

  const prompt = question.trim()

  // 1. Cek Cache Cepat (0ms Latency, 0 Token Cost)
  const cachedAnswer = getCachedAnswer(prompt)
  if (cachedAnswer) {
    let reply = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
    reply += `*Kejaksaan Republik Indonesia*\n`
    reply += `────────────────────────\n\n`
    reply += `${cachedAnswer}\n\n`
    reply += `────────────────────────\n`
    reply += `🌐 *Portal Web Kelas:* ${PORTAL_URL}\n`
    reply += `💡 _Ketik *!tanya <pertanyaan>* untuk berdiskusi lebih lanjut._`
    return { success: true, text: reply }
  }

  let answer = null

  // 2. TIER 1: Model Utama Groq 120B (openai/gpt-oss-120b) dengan Rotasi Multi-Key
  answer = await callGroqWithRotation('openai/gpt-oss-120b', prompt, 11000)

  // 3. TIER 2: Model Spesialis Teknis Groq 27B (qwen/qwen3.8-27b)
  if (!answer) {
    answer = await callGroqWithRotation('qwen/qwen3.8-27b', prompt, 10000)
  }

  // 4. TIER 3: Model Alternatif Groq 20B (openai/gpt-oss-20b)
  if (!answer) {
    answer = await callGroqWithRotation('openai/gpt-oss-20b', prompt, 9000)
  }

  // 5. TIER 4: Fallback ke OpenRouter Multi-Key
  if (!answer) {
    answer = await callOpenRouterWithRotation(prompt, 9000)
  }

  // 6. TIER 5: Smart Local Knowledge Base (Terjamin Selalu Menjawab & Anti-Gagal)
  if (!answer) {
    answer = getSmartLocalAnswer(prompt)
  }

  // Simpan ke Cache jika berhasil
  if (answer) {
    setCachedAnswer(prompt, answer)
  }

  let reply = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
  reply += `*Kejaksaan Republik Indonesia*\n`
  reply += `────────────────────────\n\n`
  reply += `${answer}\n\n`
  reply += `────────────────────────\n`
  reply += `🌐 *Portal Web Kelas:* ${PORTAL_URL}\n`
  reply += `💡 _Ketik *!tanya <pertanyaan>* untuk berdiskusi lebih lanjut._`

  return { success: true, text: reply }
}

module.exports = {
  askAiAssistant,
}
