"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Suspense, useState } from "react"
import type { Role } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDashboardPath } from "@/lib/dashboard"

function isRole(value: string): value is Role {
  return value === "ADMIN" || value === "DOSEN" || value === "MAHASISWA"
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email wajib diisi.")
      return
    }
    if (!password) {
      setError("Password wajib diisi.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Format email tidak valid.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah.")
        return
      }

      const sessionRes = await fetch("/api/auth/session")
      const session = (await sessionRes.json()) as {
        user?: { role?: string }
      }

      const role = session.user?.role
      if (role && isRole(role)) {
        const callbackUrl = searchParams.get("callbackUrl")
        const destination =
          callbackUrl && callbackUrl.startsWith("/")
            ? callbackUrl
            : getDashboardPath(role)
        router.push(destination)
        router.refresh()
        return
      }

      setError("Gagal memuat sesi. Silakan coba lagi.")
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Selamat Datang
        </CardTitle>
        <CardDescription>Masuk ke akun SiTA Anda</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {error}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-0 bg-transparent pt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl text-base"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 underline-offset-4 hover:underline"
            >
              Daftar sebagai mahasiswa
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

function LoginFormFallback() {
  return (
    <Card className="card-elevated border-0 shadow-xl">
      <CardHeader className="text-center">
        <Image
          src="/logo.png"
          alt="SiTA Logo"
          width={48}
          height={48}
          className="mx-auto mb-2 object-contain"
        />
        <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
        <CardDescription>Memuat formulir...</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  )
}
