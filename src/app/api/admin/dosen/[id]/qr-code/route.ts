import { NextResponse } from "next/server"

import { deleteFromCloudinary, uploadImageBuffer } from "@/lib/cloudinary"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
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

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File gambar wajib diunggah." },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Format file harus berupa gambar (JPEG, PNG, WebP, GIF)." },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 5MB." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const upload = await uploadImageBuffer(buffer, file.type, "qr-codes")

    if (dosen.qrCodePublicId) {
      try {
        await deleteFromCloudinary(dosen.qrCodePublicId)
      } catch {
        // ignore cleanup failure
      }
    }

    const updated = await prisma.dosen.update({
      where: { id },
      data: {
        qrCodeUrl: upload.url,
        qrCodePublicId: upload.publicId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "QR Code berhasil diunggah.",
      data: {
        qrCodeUrl: updated.qrCodeUrl,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengunggah QR Code." },
      { status: 500 }
    )
  }
}
