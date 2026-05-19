import type { NotifikasiItem } from "@/lib/notifications/types"
import { prisma } from "@/lib/prisma"

const pengajuanSelect = {
  id: true,
  judulSkripsi: true,
  mahasiswa: {
    select: {
      nama: true,
      nim: true,
    },
  },
} as const

export async function getUnreadNotifikasiCount(userId: string): Promise<number> {
  return prisma.notifikasi.count({
    where: { userId, isRead: false },
  })
}

export async function getNotifikasiForUser(
  userId: string,
  limit?: number
): Promise<NotifikasiItem[]> {
  const rows = await prisma.notifikasi.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    ...(limit !== undefined ? { take: limit } : {}),
    include: {
      pengajuan: { select: pengajuanSelect },
    },
  })

  return rows.map((row) => ({
    id: row.id,
    pesan: row.pesan,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
    pengajuan: {
      id: row.pengajuan.id,
      judulSkripsi: row.pengajuan.judulSkripsi,
      mahasiswa: row.pengajuan.mahasiswa,
    },
  }))
}
