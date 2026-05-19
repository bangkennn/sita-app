import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SiTA — Sistem Bimbingan Tugas Akhir",
    template: "%s | SiTA",
  },
  description:
    "Platform bimbingan skripsi modern untuk mahasiswa, dosen, dan administrator universitas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} h-full`}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  )
}
