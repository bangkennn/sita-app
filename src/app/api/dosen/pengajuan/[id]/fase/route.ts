import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

interface PatchBody {
  fase: "BAB_4_5"
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const body = (await request.json()) as PatchBody
    const { fase } = body

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { id: params.id },
      include: {
        mahasiswa: { include: { user: { select: { id: true } } } },
        dokumen: true,
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

    if (fase === "BAB_4_5") {
      if (pengajuan.fase !== "SEMPRO") {
        return NextResponse.json(
          { success: false, message: "Transisi fase tidak valid." },
          { status: 400 }
        )
      }

      await prisma.$transaction(async (tx) => {
        await tx.pengajuan.update({
          where: { id: params.id },
          data: { fase: "BAB_4_5" },
        })

        await tx.notifikasi.create({
          data: {
            pengajuanId: params.id,
            userId: pengajuan.mahasiswa.user.id,
            pesan:
              "Dosen pembimbing telah membuka bimbingan Bab 4-5. Silakan upload dokumen Bab 4 dan 5.",
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: "Fase berhasil diperbarui.",
      })
    }

    return NextResponse.json(
      { success: false, message: "Fase tidak valid." },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui fase." },
      { status: 500 }
    )
  }
}
