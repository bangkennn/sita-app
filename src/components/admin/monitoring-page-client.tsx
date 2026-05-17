"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ClipboardList } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { EmptyState } from "@/components/admin/empty-state"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FASE_LABELS, STATUS_LABELS } from "@/lib/admin/labels"
import type { MonitoringPengajuanItem } from "@/lib/admin/types"

export function MonitoringPageClient() {
  const [items, setItems] = useState<MonitoringPengajuanItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMonitoring = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/monitoring")
      const result = (await response.json()) as {
        success: boolean
        data?: MonitoringPengajuanItem[]
        message?: string
      }

      if (!response.ok || !result.success || !result.data) {
        toast.error(result.message ?? "Gagal memuat data monitoring.")
        setItems([])
        return
      }

      setItems(result.data)
    } catch {
      toast.error("Gagal memuat data monitoring.")
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchMonitoring()
  }, [fetchMonitoring])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Monitoring Bimbingan
        </h1>
        <p className="text-sm text-muted-foreground">
          Pantau seluruh pengajuan bimbingan tugas akhir
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={7} rows={8} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Belum ada pengajuan"
              description="Data pengajuan bimbingan akan muncul di sini."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Dosen Pembimbing</TableHead>
                  <TableHead>Judul Skripsi</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.mahasiswa.nama}
                    </TableCell>
                    <TableCell>{item.mahasiswa.nim}</TableCell>
                    <TableCell>{item.dosen.nama}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.judulSkripsi}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{FASE_LABELS[item.fase]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "DITERIMA"
                            ? "default"
                            : item.status === "DITOLAK"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {STATUS_LABELS[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.createdAt), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
