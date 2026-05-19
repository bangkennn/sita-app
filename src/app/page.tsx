import Link from "next/link"
import {
  Bell,
  Brain,
  GraduationCap,
  Sparkles,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Brain,
    title: "AI Parsing SK",
    description:
      "Unggah Surat Keputusan pembimbing dan sistem otomatis mengekstrak data dosen serta judul skripsi.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Upload,
    title: "Bimbingan Digital",
    description:
      "Upload dokumen per bab, pantau status review, dan terima berkas dari dosen pembimbing secara terstruktur.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bell,
    title: "Notifikasi Real-time",
    description:
      "Dapatkan pemberitahuan instan saat pengajuan disetujui, dokumen direview, atau ada komentar baru.",
    color: "from-emerald-500 to-teal-500",
  },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <GraduationCap className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SiTA</span>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-gradient hidden sm:inline-flex">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero px-4 py-20 text-white sm:py-28">
        <div className="pattern-dots absolute inset-0 opacity-25" />
        <div className="absolute -left-20 top-20 size-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 size-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="size-4 text-cyan-300" />
            Platform Bimbingan Skripsi Modern
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            <span className="gradient-text-animated">SiTA</span>
          </h1>
          <p className="mt-4 text-xl text-white/90 sm:text-2xl">
            Sistem Bimbingan Tugas Akhir
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
            Kelola pengajuan, upload dokumen bab, review pembimbing, dan pantau
            progres bimbingan skripsi dalam satu platform yang dirancang untuk
            mahasiswa universitas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="btn-gradient h-12 min-w-[160px] px-8 text-base">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[160px] border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20"
              >
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Fitur Unggulan
            </h2>
            <p className="mt-2 text-slate-600">
              Semua yang Anda butuhkan untuk bimbingan skripsi yang lancar
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="card-elevated group p-6 ring-1 ring-slate-100"
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t bg-slate-900 px-4 py-10 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5 text-indigo-400" />
            <span className="font-semibold text-white">SiTA</span>
          </div>
          <p className="text-center text-sm">
            Sistem Bimbingan Tugas Akhir — Universitas
          </p>
          <p className="text-xs">© {new Date().getFullYear()} SiTA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
