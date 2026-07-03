import "server-only"
import { createHash } from "crypto"
import OpenAI from "openai"
import { redis } from "@/lib/redis"

/**
 * Provider-agnostic AI summary layer. The real LiteLLM project is
 * Python-only (pip install litellm) — there is no maintained Node port, so
 * this reimplements the same contract the spec asks for (one function, one
 * model-per-type env var, swap providers without touching call sites) using
 * the official OpenAI SDK. OpenRouter and most other providers speak the
 * OpenAI wire protocol, so pointing AI_PROVIDER_BASE_URL + AI_API_KEY at a
 * different provider is the same "change an env var" swap the spec wants.
 */

export type SummaryType = "pnl" | "funnel" | "affiliate"

const MODELS: Record<SummaryType, string> = {
  pnl:       process.env.AI_MODEL_PNL ?? "gpt-4o-mini",
  funnel:    process.env.AI_MODEL_FUNNEL ?? "gpt-4o-mini",
  affiliate: process.env.AI_MODEL_AFFILIATE ?? "gpt-4o-mini",
}

const SYSTEM_PROMPTS: Record<SummaryType, string> = {
  pnl: "You are a plain-English business analyst for a small Karachi furniture workshop. Given a month's P&L data (revenue, discounts, affiliate commissions), write a 2-4 sentence summary of what happened and one concrete thing to watch. No headers, no bullet points, just prose.",
  funnel: "You are a conversion analyst for a furniture e-commerce funnel (views -> WhatsApp clicks -> orders). Given per-product funnel data, identify the biggest drop-off and suggest one concrete fix. 2-4 sentences, plain prose.",
  affiliate: "You are analyzing affiliate/referral performance for a furniture brand. Given each affiliate's orders driven and payout owed, summarize the top performer and flag any affiliate with zero recent activity. 2-4 sentences, plain prose.",
}

function client() {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) return null
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_PROVIDER_BASE_URL, // unset = OpenAI default; set to OpenRouter etc. to swap providers
  })
}

export async function generateSummary(type: SummaryType, data: object): Promise<string> {
  const dataHash = createHash("sha256").update(JSON.stringify(data)).digest("hex").slice(0, 16)
  const cacheKey = `ai_summary:${type}:${dataHash}`

  const cached = await redis.get<string>(cacheKey)
  if (cached) return cached

  const ai = client()
  if (!ai) return "" // no API key configured — caller falls back to the raw data table

  try {
    const response = await ai.chat.completions.create({
      model: MODELS[type],
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[type] },
        { role: "user", content: JSON.stringify(data) },
      ],
      max_tokens: 300,
      temperature: 0.2,
    })

    const summary = response.choices[0]?.message?.content ?? ""
    if (summary) {
      await redis.setex(cacheKey, 60 * 60 * 24, summary) // 24h cache
    }
    return summary
  } catch {
    // Summaries are a convenience, not a dependency — never gate the dashboard on this.
    return ""
  }
}
