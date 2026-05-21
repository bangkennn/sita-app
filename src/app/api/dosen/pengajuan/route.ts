import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import { mapDosenFile } from "@/lib/dosen/dosen-file"
import type { PengajuanWithRelations } from "@/lib/dosen/types"
import { prisma } from "@/lib/prisma"

const mahasiswaSelect = {
  id: true,
  nama: true,
  nim: true,
  prodi: true,
  angkatan: true,
} as const

const dosenSelect = {
  id: true,
  nama: true,
  nip: true,
  prodi: true,
} as const

function mapPengajuanWithRelations(
  pengajuan: {
    id: string
    judulSkripsi: string
    status: PengajuanWithRelations["status"]
    fase: PengajuanWithRelations["fase"]
    qrTerkirim: boolean
    qrTerkirimAt: Date | null
    formulirUrl: string | null
    tanggalSelesai: Date | null
    catatanDosen: string | null
    createdAt: Date
    mahasiswa: { id: string; nama: string; nim: string; prodi: string; angkatan: number }
    dosen: { id: string; nama: string; nip: string; prodi: string }
    dosen2: { id: string; nama: string; nip: string; prodi: string } | null
    dokumen: {
      id: string
      nomorBab: number
      judulBab: string
      fileUrl: string
      filePublicId: string
      status: PengajuanWithRelations["dokumen"][0]["status"]
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
    }[]
  }
): PengajuanWithRelations {
  return {
    id: pengajuan.id,
    judulSkripsi: pengajuan.judulSkripsi,
    status: pengajuan.status,
    fase: pengajuan.fase,
    qrTerkirim: pengajuan.qrTerkirim,
    qrTerkirimAt: pengajuan.qrTerkirimAt?.toISOString() ?? null,
    formulirUrl: pengajuan.formulirUrl,
    tanggalSelesai: pengajuan.tanggalSelesai?.toISOString() ?? null,
    catatanDosen: pengajuan.catatanDosen,
    createdAt: pengajuan.createdAt.toISOString(),
    mahasiswa: pengajuan.mahasiswa,
    dosen: pengajuan.dosen,
    dosen2: pengajuan.dosen2,
    dokumen: pengajuan.dokumen.map((d) => ({
      id: d.id,
      nomorBab: d.nomorBab,
      judulBab: d.judulBab,
      fileUrl: d.fileUrl,
      filePublicId: d.filePublicId,
      status: d.status,
      versi: d.versi,
      uploadedAt: d.uploadedAt.toISOString(),
      reviewedAt: d.reviewedAt?.toISOString() ?? null,
      komentar: d.komentar.map((k) => ({
        id: k.id,
        authorId: k.authorId,
        isiKomentar: k.isiKomentar,
        createdAt: k.createdAt.toISOString(),
      })),
      dosenFiles: d.dosenFiles.map(mapDosenFile),
    })),
  }
}

export async function GET() {
  const { error, dosen } = await requireDosen()
  if (error || !dosen) return error

  try {
    const pengajuan = await prisma.pengajuan.findMany({
      where: {
        OR: [{ dosenId: dosen.id }, { dosenId2: dosen.id }],
      },
      include: {
        mahasiswa: { select: mahasiswaSelect },
        dosen: { select: dosenSelect },
        dosen2: { select: dosenSelect },
        dokumen: {
          include: {
            komentar: {
              orderBy: { createdAt: "asc" },
            },
            dosenFiles: {
              orderBy: { uploadedAt: "desc" },
            },
          },
          orderBy: [{ nomorBab: "asc" }, { versi: "desc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: pengajuan.map(mapPengajuanWithRelations),
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat pengajuan." },
      { status: 500 }
    )
  }
}
