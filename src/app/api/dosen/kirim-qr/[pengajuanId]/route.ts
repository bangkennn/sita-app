import { NextResponse } from "next/server"

import { allBabsAcc } from "@/lib/bimbingan/dokumen"
import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

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
        dosen: { select: { qrCodeUrl: true } },
        dokumen: true,
      },
    })

    if (!pengajuan) {
      return NextResponse.json(
        { success: false, message: "Pengajuan tidak ditemukan." },
        { status: 404 }
      )
    }

    if (pengajuan.dosenId !== dosen.id) {
      return NextResponse.json(
        { success: false, message: "Anda bukan pembimbing utama." },
        { status: 403 }
      )
    }

    if (pengajuan.fase !== "BAB_1_3") {
      return NextResponse.json(
        { success: false, message: "Fase tidak valid." },
        { status: 400 }
      )
    }

    if (!allBabsAcc(pengajuan.dokumen, [1, 2, 3])) {
      return NextResponse.json(
        { success: false, message: "Semua bab 1-3 harus ACC terlebih dahulu." },
        { status: 400 }
      )
    }

    const qrCodeUrl = pengajuan.dosen.qrCodeUrl

    if (!qrCodeUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "QR Code pembimbing utama belum diupload oleh admin.",
        },
        { status: 400 }
      )
    }

    if (pengajuan.qrTerkirim) {
      return NextResponse.json({
        success: true,
        message: "QR Code sudah dikirim sebelumnya.",
        qrCodeUrl,
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.pengajuan.update({
        where: { id: params.pengajuanId },
        data: {
          qrTerkirim: true,
          qrTerkirimAt: new Date(),
          fase: "SEMPRO",
        },
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: params.pengajuanId,
          userId: pengajuan.mahasiswa.user.id,
          pesan:
            "✅ Dosen pembimbing telah menyetujui Bab 1-3 Anda. QR Code untuk Sempro dan Turnitin telah dikirimkan. Silakan cek menu Bimbingan.",
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "QR Code berhasil dikirim.",
      qrCodeUrl,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengirim QR Code." },
      { status: 500 }
    )
  }
}
