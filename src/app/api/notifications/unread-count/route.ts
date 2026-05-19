import { NextResponse } from "next/server"

import { requireSession } from "@/lib/auth-helpers"
import { getUnreadNotifikasiCount } from "@/lib/notifications/queries"

export async function GET() {
  const { error, session } = await requireSession()
  if (error || !session) return error

  try {
    const count = await getUnreadNotifikasiCount(session.user.id)
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat jumlah notifikasi." },
      { status: 500 }
    )
  }
}
