export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface GenerateAiOptions {
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  userApiKey?: string
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
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
]

function cleanModelText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return ""
  const cleaned = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```thinking[\s\S]*?```/gi, "")
    .trim()
  return cleaned.length > 5 ? cleaned : rawText.trim()
}

async function fetchOpenRouterSingle(
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  temperature: number,
  max_tokens: number,
  timeoutMs = 12000
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
  timeoutMs = 12000
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
    const text = cleanModelText(data.choices?.[0]?.message?.content || "")

    if (text.length < 5) {
      throw new Error(`Empty response from Groq ${model}`)
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
  const { messages, temperature = 0.4, max_tokens = 2500, userApiKey } = options

  const openRouterKey =
    (userApiKey && userApiKey.startsWith("sk-or-") ? userApiKey : null) ||
    process.env.OPENROUTER_API_KEY

  const groqKey =
    process.env.GROQ_API_KEY ||
    (userApiKey && !userApiKey.startsWith("sk-or-") ? userApiKey : null)

  // 1. FAST HIGH-SPEED RACE (Concurrent Multi-Model Dispatch)
  const raceCandidates: Promise<GenerateAiResult>[] = []

  if (openRouterKey) {
    // OpenRouter GLM 5.2 Free Priority Racer
    raceCandidates.push(
      fetchOpenRouterSingle("z-ai/glm-5.2:free", messages, openRouterKey, temperature, max_tokens, 12000)
    )
    // OpenRouter Minimax M3 Free Racer
    raceCandidates.push(
      fetchOpenRouterSingle("minimax/minimax-m3:free", messages, openRouterKey, temperature, max_tokens, 12000)
    )
    // OpenRouter Cohere North Mini Code Free Racer
    raceCandidates.push(
      fetchOpenRouterSingle("cohere/north-mini-code:free", messages, openRouterKey, temperature, max_tokens, 12000)
    )
  }

  if (groqKey) {
    // Groq High-Speed Racers (< 1s latency)
    raceCandidates.push(
      fetchGroqSingle("qwen/qwen3.8-27b", messages, groqKey, temperature, max_tokens, 12000)
    )
    raceCandidates.push(
      fetchGroqSingle("openai/gpt-oss-20b", messages, groqKey, temperature, max_tokens, 12000)
    )
  }

  if (raceCandidates.length > 0) {
    try {
      const winner = await Promise.any(raceCandidates)
      if (winner && winner.text && winner.text.length > 10) {
        return winner
      }
    } catch {
      // Parallel race failed, proceed to fallback sequence
    }
  }

  // 2. BACKUP POOL (Sequential Recovery)
  if (openRouterKey) {
    for (const m of OPENROUTER_FREE_MODELS) {
      try {
        return await fetchOpenRouterSingle(m, messages, openRouterKey, temperature, max_tokens, 5000)
      } catch {
        // Next
      }
    }
  }

  if (groqKey) {
    for (const gm of GROQ_MODELS) {
      try {
        return await fetchGroqSingle(gm, messages, groqKey, temperature, max_tokens, 5000)
      } catch {
        // Next
      }
    }
  }

  // 3. Emergency Static Fallback
  return {
    text: "Halo Rekan Prakom! Server AI sedang memproses permintaan dengan beban antrean tinggi. Silakan ulangi pertanyaan Anda.",
    model: "system-fallback",
    provider: "fallback",
  }
}
