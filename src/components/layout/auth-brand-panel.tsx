import { Brain, Bell, GraduationCap, Sparkles } from "lucide-react"
import Link from "next/link"

const features = [
  { icon: Sparkles, text: "Parsing SK otomatis dengan AI" },
  { icon: GraduationCap, text: "Bimbingan digital terstruktur per bab" },
  { icon: Bell, text: "Notifikasi real-time untuk semua pihak" },
] as const

interface AuthBrandPanelProps {
  title?: string
  subtitle?: string
}

export function AuthBrandPanel({
  title = "SiTA",
  subtitle = "Sistem Bimbingan Tugas Akhir",
}: AuthBrandPanelProps) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-hero p-8 text-white lg:p-12">
      <div className="pattern-dots absolute inset-0 opacity-30" />
      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <GraduationCap className="size-7" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{title}</p>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </Link>
      </div>

      <div className="relative mt-12 space-y-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Brain className="size-3.5" />
            Platform Modern untuk Mahasiswa
          </div>
          <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
            Bimbingan skripsi lebih{" "}
            <span className="text-cyan-200">terorganisir</span> & efisien
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Kelola pengajuan, upload dokumen bab, dan pantau progres bimbingan
            dalam satu platform yang dirancang untuk universitas.
          </p>
        </div>

        <ul className="space-y-4">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <feature.icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-8 text-xs text-white/50">
        © {new Date().getFullYear()} SiTA — Universitas
      </p>
    </div>
  )
}
