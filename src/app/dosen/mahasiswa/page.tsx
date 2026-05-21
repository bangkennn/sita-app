"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { FASE_LABELS, getInitials } from "@/lib/admin/labels"
import { getProgressForFase } from "@/lib/bimbingan/dokumen"
import { faseBadgeClass } from "@/lib/ui/status-badges"
import { cn } from "@/lib/utils"
import type { PengajuanWithRelations } from "@/lib/dosen/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

  const pending = pengajuan.filter((p) => p.status === "MENUNGGU")
  const aktif = pengajuan.filter((p) => p.status === "DITERIMA")

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mahasiswa Bimbingan</h1>
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
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
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.mahasiswa.nama}</p>
                      <p className="text-sm text-muted-foreground">
                        NIM {p.mahasiswa.nim}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                        {p.judulSkripsi}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Diajukan{" "}
                        {format(new Date(p.createdAt), "dd MMM yyyy HH:mm", {
                          locale: localeId,
                        })}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        className="bg-[#2C5EAD] hover:bg-[#1E4080]"
                        onClick={() => handleTerima(p.id)}
                        disabled={processing}
                      >
                        Terima
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          setSelectedPengajuanId(p.id)
                          setRejectDialogOpen(true)
                        }}
                      >
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          setRejectDialogOpen(open)
          if (!open) {
            setSelectedPengajuanId(null)
            setCatatan("")
          }
        }}
      >
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
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleTolak} disabled={processing}>
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mahasiswa Bimbingan</h2>
        {aktif.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-muted-foreground">
                Tidak ada mahasiswa bimbingan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {aktif.map((p) => {
              const { current, total } = getProgressForFase(p.fase, p.dokumen)
              const progressPct = total > 0 ? (current / total) * 100 : 0

              return (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2C5EAD] text-sm font-bold text-white">
                        {getInitials(p.mahasiswa.nama)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold leading-tight">
                              {p.mahasiswa.nama}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.mahasiswa.nim}
                            </p>
                          </div>
                          <span className={cn(faseBadgeClass(p.fase), "shrink-0")}>
                            {FASE_LABELS[p.fase]}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {p.judulSkripsi}
                        </p>
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                            <span>
                              Progress{" "}
                              {p.fase === "BAB_4_5" || p.fase === "SELESAI"
                                ? "Bab 4-5"
                                : "Bab 1-3"}
                            </span>
                            <span>
                              {current}/{total} ACC
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-[#2C5EAD] transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                        <Link href={`/dosen/mahasiswa/${p.id}`} className="mt-4 block">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-[#2C5EAD] text-[#2C5EAD] hover:bg-[#EEF3FB]"
                          >
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
