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
import { getInitials } from "@/lib/admin/labels"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusPengajuanBadge, FaseBadge } from "@/components/ui/status-badge"
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

  return (
    <div className="space-y-6">
      <WelcomeBanner
        name={session?.user?.nama ?? "Admin"}
        roleLabel="Administrator"
        description="Ringkasan aktivitas bimbingan tugas akhir"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Dosen"
          value={stats.totalDosen}
          icon={Users}
          trend={{ value: "Terdaftar", positive: true }}
        />
        <StatsCard
          title="Mahasiswa Aktif"
          value={stats.totalMahasiswaAktif}
          icon={GraduationCap}
          trend={{ value: "Bimbingan aktif", positive: true }}
        />
        <StatsCard
          title="Pengajuan Aktif"
          value={stats.totalPengajuanAktif}
          icon={ClipboardList}
        />
        <StatsCard
          title="Bimbingan Selesai"
          value={stats.totalBimbinganSelesai}
          icon={CheckCircle2}
          trend={{ value: "Selesai", positive: true }}
        />
      </div>

      <Card className="rounded-2xl border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentPengajuan.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Belum ada pengajuan bimbingan.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentPengajuan.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#2C5EAD] text-xs font-semibold text-white">
                    {getInitials(item.mahasiswa.nama)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800">
                      {item.mahasiswa.nama}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {item.judulSkripsi}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <FaseBadge fase={item.fase} />
                    <StatusPengajuanBadge status={item.status} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {format(new Date(item.createdAt), "dd MMM yyyy", {
                      locale: localeId,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
