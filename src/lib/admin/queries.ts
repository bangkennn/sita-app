import type { DashboardStats, RecentPengajuanItem } from "@/lib/admin/types"
import { prisma } from "@/lib/prisma"

const pengajuanAktifWhere = {
  status: "DITERIMA" as const,
  fase: { not: "SELESAI" as const },
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalDosen, totalMahasiswaAktif, totalPengajuanAktif, totalBimbinganSelesai] =
    await Promise.all([
      prisma.dosen.count({ where: { isActive: true } }),
      prisma.mahasiswa.count({
        where: { pengajuan: pengajuanAktifWhere },
      }),
      prisma.pengajuan.count({ where: pengajuanAktifWhere }),
      prisma.pengajuan.count({ where: { fase: "SELESAI" } }),
    ])

  return {
    totalDosen,
    totalMahasiswaAktif,
    totalPengajuanAktif,
    totalBimbinganSelesai,
  }
}

export async function getRecentPengajuan(
  limit = 5
): Promise<RecentPengajuanItem[]> {
  const rows = await prisma.pengajuan.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      mahasiswa: { select: { nama: true, nim: true } },
      dosen: { select: { nama: true } },
      dosen2: { select: { nama: true } },
    },
  })

  return rows.map((row) => ({
    id: row.id,
    judulSkripsi: row.judulSkripsi,
    status: row.status,
    fase: row.fase,
    createdAt: row.createdAt.toISOString(),
    mahasiswa: row.mahasiswa,
    dosen: row.dosen,
    dosen2: row.dosen2,
  }))
}
