import { getQuestions } from "@/lib/neon/queries"
import { EmptyState } from "@/components/ui/empty-state"
import { HelpCircle } from "lucide-react"
import { QuestionsList } from "@/components/admin/questions-list"

export const dynamic = "force-dynamic"

export default async function AdminQuestionsPage() {
  const questions = await getQuestions()
  const pending = questions.filter((q) => !q.answer).length

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">{pending} pending · {questions.length} total</p>

      <div className="mt-5">
        {questions.length === 0 ? (
          <EmptyState
            icon={<HelpCircle className="h-8 w-8 text-slate" />}
            title="No questions yet"
            description="Customer questions submitted from product pages will appear here for you to answer."
          />
        ) : (
          <QuestionsList questions={questions} />
        )}
      </div>
    </div>
  )
}
