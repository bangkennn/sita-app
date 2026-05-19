"use client"

import {
  Bell,
  BookOpen,
  FileText,
  LayoutDashboard,
} from "lucide-react"

import {
  AppSidebar,
  type SidebarNavItem,
} from "@/components/layout/app-sidebar"

interface MahasiswaSidebarProps {
  profile: { nama: string; nim: string; prodi: string }
  unreadCount: number
  onNavigate?: () => void
  className?: string
}

export function MahasiswaSidebar({
  profile,
  unreadCount,
  onNavigate,
  className,
}: MahasiswaSidebarProps) {
  const navItems: SidebarNavItem[] = [
    { href: "/mahasiswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mahasiswa/pengajuan", label: "Pengajuan", icon: FileText },
    { href: "/mahasiswa/bimbingan", label: "Bimbingan", icon: BookOpen },
    {
      href: "/mahasiswa/notifikasi",
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
      userMeta={`${profile.nim} · ${profile.prodi}`}
      portalLabel="Portal Mahasiswa"
      onNavigate={onNavigate}
      className={className}
    />
  )
}
