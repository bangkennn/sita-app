import { NextResponse } from "next/server"

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

    const bab123 = pengajuan.dokumen.filter((d) => [1, 2, 3].includes(d.nomorBab))
    const allAcc = bab123.every((d) => d.status === "ACC")

    if (!allAcc) {
      return NextResponse.json(
        { success: false, message: "Semua bab 1-3 harus ACC terlebih dahulu." },
        { status: 400 }
      )
    }

    if (!dosen.qrCodeUrl) {
      return NextResponse.json(
        { success: false, message: "QR Code Anda belum diupload." },
        { status: 400 }
      )
    }

    if (pengajuan.qrTerkirim) {
      return NextResponse.json({
        success: true,
        message: "QR Code sudah dikirim sebelumnya.",
        qrCodeUrl: dosen.qrCodeUrl,
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
          pesan: `QR Code untuk Seminar Proposal telah dikirim oleh ${dosen.nama}`,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "QR Code berhasil dikirim.",
      qrCodeUrl: dosen.qrCodeUrl,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengirim QR Code." },
      { status: 500 }
    )
  }
}
