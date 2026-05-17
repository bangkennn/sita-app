import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

const SALT_ROUNDS = 12

interface UpdateDosenBody {
  email?: string
  password?: string
  nama?: string
  nip?: string
  prodi?: string
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireRole("ADMIN")
  if (error) return error

  const { id } = await context.params

  try {
    const body = (await request.json()) as UpdateDosenBody

    const dosen = await prisma.dosen.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!dosen) {
      return NextResponse.json(
        { success: false, message: "Dosen tidak ditemukan." },
        { status: 404 }
      )
    }

    const nama = body.nama?.trim()
    const nip = body.nip?.trim()
    const prodi = body.prodi?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (nip && nip !== dosen.nip) {
      const existingNip = await prisma.dosen.findUnique({ where: { nip } })
      if (existingNip) {
        return NextResponse.json(
          { success: false, message: "NIP sudah terdaftar." },
          { status: 409 }
        )
      }
    }

    if (email && email !== dosen.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email sudah terdaftar." },
          { status: 409 }
        )
      }
    }

    if (password && password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password minimal 8 karakter." },
        { status: 400 }
      )
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (email || password) {
        await tx.user.update({
          where: { id: dosen.userId },
          data: {
            ...(email ? { email } : {}),
            ...(password ? { password: await hash(password, SALT_ROUNDS) } : {}),
          },
        })
      }

      return tx.dosen.update({
        where: { id },
        data: {
          ...(nama ? { nama } : {}),
          ...(nip ? { nip } : {}),
          ...(prodi ? { prodi } : {}),
        },
        include: {
          user: { select: { email: true } },
          pengajuan: {
            where: { status: "DITERIMA", fase: { not: "SELESAI" } },
            select: { id: true },
          },
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Data dosen berhasil diperbarui.",
      data: {
        id: updated.id,
        nama: updated.nama,
        nip: updated.nip,
        prodi: updated.prodi,
        email: updated.user.email,
        isActive: updated.isActive,
        qrCodeUrl: updated.qrCodeUrl,
        mahasiswaAktifCount: updated.pengajuan.length,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data dosen." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireRole("ADMIN")
  if (error) return error

  const { id } = await context.params

  try {
    const dosen = await prisma.dosen.findUnique({ where: { id } })

    if (!dosen) {
      return NextResponse.json(
        { success: false, message: "Dosen tidak ditemukan." },
        { status: 404 }
      )
    }

    await prisma.dosen.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: "Dosen berhasil dinonaktifkan.",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menonaktifkan dosen." },
      { status: 500 }
    )
  }
}
