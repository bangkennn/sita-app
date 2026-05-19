import { NextResponse } from "next/server"

import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import { getRecentNotifikasi, getUnreadNotifikasiCount } from "@/lib/mahasiswa/queries"

export async function GET(request: Request) {
  const { error, session } = await requireMahasiswa()
  if (error || !session) return error

  const { searchParams } = new URL(request.url)
  const countOnly = searchParams.get("countOnly") === "true"

  try {
    if (countOnly) {
      const count = await getUnreadNotifikasiCount(session.user.id)
      return NextResponse.json({ success: true, data: { count } })
    }

    const limit = parseInt(searchParams.get("limit") ?? "10", 10)
    const data = await getRecentNotifikasi(session.user.id, limit)

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat notifikasi." },
      { status: 500 }
    )
  }
}
