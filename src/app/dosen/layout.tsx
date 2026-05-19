import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { DosenShell } from "@/components/dosen/dosen-shell"
import { auth } from "@/auth"
import { getDashboardPath } from "@/lib/dashboard"
import type { DosenProfile } from "@/lib/dosen/types"
import { getDosenByUserId } from "@/lib/dosen/auth"

export const metadata: Metadata = {
  title: {
    default: "Portal Dosen",
    template: "%s | Dosen SiTA",
  },
}

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

  return (
    <>
      <DosenShell profile={profile}>
        {children}
      </DosenShell>
    </>
  )
}
