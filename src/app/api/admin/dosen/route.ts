import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

const SALT_ROUNDS = 12

interface CreateDosenBody {
  email?: string
  password?: string
  nama?: string
  nip?: string
  prodi?: string
}

export async function POST(request: Request) {
  const { error } = await requireRole("ADMIN")
  if (error) return error

  try {
    const body = (await request.json()) as CreateDosenBody

    const email = body.email?.trim().toLowerCase()
    const password = body.password
    const nama = body.nama?.trim()
    const nip = body.nip?.trim()
    const prodi = body.prodi?.trim()

    if (!email || !password || !nama || !nip || !prodi) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password minimal 8 karakter." },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 }
      )
    }

    const existingNip = await prisma.dosen.findUnique({ where: { nip } })
    if (existingNip) {
      return NextResponse.json(
        { success: false, message: "NIP sudah terdaftar." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const dosen = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "DOSEN",
        },
      })

      return tx.dosen.create({
        data: {
          userId: user.id,
          nama,
          nip,
          prodi,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Dosen berhasil ditambahkan.",
      data: { id: dosen.id, nama: dosen.nama, nip: dosen.nip },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menambahkan dosen." },
      { status: 500 }
    )
  }
}
