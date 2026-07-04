import { redirect } from "next/navigation"
import { getAllowedAdminSession } from "@/lib/admin-session"

// Deliberately NOT nested under admin/(protected) — Studio needs the full
// viewport, not squeezed inside the admin sidebar/topbar chrome. Still
// guarded by the same session + email-allowlist check as the rest of /admin.
export default async function ContentStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAllowedAdminSession()
  if (!session) {
    redirect("/admin/login?next=/admin/content-studio")
  }

  return <>{children}</>
}
