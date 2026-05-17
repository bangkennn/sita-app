import { hash } from "bcryptjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

import type { DosenListItem } from "@/lib/admin/types"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

const SALT_ROUNDS = 12

const pengajuanAktifWhere = {
  status: "DITERIMA" as const,
  fase: { not: "SELESAI" as const },
}

interface CreateDosenBody {
  email?: string
  password?: string
  nama?: string
  nip?: string
  prodi?: string
}

export async function GET() {
  const { error } = await requireRole("ADMIN")
  if (error) return error

  try {
    const dosenList = await prisma.dosen.findMany({
      orderBy: { nama: "asc" },
      include: {
        user: { select: { email: true } },
        pengajuan: {
          where: pengajuanAktifWhere,
          select: { id: true },
        },
      },
    })

    const data: DosenListItem[] = dosenList.map((dosen) => ({
      id: dosen.id,
      nama: dosen.nama,
      nip: dosen.nip,
      prodi: dosen.prodi,
      email: dosen.user.email,
      isActive: dosen.isActive,
      qrCodeUrl: dosen.qrCodeUrl,
      mahasiswaAktifCount: dosen.pengajuan.length,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat data dosen." },
      { status: 500 }
    )
  }
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

    const hashedPassword = await hash(password, SALT_ROUNDS)

    const dosen = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.DOSEN,
        },
      })

      return tx.dosen.create({
        data: {
          userId: user.id,
          nama,
          nip,
          prodi,
        },
        include: {
          user: { select: { email: true } },
        },
      })
    })

    const data: DosenListItem = {
      id: dosen.id,
      nama: dosen.nama,
      nip: dosen.nip,
      prodi: dosen.prodi,
      email: dosen.user.email,
      isActive: dosen.isActive,
      qrCodeUrl: dosen.qrCodeUrl,
      mahasiswaAktifCount: 0,
    }

    return NextResponse.json({
      success: true,
      message: "Dosen berhasil ditambahkan.",
      data,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menambahkan dosen." },
      { status: 500 }
    )
  }
}
