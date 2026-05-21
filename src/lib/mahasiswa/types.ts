import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

export interface MahasiswaProfile {
  id: string
  nama: string
  nim: string
  prodi: string
  angkatan: number
}

export interface DosenOption {
  id: string
  nama: string
  nip: string
  prodi: string
}

export interface MatchedDosen extends DosenOption {}

export interface ParseSkResponse {
  nama_dosen_1: string | null
  nama_dosen_2: string | null
  matched_dosen_1: MatchedDosen | null
  matched_dosen_2: MatchedDosen | null
  judul_skripsi: string | null
  sk_url: string
  sk_public_id: string
}

export interface PengajuanDetail {
  id: string
  judulSkripsi: string
  status: StatusPengajuan
  fase: FaseBimbingan
  skFileUrl: string
  qrTerkirim: boolean
  qrTerkirimAt: string | null
  qrCodeUrl: string | null
  formulirUrl: string | null
  tanggalSelesai: string | null
  catatanDosen: string | null
  createdAt: string
  dosen: DosenOption
  dosen2: DosenOption | null
  dokumen: DokumenItem[]
}

export interface NotifikasiItem {
  id: string
  pesan: string
  isRead: boolean
  createdAt: string
}

export interface DosenFileItem {
  id: string
  dokumenId: string
  dosenId: string
  fileUrl: string
  filePublicId: string
  fileName: string
  fileType: string
  keterangan: string | null
  uploadedAt: string
}

export interface DokumenItem {
  id: string
  nomorBab: number
  judulBab: string
  fileUrl: string
  filePublicId: string
  status: StatusBab
  versi: number
  uploadedAt: string
  reviewedAt: string | null
  komentar: KomentarItem[]
  dosenFiles: DosenFileItem[]
}

export interface KomentarItem {
  id: string
  authorId: string
  isiKomentar: string
  createdAt: string
}
