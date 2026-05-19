import { NextResponse } from "next/server"

import { requireSession } from "@/lib/auth-helpers"
import { getNotifikasiForUser } from "@/lib/notifications/queries"

export async function GET(request: Request) {
  const { error, session } = await requireSession()
  if (error || !session) return error

  const { searchParams } = new URL(request.url)
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? parseInt(limitParam, 10) : undefined

  try {
    const data = await getNotifikasiForUser(session.user.id, limit)
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat notifikasi." },
      { status: 500 }
    )
  }
}
