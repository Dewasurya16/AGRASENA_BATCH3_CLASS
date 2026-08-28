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

// Highly responsive active Free Models on OpenRouter (Prioritizing GLM 5.2)
const OPENROUTER_FREE_MODELS = [
  "z-ai/glm-5.2:free",
  "z-ai/glm-5.3-flash",
  "~z-ai/glm-latest",
  "z-ai/glm-5.2",
  "openrouter/free",
  "minimax/minimax-m3:free",
  "cohere/north-mini-code:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "inclusionai/ling-3.0-flash-fin:free",
  "minimax/minimax-m2.7:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
]

const GROQ_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound",
]

export async function generateAiCompletion(options: GenerateAiOptions): Promise<GenerateAiResult> {
  const { messages, temperature = 0.4, max_tokens = 2500, userApiKey } = options

  // 1. OPENROUTER ATTEMPT (Priority)
  const openRouterKey =
    (userApiKey && userApiKey.startsWith("sk-or-") ? userApiKey : null) ||
    process.env.OPENROUTER_API_KEY

  if (openRouterKey) {
    for (const model of OPENROUTER_FREE_MODELS) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 12000)

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openRouterKey}`,
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

        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const choice = data.choices?.[0]
          let rawText = choice?.message?.content || choice?.message?.reasoning || ""
          
          // Remove <think>...</think> if present from reasoning models
          if (typeof rawText === "string") {
            const cleanedText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```thinking[\s\S]*?```/gi, "").trim()
            const finalText = cleanedText.length > 5 ? cleanedText : rawText.trim()
            
            if (finalText.length > 10) {
              return {
                text: finalText,
                model: data.model || model,
                provider: "openrouter",
              }
            }
          }
        } else {
          const errText = await res.text().catch(() => "")
          console.warn(`[AI OpenRouter] Model ${model} (${res.status}):`, errText)
        }
      } catch (err: any) {
        console.warn(`[AI OpenRouter] Model ${model} failed:`, err?.message || err)
      }
    }
  }

  // 2. GROQ ATTEMPT (Secondary Fallback Tier)
  const groqKey =
    process.env.GROQ_API_KEY ||
    (userApiKey && !userApiKey.startsWith("sk-or-") ? userApiKey : null)

  if (groqKey) {
    for (const model of GROQ_MODELS) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const text = data.choices?.[0]?.message?.content
          if (text && text.trim().length > 10) {
            return {
              text: text.trim(),
              model,
              provider: "groq",
            }
          }
        }
      } catch (err: any) {
        console.warn(`[AI Groq] Model ${model} failed:`, err?.message || err)
      }
    }
  }

  // 3. Emergency Fallback
  return {
    text: "Halo Rekan Prakom! Server AI sedang memproses permintaan dengan beban antrean tinggi. Silakan ulangi pertanyaan Anda.",
    model: "system-fallback",
    provider: "fallback",
  }
}
