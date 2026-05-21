import { mapDosenFile } from "@/lib/dosen/dosen-file"
import type { DokumenItem } from "@/lib/mahasiswa/types"

export function mapDokumenItem(
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
