"use client"

import { useEffect, useState } from "react"
import { HelpCircle, Loader2, CheckCircle, MessageCircleQuestion } from "lucide-react"

interface Question {
  id: number
  name: string
  question: string
  answer: string | null
  answeredAt: string | null
  createdAt: string
}

export function ProductQA({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [question, setQuestion] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/questions?productSlug=${encodeURIComponent(productSlug)}`)
      .then((r) => r.json())
      .then((data) => { if (data.questions) setQuestions(data.questions) })
      .catch(() => {})
  }, [productSlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (question.trim().length < 5) {
      setError("Question must be at least 5 characters")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, name, question }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to submit question")
        return
      }
      setSubmitted(true)
      setIsOpen(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading font-bold text-[18px] text-ink">Questions &amp; answers</h2>
        {!isOpen && !submitted && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 font-heading font-bold text-[13px] text-forest hover:text-forest-700"
          >
            <HelpCircle className="h-4 w-4" /> Ask a question
          </button>
        )}
      </div>

      {submitted && (
        <div className="mb-5 rounded-[12px] border border-success/30 bg-success/5 p-4 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-success" />
          <p className="mt-1.5 font-heading font-bold text-[13px] text-ink">Question submitted</p>
          <p className="mt-0.5 text-[12px] text-slate">We&apos;ll answer it soon — check back here.</p>
        </div>
      )}

      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-[12px] border border-border bg-white p-4">
          <div>
            <label htmlFor="qa-name" className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">
              Your name
            </label>
            <input
              id="qa-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-[8px] border border-border-strong bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-sage/50 focus:border-forest focus:outline-none"
              placeholder="e.g. Ahmed K."
            />
          </div>
          <div className="mt-3">
            <label htmlFor="qa-question" className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">
              Your question
            </label>
            <textarea
              id="qa-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={3}
              className="w-full resize-none rounded-[8px] border border-border-strong bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-sage/50 focus:border-forest focus:outline-none"
              placeholder={`Ask anything about the ${productName} — dimensions, finish, delivery time…`}
            />
          </div>
          {error && <p className="mt-2 text-[12px] text-error">{error}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-[8px] border border-border-strong px-4 py-2.5 font-heading font-bold text-[12.5px] text-slate"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim() || question.trim().length < 5}
              className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-forest py-2.5 font-heading font-bold text-[12.5px] text-bone disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit question"}
            </button>
          </div>
        </form>
      )}

      {questions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-border-strong py-8 text-center">
          <MessageCircleQuestion className="h-6 w-6 text-sage" />
          <p className="text-[13px] text-slate">No questions yet — be the first to ask.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-[12px] border border-border bg-white p-4">
              <div className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <p className="text-[13.5px] font-semibold text-ink">{q.question}</p>
              </div>
              <p className="mt-1 pl-6 font-mono text-[10.5px] text-sage">— {q.name}</p>
              {q.answer && (
                <div className="mt-3 rounded-[10px] bg-surface px-3.5 py-3">
                  <p className="font-mono text-[9.5px] uppercase tracking-[1px] text-gold-700">Yousuf Living answers</p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-slate">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
