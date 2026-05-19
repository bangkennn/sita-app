"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"

import { EmptyState } from "@/components/admin/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotifikasiItem } from "@/lib/mahasiswa/types"

export default function MahasiswaNotifikasiPage() {
  const [items, setItems] = useState<NotifikasiItem[] | null>(null)

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/mahasiswa/notifikasi?limit=50")
      const result = (await response.json()) as {
        success: boolean
        data?: NotifikasiItem[]
      }
      setItems(result.success && result.data ? result.data : [])
    }
    void load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
        <p className="text-sm text-muted-foreground">
          Pemberitahuan terkait bimbingan Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {items === null ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Belum ada notifikasi"
              description="Notifikasi akan muncul saat ada pembaruan pengajuan atau bimbingan."
            />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-lg border p-4 ${!item.isRead ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <p className="text-sm">{item.pesan}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(item.createdAt), "dd MMMM yyyy, HH:mm", {
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
