"use client"

import { Menu } from "lucide-react"
import { useState } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
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
    <div className="flex min-h-full bg-muted/20">
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar adminName={adminName} className="sticky top-0 h-screen" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
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
              <AdminSidebar
                adminName={adminName}
                onNavigate={() => setMobileOpen(false)}
                className="h-full w-full border-0"
              />
            </SheetContent>
          </Sheet>
          <div>
            <p className="text-sm font-semibold">SiTA Admin</p>
            <p className="text-xs text-muted-foreground">{adminName}</p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
