"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { NotifikasiItem } from "@/lib/notifications/types"

const POLL_INTERVAL_MS = 15_000

interface NotificationsContextValue {
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  fetchRecent: (limit?: number) => Promise<NotifikasiItem[]>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider")
  }
  return context
}

interface NotificationsProviderProps {
  children: React.ReactNode
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count")
      if (!res.ok) return
      const data = (await res.json()) as { count: number }
      setUnreadCount(data.count ?? 0)
    } catch {
      // ignore polling errors
    }
  }, [])

  useEffect(() => {
    void refreshUnreadCount()
    const interval = setInterval(() => {
      void refreshUnreadCount()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refreshUnreadCount])

  const markAsRead = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      })
      if (!res.ok) return
      setUnreadCount((c) => Math.max(0, c - 1))
    },
    []
  )

  const markAllAsRead = useCallback(async () => {
    const res = await fetch("/api/notifications/read-all", {
      method: "PATCH",
    })
    if (!res.ok) return
    setUnreadCount(0)
  }, [])

  const fetchRecent = useCallback(async (limit = 5) => {
    const res = await fetch(`/api/notifications?limit=${limit}`)
    const result = (await res.json()) as {
      success: boolean
      data?: NotifikasiItem[]
    }
    return result.success && result.data ? result.data : []
  }, [])

  const value = useMemo(
    () => ({
      unreadCount,
      refreshUnreadCount,
      markAsRead,
      markAllAsRead,
      fetchRecent,
    }),
    [unreadCount, refreshUnreadCount, markAsRead, markAllAsRead, fetchRecent]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
