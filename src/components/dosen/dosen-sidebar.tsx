"use client"

import { Bell, LayoutDashboard, LogOut, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { DosenProfile } from "@/lib/dosen/types"

interface DosenSidebarProps {
  profile: DosenProfile
  unreadCount: number
  className?: string
  onNavigate?: () => void
}

const navItems = [
  {
    href: "/dosen/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dosen/mahasiswa",
    label: "Mahasiswa Bimbingan",
    icon: Users,
  },
  {
    href: "/dosen/notifikasi",
    label: "Notifikasi",
    icon: Bell,
  },
] as const

export function DosenSidebar({
  profile,
  unreadCount,
  className,
  onNavigate,
}: DosenSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={className}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <p className="text-lg font-semibold">SiTA</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{profile.nama}</p>
            <p className="text-xs text-muted-foreground">NIP: {profile.nip}</p>
            <p className="text-xs text-muted-foreground">{profile.prodi}</p>
          </div>

          <Separator className="my-2" />

          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isNotifikasi = item.href === "/dosen/notifikasi"

              return (
                <Link key={item.href} href={item.href} onClick={onNavigate}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 size-4" />
                    {item.label}
                    {isNotifikasi && unreadCount > 0 && (
                      <Badge className="ml-auto h-4 min-w-4 justify-center px-1 text-[10px]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
