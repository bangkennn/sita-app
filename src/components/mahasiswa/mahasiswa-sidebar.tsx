"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getInitials } from "@/lib/admin/labels"
import type { MahasiswaProfile } from "@/lib/mahasiswa/types"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/mahasiswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mahasiswa/pengajuan", label: "Pengajuan Bimbingan", icon: FileText },
  { href: "/mahasiswa/bimbingan", label: "Bimbinganku", icon: BookOpen },
  { href: "/mahasiswa/notifikasi", label: "Notifikasi", icon: Bell },
] as const

interface MahasiswaSidebarProps {
  profile: MahasiswaProfile
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
          <p className="text-xs text-muted-foreground">Portal Mahasiswa</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          const showBadge =
            item.href === "/mahasiswa/notifikasi" && unreadCount > 0

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4 shrink-0" />
                {item.label}
              </span>
              {showBadge ? (
                <Badge
                  variant={isActive ? "secondary" : "default"}
                  className="h-5 min-w-5 justify-center px-1.5"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(profile.nama)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profile.nama}</p>
            <p className="text-xs text-muted-foreground">{profile.nim}</p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.prodi}
            </p>
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
