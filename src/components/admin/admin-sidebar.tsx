"use client"

import {
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react"

import { DarkSidebar } from "@/components/layout/dark-sidebar"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dosen", label: "Kelola Dosen", icon: Users },
  {
    href: "/admin/monitoring",
    label: "Monitoring",
    icon: GraduationCap,
  },
] as const

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
    <DarkSidebar
      navItems={[...navItems]}
      userName={adminName}
      userMeta="Administrator"
      portalLabel="Panel Admin"
      onNavigate={onNavigate}
      className={className}
    />
  )
}
