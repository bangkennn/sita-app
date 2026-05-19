import { NextResponse } from "next/server"

import { parseSkDocument } from "@/lib/gemini"
import { findMatchingDosen } from "@/lib/mahasiswa/find-dosen"
import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import { uploadFile } from "@/lib/upload"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

function resolveMimeType(file: File): string | null {
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    return file.type
  }

  const name = file.name.toLowerCase()
  if (name.endsWith(".pdf")) return "application/pdf"
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg"
  if (name.endsWith(".png")) return "image/png"
  if (name.endsWith(".webp")) return "image/webp"
  if (name.endsWith(".gif")) return "image/gif"

  return null
}

function getErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Gagal memproses SK. Pastikan file dapat dibaca."
  }

  const msg = err.message

  if (msg.includes("GEMINI_API_KEY")) {
    return "Konfigurasi Gemini API belum lengkap (GEMINI_API_KEY)."
  }

  if (msg.includes("404 Not Found") && msg.includes("models/")) {
    return "Model Gemini tidak tersedia. Set GEMINI_MODEL=gemini-2.5-flash di .env."
  }

  if (msg.includes("429") || msg.includes("quota")) {
    return "Kuota Gemini API habis. Coba lagi nanti atau periksa billing Google AI."
  }

  if (msg.includes("BLOB_READ_WRITE_TOKEN") || msg.includes("blob")) {
    return "Gagal mengunggah file. Periksa konfigurasi BLOB_READ_WRITE_TOKEN."
  }

  if (err instanceof SyntaxError) {
    return "Gagal membaca hasil parsing SK. Coba unggah ulang dengan file yang lebih jelas."
  }

  return "Gagal memproses SK. Pastikan file dapat dibaca."
}

export async function POST(request: Request) {
  const { error } = await requireMahasiswa()
  if (error) return error

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File SK wajib diunggah." },
        { status: 400 }
      )
    }

    const mimeType = resolveMimeType(file)

    if (!mimeType) {
      return NextResponse.json(
        {
          success: false,
          message: "Format file harus PDF atau gambar (JPEG, PNG, WebP, GIF).",
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 5MB." },
        { status: 400 }
      )
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const [upload, parsed] = await Promise.all([
      uploadFile(fileBuffer, file.name, "sk-files", mimeType),
      parseSkDocument(fileBuffer, mimeType),
    ])

    const [matched_dosen_1, matched_dosen_2] = await Promise.all([
      parsed.nama_dosen_1
        ? findMatchingDosen(parsed.nama_dosen_1)
        : Promise.resolve(null),
      parsed.nama_dosen_2
        ? findMatchingDosen(parsed.nama_dosen_2)
        : Promise.resolve(null),
    ])

    return NextResponse.json({
      success: true,
      data: {
        nama_dosen_1: parsed.nama_dosen_1,
        nama_dosen_2: parsed.nama_dosen_2,
        matched_dosen_1,
        matched_dosen_2,
        judul_skripsi: parsed.judul_skripsi,
        sk_url: upload.url,
        sk_public_id: upload.pathname,
      },
    })
  } catch (err) {
    console.error("[parse-sk]", err)
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(err),
      },
      { status: 500 }
    )
  }
}
