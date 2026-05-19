import { NextResponse } from "next/server"

import { requireSession } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function PATCH() {
  const { error, session } = await requireSession()
  if (error || !session) return error

  try {
    await prisma.notifikasi.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      message: "Semua notifikasi ditandai sebagai dibaca.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui notifikasi." },
      { status: 500 }
    )
  }
}
