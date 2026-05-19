"use client"

import Image from "next/image"
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

interface AppSidebarProps {
  navItems: SidebarNavItem[]
  navSectionLabel?: string
  userName: string
  userMeta: string
  portalLabel: string
  onNavigate?: () => void
  className?: string
}

export function AppSidebar({
  navItems,
  navSectionLabel = "Menu",
  userName,
  userMeta,
  portalLabel: _portalLabel,
  onNavigate,
  className,
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-gray-100 bg-white",
        className
      )}
    >
      <div className="border-b border-gray-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SiTA Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <div>
            <p className="text-lg font-bold leading-none text-[#2C5EAD]">
              SiTA
            </p>
            <p className="text-xs leading-none text-gray-400">
              Bimbingan Tugas Akhir
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {navSectionLabel}
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg py-2.5 pr-3 text-sm transition-colors",
                    isActive
                      ? "border-l-4 border-[#2C5EAD] bg-[#EEF3FB] pl-[calc(0.75rem-4px)] font-semibold text-[#2C5EAD]"
                      : "pl-3 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-[18px] shrink-0" />
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 ? (
                    <span className="size-2 rounded-full bg-red-500" />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2C5EAD] text-sm font-semibold text-white">
            {getInitials(userName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              {userName}
            </p>
            <p className="truncate text-xs text-gray-500">{userMeta}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
