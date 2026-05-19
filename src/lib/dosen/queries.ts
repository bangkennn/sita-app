import type { NotifikasiItem } from "@/lib/dosen/types"
import { prisma } from "@/lib/prisma"

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
