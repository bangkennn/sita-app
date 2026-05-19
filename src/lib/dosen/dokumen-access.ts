import type { Dosen } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getDokumenForDosen(dokumenId: string, dosen: Dosen) {
  const dokumen = await prisma.dokumen.findUnique({
    where: { id: dokumenId },
    include: {
      pengajuan: {
        include: {
          mahasiswa: { include: { user: { select: { id: true } } } },
        },
      },
    },
  })

  if (!dokumen) {
    return { dokumen: null, error: "not_found" as const }
  }

  const { pengajuan } = dokumen
  if (pengajuan.dosenId !== dosen.id && pengajuan.dosenId2 !== dosen.id) {
    return { dokumen: null, error: "forbidden" as const }
  }

  return { dokumen, error: null }
}
