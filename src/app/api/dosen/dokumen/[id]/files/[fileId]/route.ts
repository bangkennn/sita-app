import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { getDokumenForDosen } from "@/lib/dosen/dokumen-access"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/upload"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; fileId: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const { dokumen, error: accessError } = await getDokumenForDosen(
      params.id,
      dosen
    )

    if (accessError === "not_found") {
      return NextResponse.json(
        { success: false, message: "Dokumen tidak ditemukan." },
        { status: 404 }
      )
    }

    if (accessError === "forbidden") {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      )
    }

    const dosenFile = await prisma.dosenFile.findFirst({
      where: {
        id: params.fileId,
        dokumenId: params.id,
        dosenId: dosen.id,
      },
    })

    if (!dosenFile) {
      return NextResponse.json(
        { success: false, message: "Berkas tidak ditemukan." },
        { status: 404 }
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
