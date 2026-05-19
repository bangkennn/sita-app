export interface NotifikasiPengajuanInfo {
  id: string
  judulSkripsi: string
  mahasiswa: {
    nama: string
    nim: string
  } | null
}

export interface NotifikasiItem {
  id: string
  pesan: string
  isRead: boolean
  createdAt: string
  pengajuan: NotifikasiPengajuanInfo
}
