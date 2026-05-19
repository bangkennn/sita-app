import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FASE_LABELS, STATUS_LABELS } from "@/lib/admin/labels"
import type { DosenOption, PengajuanDetail } from "@/lib/mahasiswa/types"

interface PengajuanStatusCardProps {
  pengajuan: PengajuanDetail
  showFull?: boolean
}

function DosenInfo({ label, dosen }: { label: string; dosen: DosenOption }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{dosen.nama}</p>
      <p className="text-xs text-muted-foreground">
        {dosen.nip} · {dosen.prodi}
      </p>
    </div>
  )
}

export function PengajuanStatusCard({
  pengajuan,
  showFull = false,
}: PengajuanStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Status Pengajuan
          <Badge
            variant={
              pengajuan.status === "DITERIMA"
                ? "default"
                : pengajuan.status === "DITOLAK"
                  ? "destructive"
                  : "secondary"
            }
          >
            {STATUS_LABELS[pengajuan.status]}
          </Badge>
          {pengajuan.status === "DITERIMA" ? (
            <Badge variant="outline">{FASE_LABELS[pengajuan.fase]}</Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <DosenInfo label="Pembimbing I" dosen={pengajuan.dosen} />
        {pengajuan.dosen2 ? (
          <DosenInfo label="Pembimbing II" dosen={pengajuan.dosen2} />
        ) : (
          <div>
            <p className="text-muted-foreground">Pembimbing II</p>
            <p className="text-muted-foreground italic">—</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground">Judul Skripsi</p>
          <p className="font-medium">{pengajuan.judulSkripsi}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Tanggal Pengajuan</p>
          <p>
            {format(new Date(pengajuan.createdAt), "dd MMMM yyyy", {
              locale: localeId,
            })}
          </p>
        </div>
        {pengajuan.catatanDosen ? (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-muted-foreground">Catatan Dosen</p>
            <p>{pengajuan.catatanDosen}</p>
          </div>
        ) : null}
        {showFull ? (
          <Link
            href={pengajuan.skFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
          >
            Lihat SK
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}
