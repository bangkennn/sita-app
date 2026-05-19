"use client"

import { Bell, LayoutDashboard, Menu, Users } from "lucide-react"
import { useState } from "react"

import { DosenSidebar } from "@/components/dosen/dosen-sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import {
  NotificationsProvider,
  useNotifications,
} from "@/components/notifications/notifications-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { DosenProfile } from "@/lib/dosen/types"

interface DosenShellProps {
  profile: DosenProfile
  children: React.ReactNode
}

function DosenShellInner({ profile, children }: DosenShellProps) {
  const { unreadCount } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-full bg-slate-50">
      <div className="hidden lg:flex lg:shrink-0">
        <DosenSidebar
          profile={profile}
          unreadCount={unreadCount}
          viewAllHref="/dosen/notifikasi"
          className="sticky top-0 h-screen"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b bg-background px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="outline" size="icon-sm" />}
              >
                <Menu className="size-4" />
                <span className="sr-only">Buka menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu navigasi</SheetTitle>
                </SheetHeader>
                <DosenSidebar
                  profile={profile}
                  unreadCount={unreadCount}
                  viewAllHref="/dosen/notifikasi"
                  onNavigate={() => setMobileOpen(false)}
                  className="h-full w-full border-0"
                />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-semibold">SiTA</p>
              <p className="text-xs text-muted-foreground">{profile.nama}</p>
            </div>
          </div>
          <NotificationBell viewAllHref="/dosen/notifikasi" />
        </header>

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-8 lg:p-8">
          {children}
        </main>
        <MobileBottomNav
          items={[
            { href: "/dosen/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/dosen/mahasiswa", label: "Mhs", icon: Users },
            { href: "/dosen/notifikasi", label: "Notif", icon: Bell },
          ]}
        />
      </div>
    </div>
  )
}

export function DosenShell({ profile, children }: DosenShellProps) {
  return (
    <NotificationsProvider>
      <DosenShellInner profile={profile}>{children}</DosenShellInner>
    </NotificationsProvider>
  )
}
