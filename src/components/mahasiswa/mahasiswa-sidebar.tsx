"use client"

import {
  Bell,
  BookOpen,
  FileText,
  LayoutDashboard,
} from "lucide-react"

import { DarkSidebar } from "@/components/layout/dark-sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"

const navItems = [
  { href: "/mahasiswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mahasiswa/pengajuan", label: "Pengajuan", icon: FileText },
  { href: "/mahasiswa/bimbingan", label: "Bimbingan", icon: BookOpen },
  { href: "/mahasiswa/notifikasi", label: "Notifikasi", icon: Bell },
] as const

interface MahasiswaSidebarProps {
  profile: { nama: string; nim: string; prodi: string }
  unreadCount: number
  viewAllHref: string
  onNavigate?: () => void
  className?: string
}

export function MahasiswaSidebar({
  profile,
  unreadCount,
  viewAllHref,
  onNavigate,
  className,
}: MahasiswaSidebarProps) {
  const items = navItems.map((item) =>
    item.href === "/mahasiswa/notifikasi"
      ? { ...item, badge: unreadCount }
      : item
  )

  return (
    <DarkSidebar
      navItems={items}
      userName={profile.nama}
      userMeta={`${profile.nim} · ${profile.prodi}`}
      portalLabel="Portal Mahasiswa"
      headerExtra={
        <NotificationBell viewAllHref={viewAllHref} className="hidden lg:block" />
      }
      onNavigate={onNavigate}
      className={className}
    />
  )
}
