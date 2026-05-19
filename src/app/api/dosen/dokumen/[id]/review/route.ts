import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

interface PatchBody {
  status: "ACC" | "PERLU_REVISI"
  komentar?: string
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const body = (await request.json()) as PatchBody
    const { status, komentar } = body

    const dokumen = await prisma.dokumen.findUnique({
      where: { id: params.id },
      include: {
        pengajuan: {
          include: {
            mahasiswa: { include: { user: { select: { id: true } } } },
            dosen: { include: { user: { select: { id: true } } } },
            dosen2: { include: { user: { select: { id: true } } } },
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
      await tx.dokumen.update({
        where: { id: params.id },
        data: {
          status,
          reviewedAt: new Date(),
        },
      })

      if (komentar && komentar.trim()) {
        await tx.komentar.create({
          data: {
            dokumenId: params.id,
            authorId: dosen.userId,
            isiKomentar: komentar.trim(),
          },
        })
      }

      await tx.notifikasi.create({
        data: {
          pengajuanId: dokumen.pengajuan.id,
          userId: dokumen.pengajuan.mahasiswa.user.id,
          pesan: `Bab ${dokumen.nomorBab} telah ditinjau: ${status === "ACC" ? "ACC" : "Perlu Revisi"}`,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: status === "ACC" ? "Dokumen ACC." : "Dokumen perlu revisi.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memproses review." },
      { status: 500 }
    )
  }
}
