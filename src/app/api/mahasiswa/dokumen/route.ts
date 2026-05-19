import { NextResponse } from "next/server"

import { mapDosenFile } from "@/lib/dosen/dosen-file"
import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import type { DokumenItem } from "@/lib/mahasiswa/types"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"

const dosenSelect = {
  id: true,
  nama: true,
  nip: true,
  prodi: true,
} as const

function mapDokumenItem(
  dokumen: {
    id: string
    nomorBab: number
    judulBab: string
    fileUrl: string
    filePublicId: string
    status: DokumenItem["status"]
    versi: number
    uploadedAt: Date
    reviewedAt: Date | null
    komentar: {
      id: string
      authorId: string
      isiKomentar: string
      createdAt: Date
    }[]
    dosenFiles: {
      id: string
      dokumenId: string
      dosenId: string
      fileUrl: string
      filePublicId: string
      fileName: string
      fileType: string
      keterangan: string | null
      uploadedAt: Date
    }[]
  }
): DokumenItem {
  return {
    id: dokumen.id,
    nomorBab: dokumen.nomorBab,
    judulBab: dokumen.judulBab,
    fileUrl: dokumen.fileUrl,
    filePublicId: dokumen.filePublicId,
    status: dokumen.status,
    versi: dokumen.versi,
    uploadedAt: dokumen.uploadedAt.toISOString(),
    reviewedAt: dokumen.reviewedAt?.toISOString() ?? null,
    komentar: dokumen.komentar.map((k) => ({
      id: k.id,
      authorId: k.authorId,
      isiKomentar: k.isiKomentar,
      createdAt: k.createdAt.toISOString(),
    })),
    dosenFiles: dokumen.dosenFiles.map(mapDosenFile),
  }
}

export async function GET() {
  const { error, mahasiswa } = await requireMahasiswa()
  if (error || !mahasiswa) return error

  try {
    const pengajuan = await prisma.pengajuan.findUnique({
      where: { mahasiswaId: mahasiswa.id },
      include: {
        dosen: { select: dosenSelect },
        dosen2: { select: dosenSelect },
      },
    })

    if (!pengajuan) {
      return NextResponse.json({ success: true, data: [] })
    }

    const dokumen = await prisma.dokumen.findMany({
      where: { pengajuanId: pengajuan.id },
      include: {
        komentar: {
          orderBy: { createdAt: "asc" },
        },
        dosenFiles: {
          orderBy: { uploadedAt: "desc" },
        },
      },
      orderBy: [{ nomorBab: "asc" }, { versi: "desc" }],
    })

    return NextResponse.json({
      success: true,
      data: dokumen.map(mapDokumenItem),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat dokumen." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error, mahasiswa } = await requireMahasiswa()
  if (error || !mahasiswa) return error

  try {
    const formData = await request.formData()
    const nomorBabStr = formData.get("nomorBab") as string | null
    const judulBab = formData.get("judulBab") as string | null
    const file = formData.get("file") as File | null

    if (!nomorBabStr || !judulBab || !file) {
      return NextResponse.json(
        { success: false, message: "Nomor bab, judul bab, dan file wajib diisi." },
        { status: 400 }
      )
    }

    const nomorBab = parseInt(nomorBabStr, 10)
    if (isNaN(nomorBab) || nomorBab < 1 || nomorBab > 5) {
      return NextResponse.json(
        { success: false, message: "Nomor bab harus antara 1-5." },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 10MB." },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, message: "File harus berformat PDF." },
        { status: 400 }
      )
    }

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { mahasiswaId: mahasiswa.id },
      include: {
        dosen: { include: { user: { select: { id: true } } } },
        dosen2: { include: { user: { select: { id: true } } } },
      },
    })

    if (!pengajuan) {
      return NextResponse.json(
        { success: false, message: "Pengajuan tidak ditemukan." },
        { status: 404 }
      )
    }

    if (pengajuan.status !== "DITERIMA") {
      return NextResponse.json(
        { success: false, message: "Pengajuan belum diterima." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { url, pathname } = await uploadFile(
      buffer,
      file.name,
      "dokumen",
      file.type
    )

    const result = await prisma.$transaction(async (tx) => {
      const existingDokumen = await tx.dokumen.findFirst({
        where: {
          pengajuanId: pengajuan.id,
          nomorBab,
        },
        orderBy: { versi: "desc" },
      })

      const newVersi = existingDokumen ? existingDokumen.versi + 1 : 1

      const dokumen = await tx.dokumen.create({
        data: {
          pengajuanId: pengajuan.id,
          nomorBab,
          judulBab: judulBab.trim(),
          fileUrl: url,
          filePublicId: pathname,
          status: "MENUNGGU_REVIEW",
          versi: newVersi,
        },
        include: {
          komentar: true,
          dosenFiles: { orderBy: { uploadedAt: "desc" } },
        },
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: pengajuan.id,
          userId: pengajuan.dosen.user.id,
          pesan: `${mahasiswa.nama} mengupload Bab ${nomorBab}: "${judulBab}" (Versi ${newVersi})`,
        },
      })

      if (pengajuan.dosen2) {
        await tx.notifikasi.create({
          data: {
            pengajuanId: pengajuan.id,
            userId: pengajuan.dosen2.user.id,
            pesan: `${mahasiswa.nama} mengupload Bab ${nomorBab}: "${judulBab}" (Versi ${newVersi})`,
          },
        })
      }

      return dokumen
    })

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil diupload.",
      data: mapDokumenItem(result),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengupload dokumen." },
      { status: 500 }
    )
  }
}
