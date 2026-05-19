"use client"

import { Bell, LayoutDashboard, Users } from "lucide-react"
import { useState } from "react"

import { DosenSidebar } from "@/components/dosen/dosen-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import {
  NotificationsProvider,
  useNotifications,
} from "@/components/notifications/notifications-provider"
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
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <div className="hidden lg:flex lg:shrink-0">
        <DosenSidebar
          profile={profile}
          unreadCount={unreadCount}
          className="sticky top-0 h-screen"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          userName={profile.nama}
          userMeta={profile.nip}
          viewAllHref="/dosen/notifikasi"
          showMenuButton
          onMenuClick={() => setMobileOpen(true)}
        />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="sr-only">Menu</SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <DosenSidebar
              profile={profile}
              unreadCount={unreadCount}
              onNavigate={() => setMobileOpen(false)}
              className="h-full w-full border-0"
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 space-y-6 p-4 pb-24 lg:p-6 lg:pb-6">
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
