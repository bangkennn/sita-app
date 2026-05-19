const TITLE_MAP: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dosen": "Kelola Dosen",
  "/admin/monitoring": "Monitoring Bimbingan",
  "/dosen/dashboard": "Dashboard",
  "/dosen/mahasiswa": "Mahasiswa Bimbingan",
  "/dosen/notifikasi": "Notifikasi",
  "/mahasiswa/dashboard": "Dashboard",
  "/mahasiswa/pengajuan": "Pengajuan Bimbingan",
  "/mahasiswa/bimbingan": "Bimbinganku",
  "/mahasiswa/notifikasi": "Notifikasi",
}

export function getPageTitle(pathname: string): string {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname]

  if (pathname.startsWith("/dosen/mahasiswa/")) return "Detail Bimbingan"
  if (pathname.startsWith("/admin/")) return "Admin"
  if (pathname.startsWith("/dosen/")) return "Portal Dosen"
  if (pathname.startsWith("/mahasiswa/")) return "Portal Mahasiswa"

  return "SiTA"
}
