import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <GraduationCap className="size-9" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">SiTA</h1>
          <p className="text-lg text-muted-foreground">
            Sistem Bimbingan Tugas Akhir
          </p>
          <p className="text-sm text-muted-foreground">
            Kelola pengajuan, upload dokumen bab, review pembimbing, dan pantau
            progres bimbingan skripsi dalam satu platform.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
          >
            Daftar Mahasiswa
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Admin dan dosen menggunakan akun yang dibuat oleh administrator.
        </p>
      </div>
    </div>
  )
}
