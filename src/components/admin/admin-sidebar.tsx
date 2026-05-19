"use client"

import {
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react"

import {
  AppSidebar,
  type SidebarNavItem,
} from "@/components/layout/app-sidebar"

const navItems: SidebarNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dosen", label: "Kelola Dosen", icon: Users },
  { href: "/admin/monitoring", label: "Monitoring", icon: GraduationCap },
]

interface AdminSidebarProps {
  adminName: string
  onNavigate?: () => void
  className?: string
}

export function AdminSidebar({
  adminName,
  onNavigate,
  className,
}: AdminSidebarProps) {
  return (
    <AppSidebar
      navItems={navItems}
      navSectionLabel="Administrasi"
      userName={adminName}
      userMeta="Administrator"
      portalLabel="Panel Admin"
      onNavigate={onNavigate}
      className={className}
    />
  )
}
