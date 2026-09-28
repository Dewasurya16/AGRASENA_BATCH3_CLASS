const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const PORTAL_URL = process.env.PORTAL_URL || 'https://agrasena-batch-3-class.vercel.app/batch-4'

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
 * System Prompt Berpengetahuan Mendalam seputar Diklat Prakom Kejaksaan RI
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

Aturan Menjawab:
- Jawablah secara cerdas, lugas, terstruktur, dan akurat (2-4 paragraf atau poin-poin yang mudah dipahami).
- Gunakan bahasa Indonesia baku, profesional, santun, dan memotivasi khas aparatur kejaksaan.
- Gunakan formatting WhatsApp: *bold* untuk istilah penting/poin, • untuk daftar, dan _italic_ untuk catatan.
- Jika ditanya coding/query/perintah CLI (Linux/SQL/Git/Network), berikan contoh sintaks yang benar dan rapi.
- Jangan mengarang data sensitif atau link Zoom privat; arahkan ke Portal Kelas untuk akses Zoom resmi.`

/**
 * Panggilan ke Groq Cloud API
 */
async function callGroq(model, userPrompt, timeoutMs = 12000) {
  if (!GROQ_API_KEY) return null
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 700,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn(`[Groq ${model}] status ${res.status}:`, errText.slice(0, 150))
      return null
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content || ''
    const cleaned = cleanModelOutput(raw)
    return cleaned && cleaned.length >= 10 ? cleaned : null
  } catch (e) {
    console.warn(`[Groq ${model} Error]:`, e.message)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Panggilan ke OpenRouter API (Fallback jika Groq tidak tersedia)
 */
async function callOpenRouter(userPrompt, timeoutMs = 10000) {
  if (!OPENROUTER_API_KEY) return null
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const models = [
    'google/gemini-2.0-flash-thinking-exp:free',
    'sophosympatheia/rogue-rose-103b-v0.2:free',
    'meta-llama/llama-3.1-8b-instruct:free',
  ]

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
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

      if (res.ok) {
        const data = await res.json()
        const raw = data.choices?.[0]?.message?.content || ''
        const cleaned = cleanModelOutput(raw)
        if (cleaned && cleaned.length >= 10) return cleaned
      }
    } catch {
      // Coba model berikutnya
    }
  }
  clearTimeout(timeoutId)
  return null
}

/**
 * Mesin Pengetahuan Lokal Cerdas (Fallback Terjamin Anti-Gagal)
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
      `1. *Kategori Terampil (Pelaksana Teknis):*\n` +
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
      `• *Normalisasi Data (1NF, 2NF, 3NF):* Proses mengorganisasi kolom dan tabel untuk meminimalkan redundansi data dan mencegah anomali pembaruan.\n` +
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

  return `Terima kasih atas pertanyaannya! Dalam konteks kompetensi *Pranata Komputer Kejaksaan RI*, topik ini berkaitan erat dengan penerapan tata kelola sistem informasi, keamanan siber, dan transformasi digital kejaksaan modern.\n\n` +
    `Untuk pengayaan materi lebih spesifik, rekan-rekan dapat mengunduh 9 modul standar kompetensi 120 JP lengkap di portal resmi:\n` +
    `👉 ${PORTAL_URL}/materials\n\n` +
    `💡 _Ajukan pertanyaan teknis seperti: '!tanya jelaskan arsitektur SPBE' atau '!tanya apa fungsi VLAN dalam jaringan satker'_`
}

/**
 * Fungsi Utama: Tanya Asisten Cerdas AI seputar IT & Materi Diklat Prakom Kejaksaan RI
 */
async function askAiAssistant(question) {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    let msg = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
    msg += `*Kejaksaan Republik Indonesia 2026*\n`
    msg += `────────────────────────\n\n`
    msg += `Silakan ajukan pertanyaan seputar kompetensi IT, SPBE, database, jaringan, atau penugasan Diklat.\n\n`
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

  // 1. TIER 1: Model Super Pintar & Cepat Groq 120B (openai/gpt-oss-120b)
  let answer = await callGroq('openai/gpt-oss-120b', prompt, 10000)

  // 2. TIER 2: Model Groq Qwen 27B (Spesialis Teknis & Coding)
  if (!answer) {
    answer = await callGroq('qwen/qwen3.8-27b', prompt, 10000)
  }

  // 3. TIER 3: Model OpenRouter Fallback
  if (!answer) {
    answer = await callOpenRouter(prompt, 9000)
  }

  // 4. TIER 4: Smart Domain Knowledge Engine (Selalu Berhasil Memberikan Jawaban Berbobot)
  if (!answer) {
    answer = getSmartLocalAnswer(prompt)
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
