import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { mapDosenFile } from "@/lib/dosen/dosen-file"
import { getDokumenForDosen } from "@/lib/dosen/dokumen-access"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
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

    const files = await prisma.dosenFile.findMany({
      where: { dokumenId: params.id },
      orderBy: { uploadedAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: files.map(mapDosenFile),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat berkas." },
      { status: 500 }
    )
  }
}
