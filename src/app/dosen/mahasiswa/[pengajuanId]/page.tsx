"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Download, Paperclip, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DosenSentFilesList } from "@/components/dosen/dosen-sent-files-list"
import { KirimBerkasModal } from "@/components/dosen/kirim-berkas-modal"
import { FASE_LABELS, STATUS_BAB_LABELS } from "@/lib/admin/labels"
import type { DokumenItem, PengajuanWithRelations } from "@/lib/dosen/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function DosenMahasiswaDetailPage({
  params,
}: {
  params: { pengajuanId: string }
}) {
  const [pengajuan, setPengajuan] = useState<PengajuanWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingQr, setSendingQr] = useState(false)
  const [updatingFase, setUpdatingFase] = useState(false)
  const [komentarInputs, setKomentarInputs] = useState<Record<string, string>>({})
  const [submittingKomentar, setSubmittingKomentar] = useState<Record<string, boolean>>({})
  const [berkasModalDokumenId, setBerkasModalDokumenId] = useState<string | null>(null)

  useEffect(() => {
    fetchPengajuan()
  }, [params.pengajuanId])

  async function fetchPengajuan() {
    try {
      const res = await fetch("/api/dosen/pengajuan")
      const data = await res.json()
      if (data.success) {
        const found = data.data.find((p: PengajuanWithRelations) => p.id === params.pengajuanId)
        setPengajuan(found || null)
      }
    } catch {
      toast.error("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  async function handleReview(dokumenId: string, status: "ACC" | "PERLU_REVISI") {
    try {
      const res = await fetch(`/api/dosen/dokumen/${dokumenId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, komentar: komentarInputs[dokumenId] }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        setKomentarInputs((prev) => ({ ...prev, [dokumenId]: "" }))
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal memproses review")
    }
  }

  async function handleAddKomentar(dokumenId: string) {
    const komentar = komentarInputs[dokumenId]
    if (!komentar?.trim()) {
      toast.error("Komentar wajib diisi")
      return
    }

    setSubmittingKomentar((prev) => ({ ...prev, [dokumenId]: true }))
    try {
      const res = await fetch(`/api/dosen/dokumen/${dokumenId}/komentar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ komentar }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        setKomentarInputs((prev) => ({ ...prev, [dokumenId]: "" }))
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal menambahkan komentar")
    } finally {
      setSubmittingKomentar((prev) => ({ ...prev, [dokumenId]: false }))
    }
  }

  async function handleKirimQr() {
    setSendingQr(true)
    try {
      const res = await fetch(`/api/dosen/kirim-qr/${params.pengajuanId}`, {
        method: "POST",
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal mengirim QR Code")
    } finally {
      setSendingQr(false)
    }
  }

  async function handleLanjutBab45() {
    setUpdatingFase(true)
    try {
      const res = await fetch(`/api/dosen/pengajuan/${params.pengajuanId}/fase`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fase: "BAB_4_5" }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal memperbarui fase")
    } finally {
      setUpdatingFase(false)
    }
  }

  function getAllBab123Acc(): boolean {
    if (!pengajuan) return false
    const bab123 = pengajuan.dokumen.filter((d) => [1, 2, 3].includes(d.nomorBab))
    return bab123.every((d) => d.status === "ACC")
  }

  function canShowQrSection(): boolean {
    return getAllBab123Acc() && pengajuan?.fase === "BAB_1_3"
  }

  function canShowLanjutSection(): boolean {
    return Boolean(pengajuan?.qrTerkirim && pengajuan?.fase === "SEMPRO")
  }

  function getAllBab45Acc(): boolean {
    if (!pengajuan) return false
    const bab45 = pengajuan.dokumen.filter((d) => [4, 5].includes(d.nomorBab))
    return bab45.length >= 2 && bab45.every((d) => d.status === "ACC")
  }

  function canShowSelesaiSection(): boolean {
    return pengajuan?.fase === "BAB_4_5" && getAllBab45Acc()
  }

  async function handleSelesai() {
    setUpdatingFase(true)
    try {
      const res = await fetch(`/api/dosen/pengajuan/${params.pengajuanId}/fase`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fase: "SELESAI" }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal menyelesaikan bimbingan")
    } finally {
      setUpdatingFase(false)
    }
  }

  function getDokumenForFase(): DokumenItem[] {
    if (!pengajuan) return []
    const fase = pengajuan.fase
    if (fase === "BAB_1_3") {
      return pengajuan.dokumen.filter((d) => [1, 2, 3].includes(d.nomorBab))
    }
    if (fase === "BAB_4_5") {
      return pengajuan.dokumen.filter((d) => [4, 5].includes(d.nomorBab))
    }
    return pengajuan.dokumen
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!pengajuan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
          <p className="text-sm text-muted-foreground">Pengajuan tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg">{pengajuan.mahasiswa.nama}</CardTitle>
              <p className="text-sm text-muted-foreground">
                NIM: {pengajuan.mahasiswa.nim} • {pengajuan.mahasiswa.prodi}
              </p>
              <p className="text-sm font-medium mt-2">{pengajuan.judulSkripsi}</p>
            </div>
            <Badge variant="outline">{FASE_LABELS[pengajuan.fase]}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Dokumen Review</h2>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            Catatan: Dokumen yang diupload sebelum pembaruan sistem perlu di-upload
            ulang oleh mahasiswa agar file dapat diunduh.
          </p>
        </div>
        <div className="space-y-4">
          {getDokumenForFase().map((dokumen) => (
            <Card key={dokumen.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-base">Bab {dokumen.nomorBab}</CardTitle>
                    <p className="text-sm text-muted-foreground">{dokumen.judulBab}</p>
                  </div>
                  <Badge
                    variant={
                      dokumen.status === "ACC"
                        ? "default"
                        : dokumen.status === "PERLU_REVISI"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {STATUS_BAB_LABELS[dokumen.status]}
                  </Badge>
                </div>
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
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <div className="space-y-2 rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Komentar Sebelumnya:</p>
                    {dokumen.komentar.map((k) => (
                      <p key={k.id} className="text-sm text-muted-foreground">
                        {k.isiKomentar}
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Tambahkan komentar..."
                    value={komentarInputs[dokumen.id] || ""}
                    onChange={(e) =>
                      setKomentarInputs((prev) => ({
                        ...prev,
                        [dokumen.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddKomentar(dokumen.id)}
                      disabled={submittingKomentar[dokumen.id]}
                    >
                      Tambah Komentar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setBerkasModalDokumenId(dokumen.id)}
                    >
                      <Paperclip className="mr-1 size-4" />
                      Kirim Berkas
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleReview(dokumen.id, "ACC")}
                    >
                      ACC Bab Ini
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReview(dokumen.id, "PERLU_REVISI")}
                    >
                      Perlu Revisi
                    </Button>
                  </div>
                </div>

                <DosenSentFilesList
                  files={dokumen.dosenFiles}
                  onUpdated={fetchPengajuan}
                />

                <KirimBerkasModal
                  open={berkasModalDokumenId === dokumen.id}
                  onOpenChange={(open) =>
                    setBerkasModalDokumenId(open ? dokumen.id : null)
                  }
                  dokumenId={dokumen.id}
                  onSuccess={fetchPengajuan}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {canShowQrSection() && (
        <Card>
          <CardHeader>
            <CardTitle>Kirim QR Code Seminar Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            {pengajuan.qrTerkirim ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  QR Code sudah dikirim pada{" "}
                  {format(new Date(pengajuan.qrTerkirimAt!), "dd MMM yyyy HH:mm", {
                    locale: localeId,
                  })}
                </p>
              </div>
            ) : (
              <Button onClick={handleKirimQr} disabled={sendingQr}>
                <Send className="mr-2 size-4" />
                {sendingQr ? "Mengirim..." : "Kirim QR Code ke Mahasiswa"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {canShowLanjutSection() && (
        <Card>
          <CardHeader>
            <CardTitle>Lanjut Bimbingan</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLanjutBab45}
              disabled={updatingFase}
              className="w-full sm:w-auto"
            >
              {updatingFase ? "Memproses..." : "Lanjut ke Bab 4-5"}
            </Button>
          </CardContent>
        </Card>
      )}

      {canShowSelesaiSection() && (
        <Card>
          <CardHeader>
            <CardTitle>Selesaikan Bimbingan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Semua bab 4–5 telah ACC. Tandai bimbingan sebagai selesai.
            </p>
            <Button
              onClick={handleSelesai}
              disabled={updatingFase}
              className="w-full sm:w-auto"
            >
              {updatingFase ? "Memproses..." : "Tandai Bimbingan Selesai"}
            </Button>
          </CardContent>
        </Card>
      )}

      {pengajuan.fase === "SEMPRO" && (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              Mahasiswa sedang dalam fase Seminar Proposal. Setelah selesai, lanjutkan ke Bab 4–5.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
