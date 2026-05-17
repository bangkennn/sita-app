"use client"

import {
  Pencil,
  Plus,
  QrCode,
  UserX,
  Users,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { DosenFormDialog } from "@/components/admin/dosen-form-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { UploadQrDialog } from "@/components/admin/upload-qr-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DosenListItem } from "@/lib/admin/types"

export function DosenPageClient() {
  const [dosenList, setDosenList] = useState<DosenListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedDosen, setSelectedDosen] = useState<DosenListItem | null>(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrDosen, setQrDosen] = useState<DosenListItem | null>(null)

  const fetchDosen = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/dosen")
      const result = (await response.json()) as {
        success: boolean
        data?: DosenListItem[]
        message?: string
      }

      if (!response.ok || !result.success || !result.data) {
        toast.error(result.message ?? "Gagal memuat data dosen.")
        setDosenList([])
        return
      }

      setDosenList(result.data)
    } catch {
      toast.error("Gagal memuat data dosen.")
      setDosenList([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDosen()
  }, [fetchDosen])

  function openCreate() {
    setFormMode("create")
    setSelectedDosen(null)
    setFormOpen(true)
  }

  function openEdit(dosen: DosenListItem) {
    setFormMode("edit")
    setSelectedDosen(dosen)
    setFormOpen(true)
  }

  function openQrUpload(dosen: DosenListItem) {
    setQrDosen(dosen)
    setQrOpen(true)
  }

  async function handleDeactivate(dosen: DosenListItem) {
    if (!confirm(`Nonaktifkan dosen ${dosen.nama}?`)) return

    try {
      const response = await fetch(`/api/admin/dosen/${dosen.id}`, {
        method: "DELETE",
      })
      const result = (await response.json()) as {
        success: boolean
        message: string
      }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? "Gagal menonaktifkan dosen.")
        return
      }

      toast.success(result.message)
      void fetchDosen()
    } catch {
      toast.error("Terjadi kesalahan.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Dosen</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun dosen pembimbing dan QR Code WhatsApp
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Dosen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={8} rows={6} />
          ) : dosenList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Belum ada dosen"
              description="Tambahkan dosen pembimbing pertama untuk memulai."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Prodi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status QR</TableHead>
                  <TableHead>Mhs. Aktif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenList.map((dosen) => (
                  <TableRow
                    key={dosen.id}
                    className={!dosen.isActive ? "opacity-60" : undefined}
                  >
                    <TableCell className="font-medium">{dosen.nama}</TableCell>
                    <TableCell>{dosen.nip}</TableCell>
                    <TableCell>{dosen.prodi}</TableCell>
                    <TableCell>{dosen.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={dosen.qrCodeUrl ? "default" : "secondary"}
                      >
                        {dosen.qrCodeUrl ? "Sudah upload" : "Belum upload"}
                      </Badge>
                    </TableCell>
                    <TableCell>{dosen.mahasiswaAktifCount}</TableCell>
                    <TableCell>
                      <Badge variant={dosen.isActive ? "default" : "destructive"}>
                        {dosen.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(dosen)}
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openQrUpload(dosen)}
                          title="Upload QR"
                          disabled={!dosen.isActive}
                        >
                          <QrCode className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => void handleDeactivate(dosen)}
                          title="Nonaktifkan"
                          disabled={!dosen.isActive}
                        >
                          <UserX className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DosenFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        dosen={selectedDosen}
        onSuccess={() => void fetchDosen()}
      />

      <UploadQrDialog
        dosenId={qrDosen?.id ?? null}
        dosenNama={qrDosen?.nama ?? ""}
        open={qrOpen}
        onOpenChange={setQrOpen}
        onSuccess={() => void fetchDosen()}
      />
    </div>
  )
}
