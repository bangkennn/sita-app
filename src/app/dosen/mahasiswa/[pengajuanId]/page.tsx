"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DokumenReviewCard } from "@/components/dosen/dokumen-review-card"
import { SelesaikanFormulirModal } from "@/components/dosen/selesaikan-formulir-modal"
import { FaseBadge } from "@/components/ui/status-badge"
import {
  allBabsAcc,
  countAccForBabs,
  getLatestDokumenPerBab,
} from "@/lib/bimbingan/dokumen"
import type { DokumenItem, PengajuanWithRelations } from "@/lib/dosen/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

function getLatestDokumen(
  dokumen: DokumenItem[],
  nomorBab: number
): DokumenItem | null {
  const map = getLatestDokumenPerBab(dokumen, [nomorBab])
  return map.get(nomorBab) ?? null
}

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
  const [formulirModalOpen, setFormulirModalOpen] = useState(false)

  useEffect(() => {
    fetchPengajuan()
  }, [params.pengajuanId])

  async function fetchPengajuan() {
    try {
      const res = await fetch("/api/dosen/pengajuan")
      const data = await res.json()
      if (data.success) {
        const found = data.data.find(
          (p: PengajuanWithRelations) => p.id === params.pengajuanId
        )
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
        toast.success(result.message ?? "QR Code berhasil dikirim!")
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
        <p className="text-sm text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  if (!pengajuan) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
        <p className="text-sm text-muted-foreground">Pengajuan tidak ditemukan</p>
      </div>
    )
  }

  const showBab13 =
    pengajuan.status === "DITERIMA" &&
    ["BAB_1_3", "SEMPRO", "BAB_4_5", "SELESAI"].includes(pengajuan.fase)
  const showSempro = pengajuan.qrTerkirim
  const showBab45 = pengajuan.fase === "BAB_4_5" || pengajuan.fase === "SELESAI"

  const accBab13 = countAccForBabs(pengajuan.dokumen, [1, 2, 3])
  const accBab45 = countAccForBabs(pengajuan.dokumen, [4, 5])
  const allBab123Acc = allBabsAcc(pengajuan.dokumen, [1, 2, 3])
  const allBab45Acc = allBabsAcc(pengajuan.dokumen, [4, 5])

  const showKirimQrBtn =
    pengajuan.fase === "BAB_1_3" && allBab123Acc && !pengajuan.qrTerkirim

  const showBab45SelesaiBtn =
    pengajuan.fase === "BAB_4_5" && allBab45Acc

  function renderBabSection(babNumbers: number[]) {
    return (
      <div className="space-y-4">
        {babNumbers.map((n) => {
          const dokumen = getLatestDokumen(pengajuan!.dokumen, n)
          const dokumenId = dokumen?.id ?? `bab-${n}`
          return (
            <DokumenReviewCard
              key={dokumenId}
              dokumen={dokumen}
              nomorBab={n}
              komentarValue={komentarInputs[dokumen?.id ?? ""] || ""}
              onKomentarChange={(v) =>
                dokumen &&
                setKomentarInputs((prev) => ({ ...prev, [dokumen.id]: v }))
              }
              onAddKomentar={() => dokumen && handleAddKomentar(dokumen.id)}
              submittingKomentar={Boolean(
                dokumen && submittingKomentar[dokumen.id]
              )}
              onReview={(status) => dokumen && handleReview(dokumen.id, status)}
              berkasModalOpen={berkasModalDokumenId === dokumen?.id}
              onBerkasModalOpenChange={(open) =>
                setBerkasModalDokumenId(open && dokumen ? dokumen.id : null)
              }
              onUpdated={fetchPengajuan}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detail Bimbingan</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl">{pengajuan.mahasiswa.nama}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  NIM {pengajuan.mahasiswa.nim} • {pengajuan.mahasiswa.prodi}
                </p>
              </div>
              <FaseBadge fase={pengajuan.fase} />
            </div>
            <p className="font-medium text-gray-800">{pengajuan.judulSkripsi}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[#2C5EAD] text-[#2C5EAD]">
                Pembimbing 1: {pengajuan.dosen.nama}
              </Badge>
              {pengajuan.dosen2 && (
                <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                  Pembimbing 2: {pengajuan.dosen2.nama}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {showBab13 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#2C5EAD]">Bab 1 - 3</h2>
            <Badge className="bg-[#2C5EAD] text-white hover:bg-[#2C5EAD]">
              {accBab13}/3 ACC
            </Badge>
          </div>
          {renderBabSection([1, 2, 3])}
          <p className="text-sm text-muted-foreground">
            {accBab13} dari 3 bab telah ACC
          </p>

          {showKirimQrBtn && (
            <div className="mt-4 rounded-2xl border-2 border-[#2C5EAD] bg-[#EEF3FB] p-6">
              <div className="mb-2 flex items-center gap-2">
                <span>🎯</span>
                <h3 className="font-bold text-[#2C5EAD]">Bab 1-3 Selesai!</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Semua bab 1-3 telah disetujui. Klik tombol di bawah untuk mengirimkan
                QR Code kepada mahasiswa sebagai tanda ACC untuk Seminar Proposal
                (Sempro).
              </p>
              <Button
                onClick={handleKirimQr}
                disabled={sendingQr}
                className="bg-[#2C5EAD] text-white hover:bg-[#1E4080]"
              >
                {sendingQr ? "Mengirim..." : "📤 Kirim QR Code & Buka Sempro"}
              </Button>
            </div>
          )}

          {pengajuan.qrTerkirim && pengajuan.qrTerkirimAt && (
            <div className="mt-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-4">
              <p className="font-medium text-emerald-700">
                ✅ QR Code telah dikirim pada{" "}
                {format(new Date(pengajuan.qrTerkirimAt), "dd MMMM yyyy HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>
          )}
        </section>
      )}

      {showSempro && (
        <section>
          <div className="rounded-2xl border-2 border-purple-300 bg-purple-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span>🎤</span>
              <h3 className="font-bold text-purple-700">Seminar Proposal (Sempro)</h3>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              QR Code telah dikirim ke mahasiswa untuk keperluan Sempro dan Turnitin.
              Setelah mahasiswa menyelesaikan Sempro, klik tombol di bawah untuk
              melanjutkan ke bimbingan Bab 4-5.
            </p>
            <Button
              onClick={handleLanjutBab45}
              disabled={
                updatingFase ||
                pengajuan.fase === "BAB_4_5" ||
                pengajuan.fase === "SELESAI"
              }
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {updatingFase
                ? "Memproses..."
                : pengajuan.fase === "BAB_4_5" || pengajuan.fase === "SELESAI"
                  ? "✅ Sudah Lanjut ke Bab 4-5"
                  : "▶ Lanjut ke Bab 4-5"}
            </Button>
          </div>
        </section>
      )}

      {showBab45 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-indigo-700">Bab 4 - 5</h2>
            <Badge className="bg-indigo-600 text-white hover:bg-indigo-600">
              {accBab45}/2 ACC
            </Badge>
          </div>
          {renderBabSection([4, 5])}
          <p className="text-sm text-muted-foreground">
            {accBab45} dari 2 bab telah ACC
          </p>

          {showBab45SelesaiBtn && (
            <div className="mt-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <span>🎓</span>
                <h3 className="font-bold text-emerald-700">Bab 4-5 Selesai!</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Semua bab telah disetujui. Upload formulir bimbingan yang telah
                ditandatangani untuk menyelesaikan bimbingan ini.
              </p>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setFormulirModalOpen(true)}
              >
                📋 Selesaikan & Kirim Formulir
              </Button>
            </div>
          )}

          {pengajuan.fase === "SELESAI" && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-6">
              <h3 className="font-bold text-emerald-700">✅ Bimbingan Selesai</h3>
              {pengajuan.tanggalSelesai && (
                <p className="mt-1 text-sm text-gray-500">
                  Diselesaikan pada{" "}
                  {format(new Date(pengajuan.tanggalSelesai), "dd MMMM yyyy HH:mm", {
                    locale: localeId,
                  })}
                </p>
              )}
              {pengajuan.formulirUrl && (
                <a
                  href={pengajuan.formulirUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button variant="outline" className="mt-3" type="button">
                    📄 Lihat Formulir
                  </Button>
                </a>
              )}
            </div>
          )}
        </section>
      )}

      <SelesaikanFormulirModal
        open={formulirModalOpen}
        onOpenChange={setFormulirModalOpen}
        pengajuanId={params.pengajuanId}
        onSuccess={fetchPengajuan}
      />
    </div>
  )
}
