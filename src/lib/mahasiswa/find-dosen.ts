import type { MatchedDosen } from "@/lib/mahasiswa/types"
import { prisma } from "@/lib/prisma"

const dosenSelect = {
  id: true,
  nama: true,
  nip: true,
  prodi: true,
} as const

export async function findMatchingDosen(
  namaDosen: string
): Promise<MatchedDosen | null> {
  const exact = await prisma.dosen.findFirst({
    where: {
      isActive: true,
      nama: { equals: namaDosen, mode: "insensitive" },
    },
    select: dosenSelect,
  })
  if (exact) return exact

  return prisma.dosen.findFirst({
    where: {
      isActive: true,
      nama: { contains: namaDosen, mode: "insensitive" },
    },
    select: dosenSelect,
  })
}
