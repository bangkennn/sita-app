import { NextResponse } from "next/server"

import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error, mahasiswa } = await requireMahasiswa()
  if (error || !mahasiswa) return error

  try {
    const pengajuan = await prisma.pengajuan.findUnique({
      where: { mahasiswaId: mahasiswa.id },
      include: {
        dosen: {
          select: {
            id: true,
            nama: true,
            nip: true,
            prodi: true,
            qrCodeUrl: true,
          },
        },
      },
    })

    if (!pengajuan) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({
      success: true,
      data: {
        qrTerkirim: pengajuan.qrTerkirim,
        qrTerkirimAt: pengajuan.qrTerkirimAt?.toISOString() ?? null,
        qrCodeUrl: pengajuan.dosen.qrCodeUrl ?? null,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat QR code." },
      { status: 500 }
    )
  }
}
