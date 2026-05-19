"use client"

import { Bell } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { EmptyState } from "@/components/admin/empty-state"
import { useNotifications } from "@/components/notifications/notifications-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { NotifikasiItem } from "@/lib/notifications/types"
import { relativeTime } from "@/lib/utils/time"
import { cn } from "@/lib/utils"

interface NotifikasiListPageProps {
  title?: string
  description: string
}

export function NotifikasiListPage({
  title = "Notifikasi",
  description,
}: NotifikasiListPageProps) {
  const { markAsRead, markAllAsRead, refreshUnreadCount } = useNotifications()
  const [items, setItems] = useState<NotifikasiItem[] | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      const result = (await res.json()) as {
        success: boolean
        data?: NotifikasiItem[]
      }
      setItems(result.success && result.data ? result.data : [])
    } catch {
      toast.error("Gagal memuat notifikasi")
      setItems([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleMarkAsRead(id: string) {
    try {
      await markAsRead(id)
      setItems((prev) =>
        prev?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? null
      )
    } catch {
      toast.error("Gagal menandai sebagai dibaca")
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead()
      setItems((prev) => prev?.map((n) => ({ ...n, isRead: true })) ?? null)
      await refreshUnreadCount()
    } catch {
      toast.error("Gagal menandai semua sebagai dibaca")
    }
  }

  const unreadCount = items?.filter((n) => !n.isRead).length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {items === null
              ? "Memuat..."
              : unreadCount > 0
                ? `${unreadCount} belum dibaca`
                : description}
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={() => void handleMarkAllAsRead()}>
            Tandai semua dibaca
          </Button>
        ) : null}
      </div>

      {items === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={Bell}
              title="Belum ada notifikasi"
              description="Notifikasi akan muncul saat ada pembaruan terkait bimbingan Anda."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                !item.isRead &&
                  "border-l-4 border-l-[#2C5EAD] bg-[#EEF3FB]"
              )}
              onClick={() => {
                if (!item.isRead) void handleMarkAsRead(item.id)
              }}
            >
              <CardContent className="p-4">
                <p className="text-sm">{item.pesan}</p>
                {item.pengajuan.judulSkripsi ? (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {item.pengajuan.judulSkripsi}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {relativeTime(item.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
