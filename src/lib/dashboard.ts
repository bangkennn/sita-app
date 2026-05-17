import type { Role } from "@prisma/client"

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard"
    case "DOSEN":
      return "/dosen/dashboard"
    case "MAHASISWA":
      return "/mahasiswa/dashboard"
    default: {
      const _exhaustive: never = role
      return _exhaustive
    }
  }
}
