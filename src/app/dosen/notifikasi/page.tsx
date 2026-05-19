"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { NotifikasiItem } from "@/lib/dosen/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DosenNotifikasiPage() {
  const [notifikasi, setNotifikasi] = useState<NotifikasiItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifikasi()
  }, [])

  async function fetchNotifikasi() {
    try {
      const res = await fetch("/api/dosen/notifikasi")
      const data = await res.json()
      if (data.success) {
        setNotifikasi(data.data)
      }
    } catch {
      toast.error("Gagal memuat notifikasi")
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/dosen/notifikasi/${id}/read`, {
        method: "PATCH",
      })

      const result = await res.json()
      if (result.success) {
        setNotifikasi((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
      }
    } catch {
      toast.error("Gagal menandai sebagai dibaca")
    }
  }

  async function markAllAsRead() {
    const unread = notifikasi.filter((n) => !n.isRead)
    await Promise.all(unread.map((n) => markAsRead(n.id)))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  const unreadCount = notifikasi.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {notifikasi.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Belum ada notifikasi</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifikasi.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !item.isRead ? "border-primary/30 bg-primary/5" : ""
              }`}
              onClick={() => !item.isRead && markAsRead(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {!item.isRead && (
                    <Badge className="mt-1 h-2 w-2 rounded-full p-0" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{item.pesan}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "dd MMM yyyy HH:mm", {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
