import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AdminShell } from "@/components/admin/admin-shell"
import { auth } from "@/auth"
import { getDashboardPath } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: {
    default: "Panel Admin",
    template: "%s | Admin SiTA",
  },
}

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
    </>
  )
}
