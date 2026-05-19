import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

import { cn } from "@/lib/utils"

const pill =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"

export const STATUS_PENGAJUAN_STYLES: Record<StatusPengajuan, string> = {
  MENUNGGU: cn(pill, "bg-amber-100 text-amber-800 ring-1 ring-amber-200"),
  DITERIMA: cn(pill, "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"),
  DITOLAK: cn(pill, "bg-rose-100 text-rose-800 ring-1 ring-rose-200"),
}

export const STATUS_BAB_STYLES: Record<StatusBab | "BELUM_UPLOAD", string> = {
  BELUM_UPLOAD: cn(pill, "bg-slate-100 text-slate-600 ring-1 ring-slate-200"),
  MENUNGGU_REVIEW: cn(pill, "bg-blue-100 text-blue-800 ring-1 ring-blue-200"),
  PERLU_REVISI: cn(pill, "bg-orange-100 text-orange-800 ring-1 ring-orange-200"),
  ACC: cn(pill, "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"),
}

export const BAB_BORDER_STYLES: Record<StatusBab | "BELUM_UPLOAD", string> = {
  BELUM_UPLOAD: "border-l-slate-300",
  MENUNGGU_REVIEW: "border-l-blue-500",
  PERLU_REVISI: "border-l-orange-500",
  ACC: "border-l-emerald-500",
}

export function faseBadgeClass(_fase: FaseBimbingan): string {
  return cn(
    pill,
    "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
  )
}
