import { redirect } from "next/navigation"
import { Toaster } from "sonner"

import { DosenShell } from "@/components/dosen/dosen-shell"
import { auth } from "@/auth"
import { getDashboardPath } from "@/lib/dashboard"
import { getUnreadNotifikasiCount } from "@/lib/dosen/queries"
import type { DosenProfile } from "@/lib/dosen/types"
import { getDosenByUserId } from "@/lib/dosen/auth"

export default async function DosenLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "DOSEN") {
    redirect(getDashboardPath(session.user.role))
  }

  const dosen = await getDosenByUserId(session.user.id)

  if (!dosen) {
    redirect("/login")
  }

  const profile: DosenProfile = {
    id: dosen.id,
    nama: dosen.nama,
    nip: dosen.nip,
    prodi: dosen.prodi,
  }

  const unreadCount = await getUnreadNotifikasiCount(session.user.id)

  return (
    <>
      <DosenShell profile={profile} unreadCount={unreadCount}>
        {children}
      </DosenShell>
      <Toaster richColors position="top-right" />
    </>
  )
}
