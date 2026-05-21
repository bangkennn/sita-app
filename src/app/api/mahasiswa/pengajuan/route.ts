import { NextResponse } from "next/server"

import { requireMahasiswa } from "@/lib/mahasiswa/auth"
import { mapDokumenItem } from "@/lib/mahasiswa/map-dokumen"
import type { PengajuanDetail } from "@/lib/mahasiswa/types"
import { prisma } from "@/lib/prisma"

const dosenSelect = {
  id: true,
  nama: true,
  nip: true,
  prodi: true,
  qrCodeUrl: true,
} as const

interface SubmitPengajuanBody {
  dosenId?: string
  dosenId2?: string
  judulSkripsi?: string
  skFileUrl?: string
  skFilePublicId?: string
}

function mapPengajuanDetail(
  pengajuan: {
    id: string
    judulSkripsi: string
    status: PengajuanDetail["status"]
    fase: PengajuanDetail["fase"]
    skFileUrl: string
    qrTerkirim: boolean
    qrTerkirimAt: Date | null
    formulirUrl: string | null
    tanggalSelesai: Date | null
    catatanDosen: string | null
    createdAt: Date
    dosen: PengajuanDetail["dosen"] & { qrCodeUrl: string | null }
    dosen2: PengajuanDetail["dosen2"]
    dokumen: Parameters<typeof mapDokumenItem>[0][]
  }
): PengajuanDetail {
  return {
    id: pengajuan.id,
    judulSkripsi: pengajuan.judulSkripsi,
    status: pengajuan.status,
    fase: pengajuan.fase,
    skFileUrl: pengajuan.skFileUrl,
    qrTerkirim: pengajuan.qrTerkirim,
    qrTerkirimAt: pengajuan.qrTerkirimAt?.toISOString() ?? null,
    qrCodeUrl: pengajuan.dosen.qrCodeUrl,
    formulirUrl: pengajuan.formulirUrl,
    tanggalSelesai: pengajuan.tanggalSelesai?.toISOString() ?? null,
    catatanDosen: pengajuan.catatanDosen,
    createdAt: pengajuan.createdAt.toISOString(),
    dosen: {
      id: pengajuan.dosen.id,
      nama: pengajuan.dosen.nama,
      nip: pengajuan.dosen.nip,
      prodi: pengajuan.dosen.prodi,
    },
    dosen2: pengajuan.dosen2,
    dokumen: pengajuan.dokumen.map(mapDokumenItem),
  }
}

const pengajuanInclude = {
  dosen: { select: dosenSelect },
  dosen2: { select: { id: true, nama: true, nip: true, prodi: true } },
  dokumen: {
    include: {
      komentar: { orderBy: { createdAt: "asc" as const } },
      dosenFiles: { orderBy: { uploadedAt: "desc" as const } },
    },
    orderBy: [{ nomorBab: "asc" as const }, { versi: "desc" as const }],
  },
}

export async function GET() {
  const { error, mahasiswa } = await requireMahasiswa()
  if (error || !mahasiswa) return error

  try {
    const pengajuan = await prisma.pengajuan.findUnique({
      where: { mahasiswaId: mahasiswa.id },
      include: pengajuanInclude,
    })

    if (!pengajuan) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({
      success: true,
      data: mapPengajuanDetail(pengajuan),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat pengajuan." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error, mahasiswa } = await requireMahasiswa()
  if (error || !mahasiswa) return error

  try {
    const body = (await request.json()) as SubmitPengajuanBody

    const dosenId = body.dosenId
    const dosenId2 = body.dosenId2 || undefined
    const judulSkripsi = body.judulSkripsi?.trim()
    const skFileUrl = body.skFileUrl
    const skFilePublicId = body.skFilePublicId

    if (!dosenId || !judulSkripsi || !skFileUrl || !skFilePublicId) {
      return NextResponse.json(
        { success: false, message: "Pembimbing I dan judul skripsi wajib diisi." },
        { status: 400 }
      )
    }

    if (dosenId2 && dosenId2 === dosenId) {
      return NextResponse.json(
        {
          success: false,
          message: "Pembimbing I dan Pembimbing II tidak boleh sama.",
        },
        { status: 400 }
      )
    }

    const existing = await prisma.pengajuan.findUnique({
      where: { mahasiswaId: mahasiswa.id },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda sudah memiliki pengajuan bimbingan.",
        },
        { status: 409 }
      )
    }

    const dosen = await prisma.dosen.findFirst({
      where: { id: dosenId, isActive: true },
      include: { user: { select: { id: true } } },
    })

    if (!dosen) {
      return NextResponse.json(
        { success: false, message: "Dosen Pembimbing I tidak ditemukan." },
        { status: 404 }
      )
    }

    let dosen2: { id: string; user: { id: string } } | null = null

    if (dosenId2) {
      dosen2 = await prisma.dosen.findFirst({
        where: { id: dosenId2, isActive: true },
        include: { user: { select: { id: true } } },
      })

      if (!dosen2) {
        return NextResponse.json(
          { success: false, message: "Dosen Pembimbing II tidak ditemukan." },
          { status: 404 }
        )
      }
    }

    const pengajuan = await prisma.$transaction(async (tx) => {
      const created = await tx.pengajuan.create({
        data: {
          mahasiswaId: mahasiswa.id,
          dosenId: dosen.id,
          dosenId2: dosen2?.id ?? null,
          judulSkripsi,
          skFileUrl,
          skFilePublicId,
          status: "MENUNGGU",
        },
        include: pengajuanInclude,
      })

      await tx.notifikasi.create({
        data: {
          pengajuanId: created.id,
          userId: dosen.user.id,
          pesan: `${mahasiswa.nama} (${mahasiswa.nim}) mengajukan bimbingan: "${judulSkripsi}"`,
        },
      })

      if (dosen2) {
        await tx.notifikasi.create({
          data: {
            pengajuanId: created.id,
            userId: dosen2.user.id,
            pesan: `${mahasiswa.nama} (${mahasiswa.nim}) mengajukan bimbingan (Pembimbing II): "${judulSkripsi}"`,
          },
        })
      }

      return created
    })

    return NextResponse.json({
      success: true,
      message: "Pengajuan berhasil dikirim.",
      data: mapPengajuanDetail(pengajuan),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengirim pengajuan." },
      { status: 500 }
    )
  }
}
