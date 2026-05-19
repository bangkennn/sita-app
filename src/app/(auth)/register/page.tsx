"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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

export default function RegisterPage() {
  const router = useRouter()
  const [nama, setNama] = useState("")
  const [nim, setNim] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [prodi, setProdi] = useState("")
  const [angkatan, setAngkatan] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.")
      return
    }
    if (!nim.trim()) {
      setError("NIM wajib diisi.")
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Email tidak valid.")
      return
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.")
      return
    }
    if (!prodi.trim()) {
      setError("Program studi wajib diisi.")
      return
    }
    const angkatanNum = parseInt(angkatan, 10)
    if (!angkatan || Number.isNaN(angkatanNum) || angkatanNum < 2000) {
      setError("Angkatan tidak valid.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          nim,
          email: email.trim(),
          password,
          prodi,
          angkatan: parseInt(angkatan, 10),
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        message: string
      }

      if (!response.ok || !data.success) {
        setError(data.message ?? "Registrasi gagal.")
        return
      }

      setSuccess(data.message)
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="card-elevated border-0 shadow-xl ring-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Daftar Mahasiswa</CardTitle>
        <CardDescription>
          Registrasi akun mahasiswa SiTA
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          {success ? (
            <div
              role="status"
              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
            >
              {success}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              type="text"
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nim">NIM</Label>
            <Input
              id="nim"
              type="text"
              placeholder="1234567890"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
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
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prodi">Program Studi</Label>
            <Input
              id="prodi"
              type="text"
              placeholder="Teknik Informatika"
              value={prodi}
              onChange={(e) => setProdi(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="angkatan">Angkatan</Label>
            <Input
              id="angkatan"
              type="number"
              placeholder="2024"
              min={2000}
              max={2100}
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-0 bg-transparent">
          <Button type="submit" className="btn-gradient h-11 w-full" disabled={isLoading}>
            {isLoading ? "Mendaftar..." : "Daftar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
