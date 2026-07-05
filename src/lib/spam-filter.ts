const SPAM_KEYWORDS = [
  "click here", "buy now", "free money", "act now", "limited time offer",
  "www.", "http://", "https://", "casino", "viagra", "crypto giveaway",
  "make money fast", "work from home", "subscribe to my",
]

/**
 * Cheap heuristic spam check for user-submitted text (reviews, Q&A). This
 * only FLAGS content for a human to look at first — it never auto-rejects
 * or auto-publishes anything; every submission still waits for manual
 * approval regardless of this flag.
 */
export function looksLikeSpam(text: string): boolean {
  const lower = text.toLowerCase()

  if (SPAM_KEYWORDS.some((kw) => lower.includes(kw))) return true

  // A run of 5+ identical characters ("aaaaaaa", "!!!!!!!")
  if (/(.)\1{4,}/.test(text)) return true

  // Mostly uppercase in a longer message reads as shouting/spam
  const letters = text.replace(/[^a-zA-Z]/g, "")
  if (letters.length > 20) {
    const upperRatio = (letters.match(/[A-Z]/g) ?? []).length / letters.length
    if (upperRatio > 0.7) return true
  }

  return false
}
