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
      <button
        type="button"
        className="relative flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="size-5" strokeWidth={1.75} />
        {unreadCount > 0 ? (
          <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        ) : null}
        <span className="sr-only">Notifikasi</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">Notifikasi</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-xs font-medium text-[#2C5EAD] hover:underline"
                onClick={() => void handleMarkAllRead()}
              >
                Tandai semua dibaca
              </button>
            ) : null}
          </div>
          <Separator />
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                Memuat...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                Semua sudah terbaca
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full border-l-4 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                        !item.isRead
                          ? "border-l-[#2C5EAD] bg-[#EEF3FB]"
                          : "border-l-transparent bg-white"
                      )}
                      onClick={() => void handleItemClick(item)}
                    >
                      <p className="text-sm leading-snug text-gray-800">
                        {item.pesan}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
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
              className="block rounded-xl px-3 py-2 text-center text-sm font-medium text-[#2C5EAD] hover:bg-[#EEF3FB]"
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
