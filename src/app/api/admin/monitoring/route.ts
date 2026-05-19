import { NextResponse } from "next/server"

import type { MonitoringPengajuanItem } from "@/lib/admin/types"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error } = await requireRole("ADMIN")
  if (error) return error

  try {
    const rows = await prisma.pengajuan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mahasiswa: { select: { nama: true, nim: true } },
        dosen: { select: { nama: true } },
        dosen2: { select: { nama: true } },
      },
    })

    const data: MonitoringPengajuanItem[] = rows.map((row) => ({
      id: row.id,
      judulSkripsi: row.judulSkripsi,
      fase: row.fase,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      mahasiswa: row.mahasiswa,
      dosen: row.dosen,
      dosen2: row.dosen2,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat data monitoring." },
      { status: 500 }
    )
  }
}
