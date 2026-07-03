import { redirect } from "next/navigation"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAllowedAdminSession()
  if (!session) {
    redirect("/admin/login")
  }

  return <AdminShell userEmail={session.user.email}>{children}</AdminShell>
}
