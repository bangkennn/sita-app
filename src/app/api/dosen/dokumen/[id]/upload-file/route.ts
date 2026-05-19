import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import {
  getDosenFileValidationError,
  mapDosenFile,
} from "@/lib/dosen/dosen-file"
import { getDokumenForDosen } from "@/lib/dosen/dokumen-access"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"

export async function POST(
  request: Request,
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

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const keterangan = (formData.get("keterangan") as string | null)?.trim()

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File wajib diisi." },
        { status: 400 }
      )
    }

    const validationError = getDosenFileValidationError(file)
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type || "application/octet-stream"
    const { url, pathname } = await uploadFile(
      buffer,
      file.name,
      "dosen-files",
      mimeType
    )

    const dosenFile = await prisma.$transaction(async (tx) => {
      const created = await tx.dosenFile.create({
        data: {
          dokumenId: dokumen!.id,
          dosenId: dosen.id,
          fileUrl: url,
          filePublicId: pathname,
          fileName: file.name,
          fileType: mimeType,
          keterangan: keterangan || null,
        },
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: dokumen!.pengajuanId,
          userId: dokumen!.pengajuan.mahasiswa.user.id,
          pesan: `Dosen mengirimkan berkas untuk ${dokumen!.judulBab}: ${file.name}`,
        },
      })

      return created
    })

    return NextResponse.json({
      success: true,
      message: "Berkas berhasil dikirim ke mahasiswa.",
      data: mapDosenFile(dosenFile),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengupload berkas." },
      { status: 500 }
    )
  }
}
