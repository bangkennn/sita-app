import { auth } from "@/auth"
import { getDosenByUserId } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

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

    return {
      mahasiswaAktif,
      dokumenMenunggu,
      permohonanBaru,
      totalSelesai,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang, {dosen.nama}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Mahasiswa Aktif"
          value={stats.mahasiswaAktif}
          description="Sedang bimbingan"
        />
        <StatCard
          title="Dokumen Menunggu Review"
          value={stats.dokumenMenunggu}
          description="Perlu ditinjau"
        />
        <StatCard
          title="Permohonan Baru"
          value={stats.permohonanBaru}
          description="Menunggu persetujuan"
        />
        <StatCard
          title="Total Selesai"
          value={stats.totalSelesai}
          description="Bimbingan selesai"
        />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: number
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
