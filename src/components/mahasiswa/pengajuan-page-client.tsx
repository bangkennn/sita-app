"use client"

import { useEffect, useState } from "react"

import { PengajuanForm } from "@/components/mahasiswa/pengajuan-form"
import { PengajuanStatusCard } from "@/components/mahasiswa/pengajuan-status-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PengajuanDetail } from "@/lib/mahasiswa/types"

export function PengajuanPageClient() {
  const [pengajuan, setPengajuan] = useState<PengajuanDetail | null | undefined>(
    undefined
  )

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/mahasiswa/pengajuan")
      const result = (await response.json()) as {
        success: boolean
        data: PengajuanDetail | null
      }
      if (result.success) {
        setPengajuan(result.data)
      } else {
        setPengajuan(null)
      }
    }
    void load()
  }, [])

  if (pengajuan === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Bimbingan</h1>
        <p className="text-sm text-muted-foreground">
          {pengajuan
            ? "Pantau status pengajuan bimbingan Anda"
            : "Ajukan dosen pembimbing dengan mengunggah SK"}
        </p>
      </div>

      {pengajuan ? (
        <PengajuanStatusCard pengajuan={pengajuan} showFull />
      ) : (
        <PengajuanForm />
      )}
    </div>
  )
}
