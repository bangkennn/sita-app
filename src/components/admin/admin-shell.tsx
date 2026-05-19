"use client"

import {
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react"
import { useState } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
interface AdminShellProps {
  adminName: string
  children: React.ReactNode
}

export function AdminShell({ adminName, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar adminName={adminName} className="sticky top-0 h-screen" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          userName={adminName}
          userMeta="Administrator"
          showMenuButton
          onMenuClick={() => setMobileOpen(true)}
        />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="sr-only">Menu</SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <AdminSidebar
              adminName={adminName}
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
            { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/admin/dosen", label: "Dosen", icon: Users },
            { href: "/admin/monitoring", label: "Monitor", icon: GraduationCap },
          ]}
        />
      </div>
    </div>
  )
}
