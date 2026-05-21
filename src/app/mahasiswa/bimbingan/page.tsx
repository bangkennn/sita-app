"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Download, FileText, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { MahasiswaDosenFiles } from "@/components/mahasiswa/mahasiswa-dosen-files"
import { countAccForBabs, getLatestDokumenPerBab } from "@/lib/bimbingan/dokumen"
import { formatPembimbingNames } from "@/lib/mahasiswa/format-pembimbing"
import type { DokumenItem, PengajuanDetail } from "@/lib/mahasiswa/types"
import { StatusBabBadge, FaseBadge } from "@/components/ui/status-badge"
import { BAB_BORDER_STYLES } from "@/lib/ui/status-badges"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

function getBabDokumen(
  dokumen: DokumenItem[],
  babNumber: number
): DokumenItem | undefined {
  return getLatestDokumenPerBab(dokumen, [babNumber]).get(babNumber)
}

function getBabStatus(
  dokumen: DokumenItem[],
  babNumber: number
): DokumenItem["status"] | "BELUM_UPLOAD" {
  return getBabDokumen(dokumen, babNumber)?.status ?? "BELUM_UPLOAD"
}

function BabUploadCard({
  babNum,
  dokumen,
  status,
  canUpload,
  onUploadClick,
  onDownload,
}: {
  babNum: number
  dokumen: DokumenItem | undefined
  status: DokumenItem["status"] | "BELUM_UPLOAD"
  canUpload: boolean
  onUploadClick: () => void
  onDownload: () => void
}) {
  return (
    <Card className={cn("border-l-4", BAB_BORDER_STYLES[status])}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Bab {babNum}</CardTitle>
          <StatusBabBadge status={status} />
        </div>
        {dokumen && (
          <p className="text-sm text-muted-foreground">{dokumen.judulBab}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {dokumen && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Versi {dokumen.versi}</span>
            <span>
              {format(new Date(dokumen.uploadedAt), "dd MMM yyyy", {
                locale: localeId,
              })}
            </span>
          </div>
        )}

        {status === "PERLU_REVISI" && (dokumen?.komentar?.length ?? 0) > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm">
            <p className="font-medium text-destructive">Komentar Dosen:</p>
            {dokumen!.komentar.map((k) => (
              <p key={k.id} className="mt-1 text-muted-foreground">
                {k.isiKomentar}
              </p>
            ))}
          </div>
        )}

        {dokumen && (dokumen.dosenFiles?.length ?? 0) > 0 && (
          <MahasiswaDosenFiles files={dokumen.dosenFiles} />
        )}

        {canUpload ? (
          <Button className="w-full" size="sm" type="button" onClick={onUploadClick}>
            <Upload className="mr-2 size-4" />
            Upload Dokumen
          </Button>
        ) : dokumen ? (
          <Button
            className="w-full"
            size="sm"
            variant="outline"
            type="button"
            onClick={onDownload}
          >
            <Download className="mr-2 size-4" />
            Lihat Dokumen
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada dokumen</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function MahasiswaBimbinganPage() {
  const [pengajuan, setPengajuan] = useState<PengajuanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedBab, setSelectedBab] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [judulBab, setJudulBab] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/mahasiswa/pengajuan")
      const data = await res.json()
      setPengajuan(data.data ?? null)
    } catch {
      toast.error("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload() {
    if (!selectedBab || !judulBab.trim() || !file) {
      toast.error("Semua field wajib diisi")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("nomorBab", selectedBab.toString())
      formData.append("judulBab", judulBab.trim())
      formData.append("file", file)
      const res = await fetch("/api/mahasiswa/dokumen", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        setUploadModalOpen(false)
        setJudulBab("")
        setFile(null)
        setSelectedBab(null)
        fetchData()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal mengupload dokumen")
    } finally {
      setUploading(false)
    }
  }

  function getProgress(): number {
    if (!pengajuan) return 0
    const fase = pengajuan.fase
    if (fase === "BAB_4_5" || fase === "SELESAI") {
      return (countAccForBabs(pengajuan.dokumen, [4, 5]) / 2) * 100
    }
    return (countAccForBabs(pengajuan.dokumen, [1, 2, 3]) / 3) * 100
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pengajuan) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <p className="font-medium">Belum ada pengajuan bimbingan</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pengajuan.status === "MENUNGGU") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-medium">Menunggu dosen menerima pengajuan</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pengajuan.status === "DITOLAK") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <Card className="border-destructive/50">
          <CardContent className="py-16 text-center">
            <p className="font-medium text-destructive">Pengajuan ditolak</p>
            {pengajuan.catatanDosen && (
              <p className="mt-2 text-sm text-muted-foreground">
                {pengajuan.catatanDosen}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pengajuan.fase === "SELESAI") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">🎓</span>
            <div>
              <h2 className="text-xl font-bold text-emerald-700">
                Selamat! Bimbingan Telah Selesai
              </h2>
              {pengajuan.tanggalSelesai && (
                <p className="text-sm text-emerald-600">
                  Diselesaikan pada{" "}
                  {format(new Date(pengajuan.tanggalSelesai), "dd MMMM yyyy HH:mm", {
                    locale: localeId,
                  })}
                </p>
              )}
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Formulir bimbingan resmi dari dosen pembimbing telah tersedia.
          </p>
          {pengajuan.formulirUrl ? (
            <a
              href={pengajuan.formulirUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                📄 Unduh Formulir Bimbingan
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    )
  }

  const dokumen = pengajuan.dokumen
  const showBab45 = pengajuan.fase === "BAB_4_5"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
        <p className="text-sm text-muted-foreground">
          Kelola dokumen dan progres bimbingan tugas akhir
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">{pengajuan.judulSkripsi}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pembimbing: {formatPembimbingNames(pengajuan.dosen, pengajuan.dosen2)}
              </p>
            </div>
            <FaseBadge fase={pengajuan.fase} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#2C5EAD]">Bab 1 - 3</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((babNum) => {
            const status = getBabStatus(dokumen, babNum)
            const doc = getBabDokumen(dokumen, babNum)
            const canUpload = status === "BELUM_UPLOAD" || status === "PERLU_REVISI"
            return (
              <BabUploadCard
                key={babNum}
                babNum={babNum}
                dokumen={doc}
                status={status}
                canUpload={canUpload}
                onUploadClick={() => {
                  setSelectedBab(babNum)
                  setUploadModalOpen(true)
                }}
                onDownload={() => doc && window.open(doc.fileUrl, "_blank")}
              />
            )
          })}
        </div>
      </section>

      {pengajuan.qrTerkirim && (
        <div className="rounded-2xl border-2 border-[#2C5EAD] bg-[#EEF3FB] p-6">
          <h3 className="mb-2 font-bold text-[#2C5EAD]">📱 QR Code Sempro & Turnitin</h3>
          <p className="mb-4 text-sm text-gray-600">
            Dosen pembimbing telah mengirimkan QR Code untuk keperluan Seminar Proposal
            dan pengecekan Turnitin.
          </p>
          {pengajuan.qrCodeUrl && (
            <img
              src={pengajuan.qrCodeUrl}
              alt="QR Code"
              className="mt-4 size-48 rounded-lg border bg-white object-contain"
            />
          )}
          {pengajuan.qrCodeUrl && (
            <a
              href={pengajuan.qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="mt-4 inline-block"
            >
              <Button className="bg-[#2C5EAD] text-white hover:bg-[#1E4080]">
                ⬇ Unduh QR Code
              </Button>
            </a>
          )}
        </div>
      )}

      {pengajuan.fase === "SEMPRO" && (
        <div className="rounded-2xl border-2 border-purple-300 bg-purple-50 p-6">
          <h3 className="mb-2 font-bold text-purple-700">🎤 Seminar Proposal</h3>
          <p className="text-sm text-gray-600">
            Gunakan QR Code di atas untuk keperluan Sempro dan Turnitin. Setelah Sempro
            selesai, dosen pembimbing akan membuka akses bimbingan Bab 4-5.
          </p>
        </div>
      )}

      {showBab45 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700">Bab 4 - 5</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[4, 5].map((babNum) => {
              const status = getBabStatus(dokumen, babNum)
              const doc = getBabDokumen(dokumen, babNum)
              const canUpload = status === "BELUM_UPLOAD" || status === "PERLU_REVISI"
              return (
                <BabUploadCard
                  key={babNum}
                  babNum={babNum}
                  dokumen={doc}
                  status={status}
                  canUpload={canUpload}
                  onUploadClick={() => {
                    setSelectedBab(babNum)
                    setUploadModalOpen(true)
                  }}
                  onDownload={() => doc && window.open(doc.fileUrl, "_blank")}
                />
              )
            })}
          </div>
        </section>
      )}

      <Dialog
        open={uploadModalOpen}
        onOpenChange={(open) => {
          setUploadModalOpen(open)
          if (!open) {
            setSelectedBab(null)
            setJudulBab("")
            setFile(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bab {selectedBab}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="judulBab">Judul Bab</Label>
              <Input
                id="judulBab"
                value={judulBab}
                onChange={(e) => setJudulBab(e.target.value)}
                placeholder="Masukkan judul bab"
              />
            </div>
            <div>
              <Label htmlFor="file">File PDF (Max 10MB)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Mengupload..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
