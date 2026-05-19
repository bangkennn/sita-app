import type { NotifikasiItem, PengajuanDetail } from "@/lib/mahasiswa/types"
import { prisma } from "@/lib/prisma"

const dosenSelect = {
  id: true,
  nama: true,
  nip: true,
  prodi: true,
} as const

export async function getUnreadNotifikasiCount(userId: string): Promise<number> {
  return prisma.notifikasi.count({
    where: { userId, isRead: false },
  })
}

export async function getRecentNotifikasi(
  userId: string,
  limit = 3
): Promise<NotifikasiItem[]> {
  const rows = await prisma.notifikasi.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return rows.map((row) => ({
    id: row.id,
    pesan: row.pesan,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }))
}

export async function getPengajuanByMahasiswaId(
  mahasiswaId: string
): Promise<PengajuanDetail | null> {
  const row = await prisma.pengajuan.findUnique({
    where: { mahasiswaId },
    include: {
      dosen: { select: dosenSelect },
      dosen2: { select: dosenSelect },
    },
  })

  if (!row) return null

  return {
    id: row.id,
    judulSkripsi: row.judulSkripsi,
    status: row.status,
    fase: row.fase,
    skFileUrl: row.skFileUrl,
    catatanDosen: row.catatanDosen,
    createdAt: row.createdAt.toISOString(),
    dosen: row.dosen,
    dosen2: row.dosen2,
  }
}
