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

// 100% Free Chat & Code Models on OpenRouter (Prioritizing Free GLM 5.2)
const OPENROUTER_FREE_MODELS = [
  "z-ai/glm-5.2:free",
  "minimax/minimax-m3:free",
  "cohere/north-mini-code:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "inclusionai/ling-3.0-flash-fin:free",
  "minimax/minimax-m2.7:free",
]

const GROQ_MODELS = [
  "qwen/qwen3.8-27b",
  "groq/compound-mini",
  "groq/compound",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
]

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

async function fetchOpenRouterSingle(
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  temperature: number,
  max_tokens: number,
  timeoutMs = 15000,
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

    if (text.length < 5) {
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

async function fetchGroqSingle(
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  temperature: number,
  max_tokens: number,
  timeoutMs = 15000,
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

    if (text.length < 5) {
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

export async function generateAiCompletion(options: GenerateAiOptions): Promise<GenerateAiResult> {
  const { messages, temperature = 0.35, max_tokens = 2500, userApiKey, mustIncludeKeyPhrases } = options

  const openRouterKey =
    (userApiKey && userApiKey.startsWith("sk-or-") ? userApiKey : null) ||
    process.env.OPENROUTER_API_KEY

  const groqKey =
    process.env.GROQ_API_KEY ||
    (userApiKey && !userApiKey.startsWith("sk-or-") ? userApiKey : null)

  // Fast Vercel-optimized timeout (under 5 seconds to guarantee instant response)
  const raceTimeoutMs = 5000

  // 1. FAST HIGH-SPEED RACE (Concurrent Multi-Model Dispatch)
  const raceCandidates: Promise<GenerateAiResult>[] = []

  if (groqKey) {
    // Groq High-Speed Racers
    raceCandidates.push(
      fetchGroqSingle("qwen/qwen3.8-27b", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchGroqSingle("groq/compound-mini", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchGroqSingle("groq/compound", messages, groqKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
  }

  if (openRouterKey) {
    // OpenRouter Free Racers
    raceCandidates.push(
      fetchOpenRouterSingle("z-ai/glm-5.2:free", messages, openRouterKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
    raceCandidates.push(
      fetchOpenRouterSingle("minimax/minimax-m3:free", messages, openRouterKey, temperature, max_tokens, raceTimeoutMs, mustIncludeKeyPhrases)
    )
  }

  if (raceCandidates.length > 0) {
    try {
      const winner = await Promise.any(raceCandidates)
      if (winner && winner.text && winner.text.length > 10) {
        return winner
      }
    } catch {
      // Parallel race failed, proceed to fast recovery
    }
  }

  // 2. QUICK RECOVERY (Only 1 direct backup attempt)
  if (groqKey) {
    try {
      return await fetchGroqSingle("groq/compound-mini", messages, groqKey, temperature, max_tokens, 2500, mustIncludeKeyPhrases)
    } catch {
      // Next
    }
  }

  if (openRouterKey) {
    try {
      return await fetchOpenRouterSingle("z-ai/glm-5.2:free", messages, openRouterKey, temperature, max_tokens, 2500, mustIncludeKeyPhrases)
    } catch {
      // Next
    }
  }

  // 3. Emergency Fallback
  return {
    text: "Halo Rekan Prakom! Server AI sedang memproses permintaan dengan beban antrean tinggi. Silakan ulangi permintaan Anda.",
    model: "system-fallback",
    provider: "fallback",
  }
}
