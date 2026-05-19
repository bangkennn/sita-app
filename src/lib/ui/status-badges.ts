import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

import { cn } from "@/lib/utils"

const pill =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"

export const STATUS_PENGAJUAN_STYLES: Record<StatusPengajuan, string> = {
  MENUNGGU: cn(pill, "border-amber-200 bg-amber-50 text-amber-700"),
  DITERIMA: cn(pill, "border-emerald-200 bg-emerald-50 text-emerald-700"),
  DITOLAK: cn(pill, "border-red-200 bg-red-50 text-red-700"),
}

export const STATUS_BAB_STYLES: Record<StatusBab | "BELUM_UPLOAD", string> = {
  BELUM_UPLOAD: cn(pill, "border-gray-200 bg-gray-50 text-gray-600"),
  MENUNGGU_REVIEW: cn(pill, "border-blue-200 bg-blue-50 text-blue-700"),
  PERLU_REVISI: cn(pill, "border-orange-200 bg-orange-50 text-orange-700"),
  ACC: cn(pill, "border-emerald-200 bg-emerald-50 text-emerald-700"),
}

export const FASE_STYLES: Record<FaseBimbingan, string> = {
  BAB_1_3: cn(pill, "border-[#2C5EAD]/20 bg-[#EEF3FB] text-[#2C5EAD]"),
  SEMPRO: cn(pill, "border-purple-200 bg-purple-50 text-purple-700"),
  BAB_4_5: cn(pill, "border-indigo-200 bg-indigo-50 text-indigo-700"),
  SELESAI: cn(pill, "border-emerald-200 bg-emerald-50 text-emerald-700"),
}

export const BAB_BORDER_STYLES: Record<StatusBab | "BELUM_UPLOAD", string> = {
  BELUM_UPLOAD: "border-l-gray-300",
  MENUNGGU_REVIEW: "border-l-blue-500",
  PERLU_REVISI: "border-l-orange-500",
  ACC: "border-l-emerald-500",
}

export function faseBadgeClass(fase: FaseBimbingan): string {
  return FASE_STYLES[fase]
}
