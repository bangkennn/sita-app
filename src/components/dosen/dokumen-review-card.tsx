"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Check, Download, Edit3, Paperclip } from "lucide-react"

import { DosenSentFilesList } from "@/components/dosen/dosen-sent-files-list"
import { KirimBerkasModal } from "@/components/dosen/kirim-berkas-modal"
import { StatusBabBadge } from "@/components/ui/status-badge"
import { BAB_BORDER_STYLES } from "@/lib/ui/status-badges"
import { cn } from "@/lib/utils"
import type { DokumenItem } from "@/lib/dosen/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface DokumenReviewCardProps {
  dokumen: DokumenItem | null
  nomorBab: number
  komentarValue: string
  onKomentarChange: (value: string) => void
  onAddKomentar: () => void
  submittingKomentar: boolean
  onReview: (status: "ACC" | "PERLU_REVISI") => void
  berkasModalOpen: boolean
  onBerkasModalOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function DokumenReviewCard({
  dokumen,
  nomorBab,
  komentarValue,
  onKomentarChange,
  onAddKomentar,
  submittingKomentar,
  onReview,
  berkasModalOpen,
  onBerkasModalOpenChange,
  onUpdated,
}: DokumenReviewCardProps) {
  const status = dokumen?.status ?? "BELUM_UPLOAD"
  const borderStatus = status as keyof typeof BAB_BORDER_STYLES

  return (
    <Card className={cn("border-l-4", BAB_BORDER_STYLES[borderStatus])}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Bab {nomorBab}</CardTitle>
            {dokumen ? (
              <p className="text-sm text-muted-foreground">{dokumen.judulBab}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada dokumen</p>
            )}
          </div>
          <StatusBabBadge status={status} />
        </div>
        {dokumen && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Versi {dokumen.versi}</span>
            <span>
              Upload:{" "}
              {format(new Date(dokumen.uploadedAt), "dd MMM yyyy", {
                locale: localeId,
              })}
            </span>
            {dokumen.reviewedAt && (
              <span>
                Review:{" "}
                {format(new Date(dokumen.reviewedAt), "dd MMM yyyy", {
                  locale: localeId,
                })}
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!dokumen || status === "BELUM_UPLOAD" ? (
          <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            Menunggu mahasiswa upload
          </p>
        ) : (
          <>
            <a
              href={dokumen.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button variant="outline" size="sm" type="button">
                <Download className="mr-2 size-4" />
                Download Dokumen
              </Button>
            </a>

            {dokumen.komentar.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Thread Komentar</p>
                {dokumen.komentar.map((k) => (
                  <div
                    key={k.id}
                    className="ml-auto max-w-[85%] rounded-2xl rounded-tl-none bg-[#EEF3FB] px-4 py-2 text-sm text-gray-800"
                  >
                    {k.isiKomentar}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Tambahkan komentar..."
                value={komentarValue}
                onChange={(e) => onKomentarChange(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={onAddKomentar}
                  disabled={submittingKomentar}
                >
                  Tambah Komentar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => onBerkasModalOpenChange(true)}
                >
                  <Paperclip className="mr-1 size-4" />
                  Kirim Berkas
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => onReview("ACC")}
                >
                  <Check className="mr-1 size-4" />
                  ACC Bab Ini
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => onReview("PERLU_REVISI")}
                >
                  <Edit3 className="mr-1 size-4" />
                  Perlu Revisi
                </Button>
              </div>
            </div>

            <DosenSentFilesList files={dokumen.dosenFiles} onUpdated={onUpdated} />

            <KirimBerkasModal
              open={berkasModalOpen}
              onOpenChange={onBerkasModalOpenChange}
              dokumenId={dokumen.id}
              onSuccess={onUpdated}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
