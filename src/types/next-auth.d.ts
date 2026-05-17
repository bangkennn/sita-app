import type { Role } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
    nama: string
  }

  interface Session {
    user: {
      id: string
      email: string
      role: Role
      nama: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email?: string | null
    role: Role
    nama: string
  }
}
