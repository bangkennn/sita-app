"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { useNotifications } from "@/components/notifications/notifications-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { NotifikasiItem } from "@/lib/notifications/types"
import { relativeTime } from "@/lib/utils/time"
import { cn } from "@/lib/utils"

interface NotificationBellProps {
  viewAllHref: string
  className?: string
}

export function NotificationBell({ viewAllHref, className }: NotificationBellProps) {
  const { unreadCount, markAsRead, markAllAsRead, fetchRecent, refreshUnreadCount } =
    useNotifications()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotifikasiItem[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadRecent = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchRecent(5)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [fetchRecent])

  useEffect(() => {
    if (!open) return
    void loadRecent()
  }, [open, loadRecent])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  async function handleItemClick(item: NotifikasiItem) {
    if (!item.isRead) {
      await markAsRead(item.id)
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      )
    }
  }

  async function handleMarkAllRead() {
    await markAllAsRead()
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
    await refreshUnreadCount()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        size="icon-sm"
        className="relative"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
        <span className="sr-only">Notifikasi</span>
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold">Notifikasi</p>
            {unreadCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={() => void handleMarkAllRead()}
              >
                Tandai semua dibaca
              </Button>
            ) : null}
          </div>
          <Separator />
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Memuat...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Belum ada notifikasi
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        !item.isRead && "bg-primary/5"
                      )}
                      onClick={() => void handleItemClick(item)}
                    >
                      <p className="text-sm leading-snug">{item.pesan}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {relativeTime(item.createdAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Separator />
          <div className="p-2">
            <Link
              href={viewAllHref}
              className="block rounded-md px-3 py-2 text-center text-sm font-medium text-primary hover:bg-muted/50"
              onClick={() => setOpen(false)}
            >
              Lihat semua
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
