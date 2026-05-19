"use client"

import { Bell, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { MahasiswaSidebar } from "@/components/mahasiswa/mahasiswa-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { MahasiswaProfile } from "@/lib/mahasiswa/types"

interface MahasiswaShellProps {
  profile: MahasiswaProfile
  unreadCount: number
  children: React.ReactNode
}

export function MahasiswaShell({
  profile,
  unreadCount,
  children,
}: MahasiswaShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-full bg-muted/20">
      <div className="hidden lg:flex lg:shrink-0">
        <MahasiswaSidebar
          profile={profile}
          unreadCount={unreadCount}
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
                <MahasiswaSidebar
                  profile={profile}
                  unreadCount={unreadCount}
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
          <Link href="/mahasiswa/notifikasi">
            <Button variant="outline" size="icon-sm" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-[10px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              ) : null}
            </Button>
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
