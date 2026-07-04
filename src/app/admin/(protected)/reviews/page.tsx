import { getReviews } from "@/lib/neon/queries"
import { EmptyState } from "@/components/ui/empty-state"
import { Star } from "lucide-react"
import { ReviewsList } from "@/components/admin/reviews-list"

export const dynamic = "force-dynamic"

export default async function AdminReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">{reviews.length} reviews</p>

      <div className="mt-5">
        {reviews.length === 0 ? (
          <EmptyState
            icon={<Star className="h-8 w-8 text-slate" />}
            title="No reviews yet"
            description="Customer reviews submitted from product pages will appear here for moderation."
          />
        ) : (
          <ReviewsList reviews={reviews} />
        )}
      </div>
    </div>
  )
}
