"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface MobileNavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface MobileBottomNavProps {
  items: MobileNavItem[]
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-medium",
                  isActive ? "text-[#2C5EAD]" : "text-gray-400"
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
