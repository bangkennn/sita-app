import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Halaman Tidak Ditemukan</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </div>
      <Button render={<Link href="/" />}>Kembali ke Beranda</Button>
    </div>
  )
}
