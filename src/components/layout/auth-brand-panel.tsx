import Image from "next/image"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const features = [
  "Parsing SK otomatis dengan AI",
  "Bimbingan digital terstruktur per bab",
  "Notifikasi real-time untuk semua pihak",
] as const

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-auth p-10 text-white lg:flex lg:w-[40%]">
      <div className="auth-deco-circle -top-20 -left-20 size-72" />
      <div className="auth-deco-circle top-1/3 -right-16 size-56" />
      <div className="auth-deco-circle bottom-10 left-1/4 size-40" />

      <div className="relative">
        <Link href="/" className="inline-flex">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="SiTA Logo"
              width={80}
              height={80}
              className="object-contain brightness-0 invert"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">SiTA</h1>
              <p className="mt-1 text-sm text-blue-200">
                Sistem Bimbingan Tugas Akhir
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="relative space-y-8 py-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            Platform Profesional
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            Bimbingan skripsi lebih terorganisir
          </h2>
          <p className="mt-3 text-white/80">
            Dirancang untuk mahasiswa, dosen pembimbing, dan administrator
            universitas.
          </p>
        </div>
        <ul className="space-y-4">
          {features.map((text) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Check className="size-3.5" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/50">
        © {new Date().getFullYear()} SiTA — Universitas
      </p>
    </div>
  )
}
