import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

import {
  FASE_LABELS,
  STATUS_BAB_LABELS,
  STATUS_LABELS,
} from "@/lib/admin/labels"
import {
  faseBadgeClass,
  STATUS_BAB_STYLES,
  STATUS_PENGAJUAN_STYLES,
} from "@/lib/ui/status-badges"
import { cn } from "@/lib/utils"

export function StatusPengajuanBadge({
  status,
  className,
}: {
  status: StatusPengajuan
  className?: string
}) {
  return (
    <span className={cn(STATUS_PENGAJUAN_STYLES[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function StatusBabBadge({
  status,
  className,
}: {
  status: StatusBab | "BELUM_UPLOAD"
  className?: string
}) {
  const label =
    status === "BELUM_UPLOAD" ? "Belum Upload" : STATUS_BAB_LABELS[status]
  return (
    <span className={cn(STATUS_BAB_STYLES[status], className)}>{label}</span>
  )
}

export function FaseBadge({
  fase,
  className,
}: {
  fase: FaseBimbingan
  className?: string
}) {
  return (
    <span className={cn(faseBadgeClass(fase), className)}>
      {FASE_LABELS[fase]}
    </span>
  )
}
