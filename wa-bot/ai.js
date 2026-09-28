const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const PORTAL_URL = process.env.PORTAL_URL || 'https://agrasena-batch-3-class.vercel.app/batch-4'

/**
 * Tanya Asisten Cerdas AI seputar IT & Materi Diklat Prakom Kejaksaan RI
 */
async function askAiAssistant(question) {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    let msg = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
    msg += `*Kejaksaan Republik Indonesia 2026*\n`
    msg += `────────────────────────\n\n`
    msg += `Silakan ajukan pertanyaan seputar kompetensi IT, SPBE, atau materi Diklat.\n\n`
    msg += `💡 *Contoh Perintah:*\n`
    msg += `• *!tanya apa perbedaan peran Prakom Terampil dan Ahli?*\n`
    msg += `• *!tanya jelaskan konsep interoperabilitas data SPBE*\n`
    msg += `• *!ai bagaimana tips perancangan database relasional?*\n\n`
    msg += `────────────────────────\n`
    msg += `🌐 *Portal Kelas:* ${PORTAL_URL}`
    return { success: false, text: msg }
  }

  const prompt = question.trim()
  const systemPrompt = `Kamu adalah Asisten Cerdas AI untuk Diklat Fungsional Pranata Komputer Angkatan IV (Agrasena Batch 4) Kejaksaan Republik Indonesia Tahun 2026.
Bantulah rekan-rekan peserta Diklat menjawab pertanyaan mereka seputar:
1. Materi Diklat Pranata Komputer (Pengelolaan Data, Jaringan Komputer, Keamanan Informasi, Manajemen Infrastruktur TI, SPBE, Audit TI).
2. Penerapan TI dan transformasi digital di lingkungan Kejaksaan RI.
3. Tips belajar, tugas mandiri, dan konsep teknis komputasi.

Pedoman Menjawab:
- Jawab secara ringkas, padat, dan jelas (maksimal 2-3 paragraf pendek atau poin-poin singkat).
- Gunakan bahasa Indonesia yang profesional, ramah, dan memotivasi.
- Gunakan formatting rapi untuk WhatsApp (*bold*, _italic_, • bullet point).
- JANGAN berikan link Zoom atau informasi rahasia. Selalu arahkan ke Portal Kelas jika ditanya tentang materi atau jadwal.`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': PORTAL_URL,
        'X-Title': 'Agrasena Batch 4 WA Bot',
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m3:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.35,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const answer = data.choices?.[0]?.message?.content?.trim()
      if (answer) {
        let reply = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
        reply += `*Kejaksaan Republik Indonesia*\n`
        reply += `────────────────────────\n\n`
        reply += `${answer}\n\n`
        reply += `────────────────────────\n`
        reply += `🌐 *Portal Kelas:* ${PORTAL_URL}\n`
        reply += `💡 _Ketik *!tanya <pertanyaan>* untuk bertanya kembali._`
        return { success: true, text: reply }
      }
    }
  } catch (err) {
    console.error('[AI Assistant Error]', err.message)
  }

  // Fallback ramah jika koneksi timeout
  let fallback = `🤖 *ASISTEN AI PRAKOM AGRASENA BATCH 4*\n`
  fallback += `────────────────────────\n\n`
  fallback += `⚠️ Layanan AI sedang memproses antrean padat. Silakan coba ajukan kembali pertanyaan Anda sesaat lagi, atau jelajahi modul lengkap di website kelas:\n\n`
  fallback += `👉 ${PORTAL_URL}/materials\n\n`
  fallback += `────────────────────────\n`
  fallback += `💡 _Ketik *!help* untuk menu perintah lainnya._`
  return { success: true, text: fallback }
}

module.exports = {
  askAiAssistant,
}
