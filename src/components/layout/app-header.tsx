"use client"

import Image from "next/image"
import { Menu, Search } from "lucide-react"
import { usePathname } from "next/navigation"

import { NotificationBell } from "@/components/notifications/NotificationBell"
import { getInitials } from "@/lib/admin/labels"
import { getPageTitle } from "@/lib/layout/page-titles"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  userName: string
  userMeta?: string
  viewAllHref?: string
  onMenuClick?: () => void
  showMenuButton?: boolean
  className?: string
}

export function AppHeader({
  userName,
  userMeta,
  viewAllHref,
  onMenuClick,
  showMenuButton = false,
  className,
}: AppHeaderProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6",
        className
      )}
    >
      {showMenuButton ? (
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </button>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="SiTA"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-[#2C5EAD]">SiTA</span>
        </div>
      </div>

      <h1 className="hidden min-w-0 flex-1 truncate text-lg font-bold text-gray-800 sm:text-xl lg:block">
        {pageTitle}
      </h1>

      <div className="hidden max-w-xs flex-1 md:block">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Cari..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 pr-4 pl-10 text-sm text-gray-600 placeholder:text-gray-400 focus:border-[#2C5EAD] focus:bg-white focus:ring-2 focus:ring-[#2C5EAD]/20 focus:outline-none"
            readOnly
            aria-hidden
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {viewAllHref ? (
          <NotificationBell viewAllHref={viewAllHref} />
        ) : null}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#2C5EAD] text-xs font-semibold text-white">
            {getInitials(userName)}
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-gray-800">
              {userName}
            </p>
            {userMeta ? (
              <p className="truncate text-xs text-gray-500">{userMeta}</p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
