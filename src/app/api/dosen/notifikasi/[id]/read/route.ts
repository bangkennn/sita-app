import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireDosen()
  if (error || !session) return error

  try {
    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id: params.id },
    })

    if (!notifikasi) {
      return NextResponse.json(
        { success: false, message: "Notifikasi tidak ditemukan." },
        { status: 404 }
      )
    }

    if (notifikasi.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      )
    }

    await prisma.notifikasi.update({
      where: { id: params.id },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      message: "Notifikasi ditandai sebagai dibaca.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui notifikasi." },
      { status: 500 }
    )
  }
}
