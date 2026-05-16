import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiTA - Sistem Bimbingan Tugas Akhir",
  description: "Platform bimbingan tugas akhir mahasiswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  );
}