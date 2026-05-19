"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { FASE_LABELS, STATUS_LABELS } from "@/lib/admin/labels"
import type { PengajuanWithRelations } from "@/lib/dosen/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function DosenMahasiswaPage() {
  const [pengajuan, setPengajuan] = useState<PengajuanWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedPengajuanId, setSelectedPengajuanId] = useState<string | null>(null)
  const [catatan, setCatatan] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchPengajuan()
  }, [])

  async function fetchPengajuan() {
    try {
      const res = await fetch("/api/dosen/pengajuan")
      const data = await res.json()
      if (data.success) {
        setPengajuan(data.data)
      }
    } catch {
      toast.error("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  async function handleTerima(id: string) {
    setProcessing(true)
    try {
      const res = await fetch(`/api/dosen/pengajuan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "terima" }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal menerima pengajuan")
    } finally {
      setProcessing(false)
    }
  }

  async function handleTolak() {
    if (!selectedPengajuanId || !catatan.trim()) {
      toast.error("Catatan wajib diisi")
      return
    }

    setProcessing(true)
    try {
      const res = await fetch(`/api/dosen/pengajuan/${selectedPengajuanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tolak", catatan: catatan.trim() }),
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        setRejectDialogOpen(false)
        setCatatan("")
        setSelectedPengajuanId(null)
        fetchPengajuan()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal menolak pengajuan")
    } finally {
      setProcessing(false)
    }
  }

  function getProgress(p: PengajuanWithRelations): number {
    const fase = p.fase
    if (fase === "BAB_1_3") {
      const accCount = [1, 2, 3]
        .map((n) => p.dokumen.find((d) => d.nomorBab === n)?.status)
        .filter((s) => s === "ACC").length
      return (accCount / 3) * 100
    }
    if (fase === "BAB_4_5") {
      const accCount = [4, 5]
        .map((n) => p.dokumen.find((d) => d.nomorBab === n)?.status)
        .filter((s) => s === "ACC").length
      return (accCount / 2) * 100
    }
    return 0
  }

  const pending = pengajuan.filter((p) => p.status === "MENUNGGU")
  const aktif = pengajuan.filter((p) => p.status === "DITERIMA" && p.fase !== "SELESAI")

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mahasiswa Bimbingan</h1>
          <p className="text-sm text-muted-foreground">
            Kelola pengajuan dan bimbingan mahasiswa
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mahasiswa Bimbingan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola pengajuan dan bimbingan mahasiswa
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pengajuan Menunggu Persetujuan</h2>
          <div className="grid gap-4">
            {pending.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-base">{p.mahasiswa.nama}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        NIM: {p.mahasiswa.nim} • {p.mahasiswa.prodi}
                      </p>
                    </div>
                    <Badge variant="secondary">{STATUS_LABELS[p.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Judul Skripsi</p>
                    <p className="text-sm text-muted-foreground">{p.judulSkripsi}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Diajukan pada{" "}
                    {format(new Date(p.createdAt), "dd MMM yyyy HH:mm", {
                      locale: localeId,
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleTerima(p.id)}
                      disabled={processing}
                    >
                      Terima
                    </Button>
                    <Dialog
                      open={rejectDialogOpen && selectedPengajuanId === p.id}
                      onOpenChange={(open) => {
                        setRejectDialogOpen(open)
                        if (!open) {
                          setSelectedPengajuanId(null)
                          setCatatan("")
                        }
                      }}
                    >
                      <DialogTrigger>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedPengajuanId(p.id)}
                          type="button"
                        >
                          Tolak
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tolak Pengajuan</DialogTitle>
                          <DialogDescription>
                            Masukkan alasan penolakan untuk mahasiswa
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="Masukkan catatan/penjelasan..."
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                        />
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleTolak}
                            disabled={processing}
                          >
                            Tolak
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mahasiswa Aktif</h2>
        {aktif.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-muted-foreground">
                Tidak ada mahasiswa aktif
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {aktif.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-base">{p.mahasiswa.nama}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        NIM: {p.mahasiswa.nim} • {p.mahasiswa.prodi}
                      </p>
                    </div>
                    <Badge variant="outline">{FASE_LABELS[p.fase]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Judul Skripsi</p>
                    <p className="text-sm text-muted-foreground">{p.judulSkripsi}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Progress:</span>
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${getProgress(p)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(getProgress(p))}%
                    </span>
                  </div>
                  <Link href={`/dosen/mahasiswa/${p.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Lihat Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
