"use client"

import { Bell, LayoutDashboard, Users } from "lucide-react"

import { DarkSidebar } from "@/components/layout/dark-sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import type { DosenProfile } from "@/lib/dosen/types"

const navItems = [
  { href: "/dosen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dosen/mahasiswa", label: "Mahasiswa", icon: Users },
  { href: "/dosen/notifikasi", label: "Notifikasi", icon: Bell },
] as const

interface DosenSidebarProps {
  profile: DosenProfile
  unreadCount: number
  viewAllHref: string
  className?: string
  onNavigate?: () => void
}

export function DosenSidebar({
  profile,
  unreadCount,
  viewAllHref,
  className,
  onNavigate,
}: DosenSidebarProps) {
  const items = navItems.map((item) =>
    item.href === "/dosen/notifikasi" ? { ...item, badge: unreadCount } : item
  )

  return (
    <DarkSidebar
      navItems={items}
      userName={profile.nama}
      userMeta={`NIP ${profile.nip}`}
      portalLabel={profile.prodi}
      headerExtra={
        <NotificationBell viewAllHref={viewAllHref} className="hidden lg:block" />
      }
      onNavigate={onNavigate}
      className={className}
    />
  )
}
