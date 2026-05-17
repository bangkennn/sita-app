import type { Role } from "@prisma/client"
import type { NextAuthConfig } from "next-auth"

function isRole(value: unknown): value is Role {
  return value === "ADMIN" || value === "DOSEN" || value === "MAHASISWA"
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.nama = user.nama
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (
        session.user &&
        typeof token.id === "string" &&
        isRole(token.role) &&
        typeof token.nama === "string"
      ) {
        session.user.id = token.id
        session.user.email =
          typeof token.email === "string"
            ? token.email
            : (session.user.email ?? "")
        session.user.role = token.role
        session.user.nama = token.nama
      }
      return session
    },
  },
}
