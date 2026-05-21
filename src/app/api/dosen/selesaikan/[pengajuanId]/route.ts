import { NextResponse } from "next/server"

import { getDosenFileValidationError } from "@/lib/dosen/dosen-file"
import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"

function getAllBab45Acc(
  dokumen: { nomorBab: number; status: string }[]
): boolean {
  const bab45 = dokumen.filter((d) => [4, 5].includes(d.nomorBab))
  return bab45.length >= 2 && bab45.every((d) => d.status === "ACC")
}

export async function POST(
  request: Request,
  { params }: { params: { pengajuanId: string } }
) {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const pengajuan = await prisma.pengajuan.findUnique({
      where: { id: params.pengajuanId },
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

    if (pengajuan.fase !== "BAB_4_5") {
      return NextResponse.json(
        {
          success: false,
          message: "Bimbingan hanya dapat diselesaikan pada fase Bab 4-5.",
        },
        { status: 400 }
      )
    }

    if (!getAllBab45Acc(pengajuan.dokumen)) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua bab 4 dan 5 harus disetujui (ACC) terlebih dahulu.",
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const pesan = (formData.get("pesan") as string | null)?.trim()

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Formulir bimbingan wajib diupload." },
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
      "formulir",
      mimeType
    )

    const tanggalSelesai = new Date()
    const pesanDosen = pesan ? `${pesan} ` : ""
    const notifikasiPesan = `🎓 Selamat! Bimbingan Anda telah selesai. ${pesanDosen}Formulir bimbingan tersedia untuk diunduh.`

    await prisma.$transaction(async (tx) => {
      await tx.pengajuan.update({
        where: { id: params.pengajuanId },
        data: {
          fase: "SELESAI",
          tanggalSelesai,
          formulirUrl: url,
          formulirPublicId: pathname,
        },
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: params.pengajuanId,
          userId: pengajuan.mahasiswa.user.id,
          pesan: notifikasiPesan,
        },
      })
    })

    return NextResponse.json({
      success: true,
      formulirUrl: url,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menyelesaikan bimbingan." },
      { status: 500 }
    )
  }
}
