import {
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Users,
} from "lucide-react"
import type { Metadata } from "next"

import { StatsCard } from "@/components/admin/stats-card"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { auth } from "@/auth"
import { getDosenByUserId } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Dashboard Dosen",
}

export default async function DosenDashboardPage() {
  const session = await auth()
  const dosen = session?.user ? await getDosenByUserId(session.user.id) : null

  if (!dosen) {
    return null
  }

  const stats = await prisma.$transaction(async (tx) => {
    const mahasiswaAktif = await tx.pengajuan.count({
      where: {
        OR: [{ dosenId: dosen.id }, { dosenId2: dosen.id }],
        status: "DITERIMA",
        fase: { in: ["BAB_1_3", "SEMPRO", "BAB_4_5"] },
      },
    })

    const dokumenMenunggu = await tx.dokumen.count({
      where: {
        pengajuan: {
          OR: [{ dosenId: dosen.id }, { dosenId2: dosen.id }],
        },
        status: "MENUNGGU_REVIEW",
      },
    })

    const permohonanBaru = await tx.pengajuan.count({
      where: {
        OR: [{ dosenId: dosen.id }, { dosenId2: dosen.id }],
        status: "MENUNGGU",
      },
    })

    const totalSelesai = await tx.pengajuan.count({
      where: {
        OR: [{ dosenId: dosen.id }, { dosenId2: dosen.id }],
        fase: "SELESAI",
      },
    })

    return { mahasiswaAktif, dokumenMenunggu, permohonanBaru, totalSelesai }
  })

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={dosen.nama}
        roleLabel="Dosen Pembimbing"
        description={`${dosen.prodi} · NIP ${dosen.nip}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mahasiswa Aktif"
          value={stats.mahasiswaAktif}
          icon={Users}
          description="Sedang bimbingan"
          index={0}
        />
        <StatsCard
          title="Dokumen Review"
          value={stats.dokumenMenunggu}
          icon={FileSearch}
          description="Perlu ditinjau"
          index={1}
        />
        <StatsCard
          title="Permohonan Baru"
          value={stats.permohonanBaru}
          icon={ClipboardList}
          description="Menunggu persetujuan"
          index={2}
        />
        <StatsCard
          title="Total Selesai"
          value={stats.totalSelesai}
          icon={CheckCircle2}
          description="Bimbingan selesai"
          index={3}
        />
      </div>
    </div>
  )
}
