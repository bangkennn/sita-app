import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

interface PostBody {
  komentar: string
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const body = (await request.json()) as PostBody
    const { komentar } = body

    if (!komentar?.trim()) {
      return NextResponse.json(
        { success: false, message: "Komentar wajib diisi." },
        { status: 400 }
      )
    }

    const dokumen = await prisma.dokumen.findUnique({
      where: { id: params.id },
      include: {
        pengajuan: {
          include: {
            mahasiswa: { include: { user: { select: { id: true } } } },
          },
        },
      },
    })

    if (!dokumen) {
      return NextResponse.json(
        { success: false, message: "Dokumen tidak ditemukan." },
        { status: 404 }
      )
    }

    if (
      dokumen.pengajuan.dosenId !== dosen.id &&
      dokumen.pengajuan.dosenId2 !== dosen.id
    ) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.komentar.create({
        data: {
          dokumenId: params.id,
          authorId: dosen.userId,
          isiKomentar: komentar.trim(),
        },
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: dokumen.pengajuan.id,
          userId: dokumen.pengajuan.mahasiswa.user.id,
          pesan: `Dosen menambahkan komentar pada Bab ${dokumen.nomorBab}`,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil ditambahkan.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan komentar." },
      { status: 500 }
    )
  }
}
