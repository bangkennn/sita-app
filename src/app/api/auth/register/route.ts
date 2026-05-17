import { hash } from "bcryptjs"
import { Prisma } from "@prisma/client"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

const SALT_ROUNDS = 12

interface RegisterBody {
  email?: string
  password?: string
  nama?: string
  nim?: string
  prodi?: string
  angkatan?: number | string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody

    const email = body.email?.trim().toLowerCase()
    const password = body.password
    const nama = body.nama?.trim()
    const nim = body.nim?.trim()
    const prodi = body.prodi?.trim()
    const angkatan =
      typeof body.angkatan === "string"
        ? parseInt(body.angkatan, 10)
        : body.angkatan

    if (
      !email ||
      !password ||
      !nama ||
      !nim ||
      !prodi ||
      angkatan === undefined ||
      angkatan === null
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      )
    }

    if (!Number.isInteger(angkatan) || angkatan < 2000 || angkatan > 2100) {
      return NextResponse.json(
        { success: false, message: "Angkatan tidak valid." },
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

    const existingNim = await prisma.mahasiswa.findUnique({ where: { nim } })
    if (existingNim) {
      return NextResponse.json(
        { success: false, message: "NIM sudah terdaftar." },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, SALT_ROUNDS)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.MAHASISWA,
        },
      })

      await tx.mahasiswa.create({
        data: {
          userId: user.id,
          nama,
          nim,
          prodi,
          angkatan,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil. Silakan login.",
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target
        const field = Array.isArray(target) ? target[0] : undefined
        if (field === "email") {
          return NextResponse.json(
            { success: false, message: "Email sudah terdaftar." },
            { status: 409 }
          )
        }
        if (field === "nim") {
          return NextResponse.json(
            { success: false, message: "NIM sudah terdaftar." },
            { status: 409 }
          )
        }
      }
    }

    console.error("[register]", error)
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    )
  }
}
