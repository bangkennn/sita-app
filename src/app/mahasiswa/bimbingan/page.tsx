"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Download, FileText, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { MahasiswaDosenFiles } from "@/components/mahasiswa/mahasiswa-dosen-files"
import { FASE_LABELS } from "@/lib/admin/labels"
import { StatusBabBadge, FaseBadge } from "@/components/ui/status-badge"
import { BAB_BORDER_STYLES } from "@/lib/ui/status-badges"
import { cn } from "@/lib/utils"
import { formatPembimbingNames } from "@/lib/mahasiswa/format-pembimbing"
import type { DokumenItem, PengajuanDetail } from "@/lib/mahasiswa/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface BimbinganData {
  pengajuan: PengajuanDetail | null
  dokumen: DokumenItem[]
  qrCode: {
    qrTerkirim: boolean
    qrTerkirimAt: string | null
    qrCodeUrl: string | null
  } | null
}

export default function MahasiswaBimbinganPage() {
  const [data, setData] = useState<BimbinganData | null>(null)
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
      const [pengajuanRes, dokumenRes, qrRes] = await Promise.all([
        fetch("/api/mahasiswa/pengajuan"),
        fetch("/api/mahasiswa/dokumen"),
        fetch("/api/mahasiswa/qr-code"),
      ])

      const pengajuanData = await pengajuanRes.json()
      const dokumenData = await dokumenRes.json()
      const qrData = await qrRes.json()

      setData({
        pengajuan: pengajuanData.data,
        dokumen: dokumenData.data || [],
        qrCode: qrData.data,
      })
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

  function getBabStatus(babNumber: number): DokumenItem["status"] | "BELUM_UPLOAD" {
    const babDoc = data?.dokumen.find((d) => d.nomorBab === babNumber)
    return babDoc?.status || "BELUM_UPLOAD"
  }

  function getBabDokumen(babNumber: number): DokumenItem | undefined {
    return data?.dokumen.find((d) => d.nomorBab === babNumber)
  }

  function getAllBab123Acc(): boolean {
    const bab1 = getBabStatus(1)
    const bab2 = getBabStatus(2)
    const bab3 = getBabStatus(3)
    return bab1 === "ACC" && bab2 === "ACC" && bab3 === "ACC"
  }

  function getBabForFase(): number[] {
    const fase = data?.pengajuan?.fase
    if (fase === "BAB_1_3") return [1, 2, 3]
    if (fase === "BAB_4_5") return [4, 5]
    return []
  }

  function getProgress(): number {
    const fase = data?.pengajuan?.fase
    if (fase === "BAB_1_3") {
      const accCount = [1, 2, 3].filter((n) => getBabStatus(n) === "ACC").length
      return (accCount / 3) * 100
    }
    if (fase === "BAB_4_5") {
      const accCount = [4, 5].filter((n) => getBabStatus(n) === "ACC").length
      return (accCount / 2) * 100
    }
    return 0
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dokumen dan progres bimbingan tugas akhir
          </p>
        </div>
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data?.pengajuan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dokumen dan progres bimbingan tugas akhir
          </p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <p className="font-medium">Belum ada pengajuan bimbingan</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Mulai dengan mengajukan bimbingan tugas akhir Anda
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (data.pengajuan.status === "MENUNGGU") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dokumen dan progres bimbingan tugas akhir
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <p className="font-medium">Menunggu dosen menerima pengajuan</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Pengajuan Anda sedang ditinjau oleh dosen pembimbing
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (data.pengajuan.status === "DITOLAK") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dokumen dan progres bimbingan tugas akhir
          </p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-destructive" />
            <p className="font-medium text-destructive">Pengajuan ditolak</p>
            {data.pengajuan.catatanDosen && (
              <p className="max-w-sm text-sm text-muted-foreground">
                Catatan: {data.pengajuan.catatanDosen}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (data.pengajuan.fase === "SELESAI") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bimbinganku</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dokumen dan progres bimbingan tugas akhir
          </p>
        </div>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-primary" />
            <p className="font-medium">Bimbingan tugas akhir selesai</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Selamat! Anda telah menyelesaikan seluruh tahap bimbingan tugas akhir.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const babForFase = getBabForFase()
  const showQrSection =
    data.pengajuan.fase === "SEMPRO" ||
    getAllBab123Acc() ||
    Boolean(data.qrCode?.qrTerkirim)

  return (
    <div className="space-y-6">
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
              <CardTitle className="text-lg">{data.pengajuan.judulSkripsi}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pembimbing: {formatPembimbingNames(data.pengajuan.dosen, data.pengajuan.dosen2)}
              </p>
            </div>
            <FaseBadge fase={data.pengajuan.fase} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progress Bab</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} />
          </div>
        </CardContent>
      </Card>

      {data.pengajuan.fase === "SEMPRO" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fase Seminar Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bab 1–3 telah disetujui. Ikuti seminar proposal sesuai jadwal kampus.
              Setelah selesai, dosen akan melanjutkan bimbingan ke Bab 4–5.
            </p>
          </CardContent>
        </Card>
      )}

      {babForFase.length > 0 && (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Dokumen Bab</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {babForFase.map((babNum) => {
            const status = getBabStatus(babNum)
            const dokumen = getBabDokumen(babNum)
            const canUpload = status === "BELUM_UPLOAD" || status === "PERLU_REVISI"

            return (
              <Card
                key={babNum}
                className={cn(
                  "border-l-4",
                  BAB_BORDER_STYLES[status]
                )}
              >
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

                  {status === "PERLU_REVISI" &&
                    (dokumen?.komentar?.length ?? 0) > 0 && (
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
                    <Dialog
                      open={uploadModalOpen && selectedBab === babNum}
                      onOpenChange={(open) => {
                        setUploadModalOpen(open)
                        if (!open) {
                          setSelectedBab(null)
                          setJudulBab("")
                          setFile(null)
                        }
                      }}
                    >
                      <DialogTrigger>
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => setSelectedBab(babNum)}
                          type="button"
                        >
                          <Upload className="mr-2 size-4" />
                          Upload Dokumen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Bab {babNum}</DialogTitle>
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
                            <Button
                              variant="outline"
                              onClick={() => setUploadModalOpen(false)}
                            >
                              Batal
                            </Button>
                            <Button onClick={handleUpload} disabled={uploading}>
                              {uploading ? "Mengupload..." : "Upload"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <a
                      href={dokumen!.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="block w-full"
                    >
                      <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        type="button"
                      >
                        <Download className="mr-2 size-4" />
                        Lihat Dokumen
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      )}

      {showQrSection && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Seminar Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            {data.qrCode?.qrTerkirim ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center rounded-lg border p-4">
                  {data.qrCode.qrCodeUrl ? (
                    <img
                      src={data.qrCode.qrCodeUrl}
                      alt="QR Code"
                      className="h-48 w-48"
                    />
                  ) : (
                    <p className="text-muted-foreground">QR Code tidak tersedia</p>
                  )}
                </div>
                {data.qrCode.qrTerkirimAt && (
                  <p className="text-center text-sm text-muted-foreground">
                    Dikirim pada{" "}
                    {format(new Date(data.qrCode.qrTerkirimAt), "dd MMM yyyy HH:mm", {
                      locale: localeId,
                    })}
                  </p>
                )}
                {data.qrCode.qrCodeUrl && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      data.qrCode?.qrCodeUrl &&
                      window.open(data.qrCode.qrCodeUrl, "_blank")
                    }
                  >
                    <Download className="mr-2 size-4" />
                    Download QR Code
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <FileText className="size-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Menunggu dosen mengirim QR Code
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
