"use client"

import { Bell, LayoutDashboard, Users } from "lucide-react"

import {
  AppSidebar,
  type SidebarNavItem,
} from "@/components/layout/app-sidebar"
import type { DosenProfile } from "@/lib/dosen/types"

interface DosenSidebarProps {
  profile: DosenProfile
  unreadCount: number
  onNavigate?: () => void
  className?: string
}

export function DosenSidebar({
  profile,
  unreadCount,
  onNavigate,
  className,
}: DosenSidebarProps) {
  const navItems: SidebarNavItem[] = [
    { href: "/dosen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dosen/mahasiswa", label: "Mahasiswa", icon: Users },
    {
      href: "/dosen/notifikasi",
      label: "Notifikasi",
      icon: Bell,
      badge: unreadCount,
    },
  ]

  return (
    <AppSidebar
      navItems={navItems}
      navSectionLabel="Bimbingan"
      userName={profile.nama}
      userMeta={`NIP ${profile.nip}`}
      portalLabel={profile.prodi}
      onNavigate={onNavigate}
      className={className}
    />
  )
}
