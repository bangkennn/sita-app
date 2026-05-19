import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import Link from "next/link"
import { Bell, FileText, BookOpen } from "lucide-react"
import type { Metadata } from "next"

import { PengajuanStatusCard } from "@/components/mahasiswa/pengajuan-status-card"
import { ProgressTracker } from "@/components/mahasiswa/progress-tracker"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { StatusPengajuanBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { getMahasiswaByUserId } from "@/lib/mahasiswa/auth"
import { getProgressStepIndex } from "@/lib/mahasiswa/progress"
import { formatPembimbingNames } from "@/lib/mahasiswa/format-pembimbing"
import {
  getPengajuanByMahasiswaId,
  getRecentNotifikasi,
} from "@/lib/mahasiswa/queries"

export const metadata: Metadata = {
  title: "Dashboard Mahasiswa",
}

export default async function MahasiswaDashboardPage() {
  const session = await auth()
  const mahasiswa = session?.user
    ? await getMahasiswaByUserId(session.user.id)
    : null

  const pengajuan = mahasiswa
    ? await getPengajuanByMahasiswaId(mahasiswa.id)
    : null

  const notifikasi = session?.user
    ? await getRecentNotifikasi(session.user.id, 3)
    : []

  const progressStep = getProgressStepIndex(
    pengajuan?.status ?? null,
    pengajuan?.fase ?? null
  )

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={mahasiswa?.nama ?? "Mahasiswa"}
        roleLabel="Mahasiswa"
        description={`${mahasiswa?.nim ?? ""} · ${mahasiswa?.prodi ?? ""}`}
      />

      {pengajuan ? (
        <Card>
          <CardHeader>
            <CardTitle>Status Bimbingan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPengajuanBadge status={pengajuan.status} />
              <span className="text-sm text-muted-foreground">
                Pembimbing:{" "}
                {formatPembimbingNames(pengajuan.dosen, pengajuan.dosen2)}
              </span>
            </div>
            <ProgressTracker currentStep={progressStep} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Belum ada pengajuan bimbingan</p>
              <p className="text-sm text-muted-foreground">
                Mulai dengan mengunggah SK pembimbing Anda
              </p>
            </div>
            <Link href="/mahasiswa/pengajuan">
              <Button>Ajukan Bimbingan</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/mahasiswa/pengajuan">
          <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
            <FileText className="size-5" />
            <span>Pengajuan Bimbingan</span>
          </Button>
        </Link>
        <Link href="/mahasiswa/bimbingan">
          <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
            <BookOpen className="size-5" />
            <span>Bimbinganku</span>
          </Button>
        </Link>
        <Link href="/mahasiswa/notifikasi">
          <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
            <Bell className="size-5" />
            <span>Notifikasi</span>
          </Button>
        </Link>
      </div>

      {pengajuan ? (
        <PengajuanStatusCard pengajuan={pengajuan} />
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notifikasi Terbaru</CardTitle>
          <Link
            href="/mahasiswa/notifikasi"
            className="text-sm text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </CardHeader>
        <CardContent>
          {notifikasi.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada notifikasi
            </p>
          ) : (
            <ul className="space-y-3">
              {notifikasi.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-lg border p-3 text-sm ${!item.isRead ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <p>{item.pesan}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(item.createdAt), "dd MMM yyyy HH:mm", {
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
