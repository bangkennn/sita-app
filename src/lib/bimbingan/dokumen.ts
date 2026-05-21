import type { StatusBab } from "@prisma/client"

export interface DokumenLike {
  nomorBab: number
  versi: number
  status: StatusBab
}

export function getLatestDokumenPerBab<T extends DokumenLike>(
  dokumen: T[],
  babNumbers: number[]
): Map<number, T> {
  const map = new Map<number, T>()
  for (const n of babNumbers) {
    const forBab = dokumen.filter((d) => d.nomorBab === n)
    if (forBab.length === 0) continue
    const latest = forBab.reduce((a, b) => (a.versi >= b.versi ? a : b))
    map.set(n, latest)
  }
  return map
}

export function countAccForBabs(
  dokumen: DokumenLike[],
  babNumbers: number[]
): number {
  const latest = getLatestDokumenPerBab(dokumen, babNumbers)
  return babNumbers.filter((n) => latest.get(n)?.status === "ACC").length
}

export function allBabsAcc(dokumen: DokumenLike[], babNumbers: number[]): boolean {
  return babNumbers.every((n) => {
    const latest = getLatestDokumenPerBab(dokumen, babNumbers).get(n)
    return latest?.status === "ACC"
  })
}

export function getProgressForFase(
  fase: string,
  dokumen: DokumenLike[]
): { current: number; total: number } {
  if (fase === "BAB_4_5" || fase === "SELESAI") {
    return { current: countAccForBabs(dokumen, [4, 5]), total: 2 }
  }
  return { current: countAccForBabs(dokumen, [1, 2, 3]), total: 3 }
}
