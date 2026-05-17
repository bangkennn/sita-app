import { redirect } from "next/navigation"

import { AdminShell } from "@/components/admin/admin-shell"
import { Toaster } from "sonner"
import { auth } from "@/auth"
import { getDashboardPath } from "@/lib/dashboard"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect(getDashboardPath(session.user.role))
  }

  return (
    <>
      <AdminShell adminName={session.user.nama}>{children}</AdminShell>
      <Toaster richColors position="top-right" />
    </>
  )
}
