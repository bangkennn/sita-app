import { redirect } from "next/navigation"
import { Toaster } from "sonner"

import { MahasiswaShell } from "@/components/mahasiswa/mahasiswa-shell"
import { auth } from "@/auth"
import { getDashboardPath } from "@/lib/dashboard"
import type { MahasiswaProfile } from "@/lib/mahasiswa/types"
import { getMahasiswaByUserId } from "@/lib/mahasiswa/auth"

export default async function MahasiswaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "MAHASISWA") {
    redirect(getDashboardPath(session.user.role))
  }

  const mahasiswa = await getMahasiswaByUserId(session.user.id)

  if (!mahasiswa) {
    redirect("/login")
  }

  const profile: MahasiswaProfile = {
    id: mahasiswa.id,
    nama: mahasiswa.nama,
    nim: mahasiswa.nim,
    prodi: mahasiswa.prodi,
    angkatan: mahasiswa.angkatan,
  }

  return (
    <>
      <MahasiswaShell profile={profile}>
        {children}
      </MahasiswaShell>
      <Toaster richColors position="top-right" />
    </>
  )
}
