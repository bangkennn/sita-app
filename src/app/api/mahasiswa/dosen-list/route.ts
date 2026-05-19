import { NextResponse } from "next/server"

import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import type { DosenOption } from "@/lib/mahasiswa/types"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error } = await requireMahasiswa()
  if (error) return error

  try {
    const dosenList = await prisma.dosen.findMany({
      where: { isActive: true },
      orderBy: { nama: "asc" },
      select: { id: true, nama: true, nip: true, prodi: true },
    })

    const data: DosenOption[] = dosenList

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat daftar dosen." },
      { status: 500 }
    )
  }
}
