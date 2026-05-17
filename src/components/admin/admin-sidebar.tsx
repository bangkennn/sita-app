"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getInitials } from "@/lib/admin/labels"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dosen", label: "Kelola Dosen", icon: Users },
  {
    href: "/admin/monitoring",
    label: "Monitoring Bimbingan",
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
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className="font-semibold leading-none">SiTA</p>
          <p className="text-xs text-muted-foreground">Panel Admin</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(adminName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{adminName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
