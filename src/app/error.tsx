"use client"

import Image from "next/image"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Image
        src="/logo.png"
        alt="SiTA"
        width={64}
        height={64}
        className="mx-auto mb-4 object-contain"
      />
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Terjadi Kesalahan</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
        </p>
      </div>
      <Button onClick={() => reset()}>Coba lagi</Button>
    </div>
  )
}
