import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react"

import { StatsCard } from "@/components/admin/stats-card"
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
import { getDashboardStats, getRecentPengajuan } from "@/lib/admin/queries"

export default async function AdminDashboardPage() {
  const [stats, recentPengajuan] = await Promise.all([
    getDashboardStats(),
    getRecentPengajuan(5),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan aktivitas bimbingan tugas akhir
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Dosen Terdaftar"
          value={stats.totalDosen}
          icon={Users}
          description="Dosen aktif"
        />
        <StatsCard
          title="Mahasiswa Aktif"
          value={stats.totalMahasiswaAktif}
          icon={GraduationCap}
          description="Sedang bimbingan"
        />
        <StatsCard
          title="Pengajuan Aktif"
          value={stats.totalPengajuanAktif}
          icon={ClipboardList}
          description="Diterima & belum selesai"
        />
        <StatsCard
          title="Bimbingan Selesai"
          value={stats.totalBimbinganSelesai}
          icon={CheckCircle2}
          description="Fase selesai"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPengajuan.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada pengajuan bimbingan.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Judul Skripsi</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPengajuan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.mahasiswa.nama}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.mahasiswa.nim}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{item.dosen.nama}</p>
                        {item.dosen2 ? (
                          <p className="text-muted-foreground">
                            {item.dosen2.nama}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
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
