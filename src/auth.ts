import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Role } from "@prisma/client"

import { authConfig } from "@/auth.config"
import { prisma } from "@/lib/prisma"

function resolveDisplayName(user: {
  role: Role
  dosen: { nama: string } | null
  mahasiswa: { nama: string } | null
}): string {
  if (user.mahasiswa) return user.mahasiswa.nama
  if (user.dosen) return user.dosen.nama
  return "Administrator"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email.trim() : ""
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""

        if (!email || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            dosen: { select: { nama: true } },
            mahasiswa: { select: { nama: true } },
          },
        })

        if (!user) {
          return null
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          nama: resolveDisplayName(user),
        }
      },
    }),
  ],
})
