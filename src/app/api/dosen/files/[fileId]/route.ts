import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/upload"

export async function DELETE(
  _request: Request,
  { params }: { params: { fileId: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const dosenFile = await prisma.dosenFile.findFirst({
      where: {
        id: params.fileId,
        dosenId: dosen.id,
      },
      include: {
        dokumen: {
          include: {
            pengajuan: true,
          },
        },
      },
    })

    if (!dosenFile) {
      return NextResponse.json(
        { success: false, message: "Berkas tidak ditemukan." },
        { status: 404 }
      )
    }

    const pengajuan = dosenFile.dokumen.pengajuan
    if (
      pengajuan.dosenId !== dosen.id &&
      pengajuan.dosenId2 !== dosen.id
    ) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      )
    }

    await deleteFile(dosenFile.fileUrl)

    await prisma.dosenFile.delete({
      where: { id: dosenFile.id },
    })

    return NextResponse.json({
      success: true,
      message: "Berkas berhasil dihapus.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus berkas." },
      { status: 500 }
    )
  }
}
