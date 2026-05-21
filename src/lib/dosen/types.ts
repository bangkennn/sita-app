import type { FaseBimbingan, StatusBab, StatusPengajuan } from "@prisma/client"

export interface DosenProfile {
  id: string
  nama: string
  nip: string
  prodi: string
}

export interface MahasiswaInfo {
  id: string
  nama: string
  nim: string
  prodi: string
  angkatan: number
}

export interface PengajuanWithRelations {
  id: string
  judulSkripsi: string
  status: StatusPengajuan
  fase: FaseBimbingan
  qrTerkirim: boolean
  qrTerkirimAt: string | null
  formulirUrl: string | null
  tanggalSelesai: string | null
  catatanDosen: string | null
  createdAt: string
  mahasiswa: MahasiswaInfo
  dosen: DosenProfile
  dosen2: DosenProfile | null
  dokumen: DokumenItem[]
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

export interface NotifikasiItem {
  id: string
  pesan: string
  isRead: boolean
  createdAt: string
}
