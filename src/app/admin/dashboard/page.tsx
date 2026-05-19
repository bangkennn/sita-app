import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react"
import type { Metadata } from "next"

import { StatsCard } from "@/components/admin/stats-card"
import { ActivityTimeline } from "@/components/ui/activity-timeline"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaseBadge, StatusPengajuanBadge } from "@/components/ui/status-badge"
import { getDashboardStats, getRecentPengajuan } from "@/lib/admin/queries"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Dashboard Admin",
}

export default async function AdminDashboardPage() {
  const session = await auth()
  const [stats, recentPengajuan] = await Promise.all([
    getDashboardStats(),
    getRecentPengajuan(5),
  ])

  const timelineItems = recentPengajuan.map((item) => ({
    id: item.id,
    title: item.mahasiswa.nama,
    subtitle: item.judulSkripsi,
    meta: format(new Date(item.createdAt), "dd MMM yyyy", { locale: localeId }),
    badge: (
      <div className="flex gap-2">
        <FaseBadge fase={item.fase} />
        <StatusPengajuanBadge status={item.status} />
      </div>
    ),
  }))

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={session?.user?.nama ?? "Admin"}
        roleLabel="Administrator"
        description="Ringkasan aktivitas bimbingan tugas akhir di universitas"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Dosen"
          value={stats.totalDosen}
          icon={Users}
          description="Dosen terdaftar"
          index={0}
        />
        <StatsCard
          title="Mahasiswa Aktif"
          value={stats.totalMahasiswaAktif}
          icon={GraduationCap}
          description="Sedang bimbingan"
          index={1}
        />
        <StatsCard
          title="Pengajuan Aktif"
          value={stats.totalPengajuanAktif}
          icon={ClipboardList}
          description="Diterima & berjalan"
          index={2}
        />
        <StatsCard
          title="Bimbingan Selesai"
          value={stats.totalBimbinganSelesai}
          icon={CheckCircle2}
          description="Fase selesai"
          index={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline
              items={timelineItems}
              emptyMessage="📝 Belum ada pengajuan bimbingan."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabel Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPengajuan.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Belum ada data pengajuan.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mahasiswa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPengajuan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.mahasiswa.nama}</p>
                        <p className="text-xs text-slate-500">
                          {item.mahasiswa.nim}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusPengajuanBadge status={item.status} />
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
    </div>
  )
}
