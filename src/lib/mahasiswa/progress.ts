import type { FaseBimbingan, StatusPengajuan } from "@prisma/client"

export const PROGRESS_STEPS = [
  { key: "pengajuan", label: "Pengajuan" },
  { key: "diterima", label: "Diterima" },
  { key: "bab_1_3", label: "Bab 1-3" },
  { key: "sempro", label: "Sempro" },
  { key: "bab_4_5", label: "Bab 4-5" },
  { key: "selesai", label: "Selesai" },
] as const

export function getProgressStepIndex(
  status: StatusPengajuan | null,
  fase: FaseBimbingan | null
): number {
  if (!status) return 0

  if (status === "MENUNGGU") return 0
  if (status === "DITOLAK") return 0

  if (status === "DITERIMA") {
    switch (fase) {
      case "BAB_1_3":
        return 2
      case "SEMPRO":
        return 3
      case "BAB_4_5":
        return 4
      case "SELESAI":
        return 5
      default:
        return 1
    }
  }

  return 0
}
