import type { FaseBimbingan, StatusPengajuan } from "@prisma/client"

export interface DosenListItem {
  id: string
  nama: string
  nip: string
  prodi: string
  email: string
  isActive: boolean
  qrCodeUrl: string | null
  mahasiswaAktifCount: number
}

export interface DashboardStats {
  totalDosen: number
  totalMahasiswaAktif: number
  totalPengajuanAktif: number
  totalBimbinganSelesai: number
}

export interface RecentPengajuanItem {
  id: string
  judulSkripsi: string
  status: StatusPengajuan
  fase: FaseBimbingan
  createdAt: string
  mahasiswa: { nama: string; nim: string }
  dosen: { nama: string }
  dosen2: { nama: string } | null
}

export interface MonitoringPengajuanItem {
  id: string
  judulSkripsi: string
  fase: FaseBimbingan
  status: StatusPengajuan
  createdAt: string
  mahasiswa: { nama: string; nim: string }
  dosen: { nama: string }
  dosen2: { nama: string } | null
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
}
