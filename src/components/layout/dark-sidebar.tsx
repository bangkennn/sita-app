"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

import { getInitials } from "@/lib/admin/labels"
import { cn } from "@/lib/utils"

export interface SidebarNavItem {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

interface DarkSidebarProps {
  navItems: SidebarNavItem[]
  userName: string
  userMeta: string
  portalLabel: string
  headerExtra?: React.ReactNode
  onNavigate?: () => void
  className?: string
}

export function DarkSidebar({
  navItems,
  userName,
  userMeta,
  portalLabel,
  headerExtra,
  onNavigate,
  className,
}: DarkSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-slate-900 text-slate-200 transition-colors",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div>
          <p className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
            SiTA
          </p>
          <p className="text-xs text-slate-400">{portalLabel}</p>
        </div>
        {headerExtra}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
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
                "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-indigo-600/20 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4 shrink-0" />
                {item.label}
              </span>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
            {getInitials(userName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">{userMeta}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
