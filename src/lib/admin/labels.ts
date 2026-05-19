import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

export const FASE_LABELS: Record<FaseBimbingan, string> = {
  BAB_1_3: "Bab 1-3",
  SEMPRO: "Sempro",
  BAB_4_5: "Bab 4-5",
  SELESAI: "Selesai",
}

export const STATUS_LABELS: Record<StatusPengajuan, string> = {
  MENUNGGU: "Menunggu",
  DITERIMA: "Diterima",
  DITOLAK: "Ditolak",
}

export const STATUS_BAB_LABELS: Record<StatusBab, string> = {
  BELUM_UPLOAD: "Belum Upload",
  MENUNGGU_REVIEW: "Menunggu Review",
  PERLU_REVISI: "Perlu Revisi",
  ACC: "ACC",
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
