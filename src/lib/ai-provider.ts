export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface GenerateAiOptions {
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  userApiKey?: string
  mustIncludeKeyPhrases?: string[]
}

export interface GenerateAiResult {
  text: string
  model: string
  provider: "openrouter" | "groq" | "fallback"
}

function cleanModelText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return ""
  let cleaned = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
    .replace(/```thinking[\s\S]*?```/gi, "")
    .trim()
  if (cleaned.length < 5 && rawText.trim().length > 5) {
    cleaned = rawText.replace(/<\/?(think|thought)>/gi, "").trim()
  }
  return cleaned.length > 0 ? cleaned : rawText.trim()
}

async function fetchGroqSingle(
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  temperature: number,
  max_tokens: number,
  timeoutMs = 12000,
  mustIncludeKeyPhrases?: string[]
): Promise<GenerateAiResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const err = await res.text().catch(() => "")
      throw new Error(`Groq ${model} error ${res.status}: ${err}`)
    }

    const data = await res.json()
    const choice = data.choices?.[0]
    const raw = choice?.message?.content || choice?.message?.reasoning || ""
    const text = cleanModelText(raw)

    if (text.length < 3) {
      throw new Error(`Empty response from Groq ${model}`)
    }

    if (mustIncludeKeyPhrases && mustIncludeKeyPhrases.length > 0) {
      const hasKeyPhrase = mustIncludeKeyPhrases.some((phrase) =>
        text.toLowerCase().includes(phrase.toLowerCase())
      )
      if (!hasKeyPhrase) {
        throw new Error(`Incomplete response from Groq ${model}: missing key phrases`)
      }
    }

    return {
      text,
      model,
      provider: "groq",
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchOpenRouterSingle(
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  temperature: number,
  max_tokens: number,
  timeoutMs = 12000,
  mustIncludeKeyPhrases?: string[]
): Promise<GenerateAiResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://prakom-batch3.kejaksaan.go.id",
        "X-Title": "Agrasena Diklat Prakom Batch 3",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const err = await res.text().catch(() => "")
      throw new Error(`OpenRouter ${model} error ${res.status}: ${err}`)
    }

    const data = await res.json()
    const choice = data.choices?.[0]
    const raw = choice?.message?.content || choice?.message?.reasoning || ""
    const text = cleanModelText(raw)

    if (text.length < 3) {
      throw new Error(`Empty response from ${model}`)
    }

    if (mustIncludeKeyPhrases && mustIncludeKeyPhrases.length > 0) {
      const hasKeyPhrase = mustIncludeKeyPhrases.some((phrase) =>
        text.toLowerCase().includes(phrase.toLowerCase())
      )
      if (!hasKeyPhrase) {
        throw new Error(`Incomplete response from ${model}: missing key phrases`)
      }
    }

    return {
      text,
      model: data.model || model,
      provider: "openrouter",
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function generateAiCompletion(options: GenerateAiOptions): Promise<GenerateAiResult> {
  const { messages, temperature = 0.35, max_tokens = 2500, userApiKey, mustIncludeKeyPhrases } = options

  const openRouterKey =
    (userApiKey && userApiKey.startsWith("sk-or-") ? userApiKey : null) ||
    process.env.OPENROUTER_API_KEY

  const groqKey =
    process.env.GROQ_API_KEY ||
    (userApiKey && !userApiKey.startsWith("sk-or-") ? userApiKey : null)

  const raceTimeoutMs = 12000

  // 1. FAST HIGH-SPEED RACE (Concurrent Multi-Model Dispatch)
  const raceCandidates: Promise<GenerateAiResult>[] = []

  if (groqKey) {
    // Primary High-Speed Groq Models
    raceCandidates.push(
      fetchGroqSingle("openai/gpt-oss-120b", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchGroqSingle("qwen/qwen3.8-27b", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchGroqSingle("groq/compound-mini", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
  }

  if (openRouterKey) {
    // OpenRouter Free Racers
    raceCandidates.push(
      fetchOpenRouterSingle("minimax/minimax-m3:free", messages, openRouterKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchOpenRouterSingle("z-ai/glm-5.2:free", messages, openRouterKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
  }

  if (raceCandidates.length > 0) {
    try {
      const winner = await Promise.any(raceCandidates)
      if (winner && winner.text && winner.text.length > 5) {
        return winner
      }
    } catch {
      // Parallel race failed, proceed to sequential fallback
    }
  }

  // 2. SEQUENTIAL RELIABLE RECOVERY
  if (groqKey) {
    try {
      return await fetchGroqSingle("openai/gpt-oss-120b", messages, groqKey, temperature, max_tokens, 10000, mustIncludeKeyPhrases)
    } catch {
      // Try next
    }
    try {
      return await fetchGroqSingle("qwen/qwen3.8-27b", messages, groqKey, temperature, max_tokens, 10000, mustIncludeKeyPhrases)
    } catch {
      // Try next
    }
  }

  if (openRouterKey) {
    try {
      return await fetchOpenRouterSingle("minimax/minimax-m3:free", messages, openRouterKey, temperature, max_tokens, 10000, mustIncludeKeyPhrases)
    } catch {
      // Next
    }
  }

  // 3. KNOWLEDGE-AWARE LOCAL FALLBACK (Ensures bot ALWAYS gives a helpful response)
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || ""
  const query = lastUserMsg.toLowerCase()

  let fallbackResponse = `Halo Rekan Prakom! 👋

Saya **AI Copilot & Widyaiswara Prakom Batch 3 Kejaksaan RI**. Ada yang bisa saya bantu terkait:
- 📅 **Jadwal & Agenda 35 Hari**: Silakan cek menu **/schedules**
- 📘 **Pustaka Modul 120 JP & PDF**: Silakan akses menu **/materials**
- 📝 **Tugas Mandiri & Deadline**: Silakan pantau di menu **/tasks**
- 🏛️ **Domain SPBE & Angka Kredit DUPAK**: Tanyakan langsung butir kegiatan Anda!

Silakan ketik pertanyaan spesifik Anda, saya siap membantu.`

  const now = new Date()
  const wibDay = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60 * 1000).getDay()
  const isWibWeekend = wibDay === 0 || wibDay === 6

  if (query.includes("jadwal") || query.includes("hari ini") || query.includes("besok") || query.includes("ada ga") || query.includes("ada jadwal")) {
    if (isWibWeekend) {
      fallbackResponse = `Halo Rekan Prakom! 👋

Hari ini adalah **HARI LIBUR AKHIR PEKAN (${wibDay === 6 ? "Sabtu" : "Minggu"})**, jadi **TIDAK ADA JADWAL PERKULIAHAN / SESI ZOOM HARI INI**.

📅 **Jadwal Perkuliahan Berikutnya:**
- **Mulai**: ${wibDay === 6 ? "Lusa (Senin, 31 Agustus 2026)" : "Besok (Senin, 31 Agustus 2026)"}
- **Tahap**: Hari ke-6 (Tahap 2 • TMO)
- **Sesi Pagi (09:30 – 10:15 WIB)**: Building Learning Commitment bersama Tiyar Tunjungsari, S.Kom., M.T.I.
- **Sesi Siang (13:00 – 13:45 WIB)**: PRE TEST (Pusdiklat BPS)

Untuk rincian lengkap 35 hari, silakan kunjungi menu **/schedules**!`
    } else {
      fallbackResponse = `📅 **Informasi Jadwal Diklat Prakom Batch 3**:
- Sesi aktif berikutnya: **Senin, 31 Agustus 2026** (Hari ke-6 • Tahap 2 TMO).
- **Mata Pelatihan**: Building Learning Commitment (BLC) pukul 09:30 – 10:15 WIB bersama Tiyar Tunjungsari, S.Kom., M.T.I.
- Untuk rincian lengkap 35 hari, silakan kunjungi menu **/schedules**!`
    }
  } else if (query.includes("tugas") || query.includes("deadline") || query.includes("tenggat")) {
    fallbackResponse = `📝 **Informasi Penugasan**:
- Seluruh tugas Tahap 1 MOOC telah selesai dikumpulkan.
- Saat ini adalah masa rehat akhir pekan menjelang Tahap 2 TMO pada hari Senin.
- Anda dapat memeriksa status tugas dan link portal pengumpulan di menu **/tasks**.`
  } else if (query.includes("spbe") || query.includes("domain")) {
    fallbackResponse = `🏛️ **4 Domain & 8 Aspek SPBE (Perpres No. 95/2018)**:
1. **Domain Kebijakan SPBE**: Tata kelola regulasi internal & SOP TIK.
2. **Domain Tata Kelola SPBE**: Kelembagaan, arsitektur, dan peta rencana SPBE.
3. **Domain Manajemen SPBE**: Manajemen risiko, keamanan data, aset TIK, dan SDM.
4. **Domain Layanan SPBE**: Layanan administrasi pemerintahan & layanan publik berbasis elektronik.`
  } else if (query.includes("angka kredit") || query.includes("ak") || query.includes("dupak")) {
    fallbackResponse = `📊 **Perhitungan Angka Kredit Pranata Komputer (PermenPAN-RB 1/2023 & BPS)**:
- Angka Kredit kini diintegrasikan melalui konversi predikat kinerja tahunan (SKP):
  * **Sangat Baik**: 150% x Koefisien Tahunan
  * **Baik**: 100% x Koefisien Tahunan
  * **Cukup**: 75% x Koefisien Tahunan
- Template rekapitulasi butir kegiatan dapat Anda unduh di menu **/templates**.`
  }

  return {
    text: fallbackResponse,
    model: "knowledge-engine",
    provider: "fallback",
  }
}
