"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface Question {
  id: number
  productSlug: string
  name: string
  question: string
  answer: string | null
  answeredAt: Date | string | null
  createdAt: Date | string
}

export function QuestionsList({ questions: initialQuestions }: { questions: Question[] }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

  async function submitAnswer(id: number) {
    const answer = drafts[id]?.trim()
    if (!answer) return
    setSavingId(id)
    await fetch("/api/admin/questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, answer }),
    })
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer, answeredAt: new Date() } : q)))
    setSavingId(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => (
        <div key={q.id} className="rounded-[14px] border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-heading font-bold text-[14px] text-ink">{q.name}</p>
              <p className="mt-0.5 font-mono text-[10px] text-sage">{q.productSlug}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase ${
              q.answer ? "bg-success/15 text-success" : "bg-gold/15 text-gold-700"
            }`}>
              {q.answer ? "Answered" : "Pending"}
            </span>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[1.55] text-slate">&ldquo;{q.question}&rdquo;</p>

          {q.answer ? (
            <div className="mt-3 rounded-[10px] bg-surface px-3.5 py-3">
              <p className="font-mono text-[9.5px] uppercase tracking-[1px] text-gold-700">Your answer</p>
              <p className="mt-1 text-[13px] text-ink">{q.answer}</p>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <input
                value={drafts[q.id] ?? ""}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Type your answer…"
                className="flex-1 rounded-[8px] border border-border-strong bg-white px-3 py-2 text-[12.5px] text-ink placeholder:text-sage/50 focus:border-forest focus:outline-none"
              />
              <button
                type="button"
                onClick={() => submitAnswer(q.id)}
                disabled={savingId === q.id || !drafts[q.id]?.trim()}
                className="flex min-w-[80px] items-center justify-center gap-1.5 rounded-[8px] bg-forest px-3.5 py-2 font-heading font-bold text-[12px] text-bone disabled:opacity-50"
              >
                {savingId === q.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Answer"}
              </button>
            </div>
          )}

          <p className="mt-2.5 font-mono text-[10px] text-mist">
            {new Date(q.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  )
}
