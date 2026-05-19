export function formatPembimbingNames(
  dosen: { nama: string },
  dosen2: { nama: string } | null
): string {
  if (dosen2) {
    return `${dosen.nama} · ${dosen2.nama}`
  }
  return dosen.nama
}

export function formatPembimbingLines(
  dosen: { nama: string },
  dosen2: { nama: string } | null
): { pembimbing1: string; pembimbing2: string | null } {
  return {
    pembimbing1: dosen.nama,
    pembimbing2: dosen2?.nama ?? null,
  }
}
