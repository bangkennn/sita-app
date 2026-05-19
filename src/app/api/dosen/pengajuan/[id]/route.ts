import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

interface PatchBody {
  action: "terima" | "tolak"
  catatan?: string
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const body = (await request.json()) as PatchBody
    const { action, catatan } = body

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { id: params.id },
      include: {
        mahasiswa: { include: { user: { select: { id: true } } } },
        dosen: { include: { user: { select: { id: true } } } },
        dosen2: { include: { user: { select: { id: true } } } },
      },
    })

    if (!pengajuan) {
      return NextResponse.json(
        { success: false, message: "Pengajuan tidak ditemukan." },
        { status: 404 }
      )
    }

    if (pengajuan.dosenId !== dosen.id && pengajuan.dosenId2 !== dosen.id) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      )
    }

    if (action === "terima") {
      await prisma.$transaction(async (tx) => {
        await tx.pengajuan.update({
          where: { id: params.id },
          data: { status: "DITERIMA" },
        })

        await tx.notifikasi.create({
          data: {
            pengajuanId: params.id,
            userId: pengajuan.mahasiswa.user.id,
            pesan: `Pengajuan bimbingan Anda telah diterima oleh ${dosen.nama}`,
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: "Pengajuan berhasil diterima.",
      })
    }

    if (action === "tolak") {
      if (!catatan?.trim()) {
        return NextResponse.json(
          { success: false, message: "Catatan wajib diisi." },
          { status: 400 }
        )
      }

      await prisma.$transaction(async (tx) => {
        await tx.pengajuan.update({
          where: { id: params.id },
          data: {
            status: "DITOLAK",
            catatanDosen: catatan.trim(),
          },
        })

        await tx.notifikasi.create({
          data: {
            pengajuanId: params.id,
            userId: pengajuan.mahasiswa.user.id,
            pesan: `Pengajuan bimbingan Anda ditolak oleh ${dosen.nama}. Catatan: ${catatan.trim()}`,
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: "Pengajuan berhasil ditolak.",
      })
    }

    return NextResponse.json(
      { success: false, message: "Action tidak valid." },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memproses pengajuan." },
      { status: 500 }
    )
  }
}
