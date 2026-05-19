"use client"

import {
  GraduationCap,
  LayoutDashboard,
  Menu,
  Users,
} from "lucide-react"
import { useState } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
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
    <div className="flex min-h-full bg-slate-50">
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar adminName={adminName} className="sticky top-0 h-screen" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon-sm" />}>
              <Menu className="size-4" />
              <span className="sr-only">Buka menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu navigasi</SheetTitle>
              </SheetHeader>
              <AdminSidebar
                adminName={adminName}
                onNavigate={() => setMobileOpen(false)}
                className="h-full w-full border-0"
              />
            </SheetContent>
          </Sheet>
          <div>
            <p className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-sm font-bold text-transparent">
              SiTA Admin
            </p>
            <p className="text-xs text-slate-500">{adminName}</p>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-8 lg:p-8">
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
