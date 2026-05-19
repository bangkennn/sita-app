import type { DosenFile } from "@prisma/client"

export const DOSEN_FILE_MAX_BYTES = 10 * 1024 * 1024

export const ALLOWED_DOSEN_FILE_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
] as const

export const ALLOWED_DOSEN_FILE_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
] as const

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

export function mapDosenFile(file: DosenFile): DosenFileItem {
  return {
    id: file.id,
    dokumenId: file.dokumenId,
    dosenId: file.dosenId,
    fileUrl: file.fileUrl,
    filePublicId: file.filePublicId,
    fileName: file.fileName,
    fileType: file.fileType,
    keterangan: file.keterangan,
    uploadedAt: file.uploadedAt.toISOString(),
  }
}

export function isAllowedDosenFile(file: File): boolean {
  if (file.size > DOSEN_FILE_MAX_BYTES) {
    return false
  }

  const name = file.name.toLowerCase()
  const hasAllowedExtension = ALLOWED_DOSEN_FILE_EXTENSIONS.some((ext) =>
    name.endsWith(ext)
  )

  if (!hasAllowedExtension) {
    return false
  }

  if (file.type && ALLOWED_DOSEN_FILE_MIME_TYPES.includes(file.type as (typeof ALLOWED_DOSEN_FILE_MIME_TYPES)[number])) {
    return true
  }

  return hasAllowedExtension
}

export function getDosenFileValidationError(file: File): string | null {
  if (file.size > DOSEN_FILE_MAX_BYTES) {
    return "Ukuran file maksimal 10MB."
  }

  const name = file.name.toLowerCase()
  const hasAllowedExtension = ALLOWED_DOSEN_FILE_EXTENSIONS.some((ext) =>
    name.endsWith(ext)
  )

  if (!hasAllowedExtension) {
    return "Format file harus PDF, DOC, DOCX, PNG, atau JPG."
  }

  return null
}

export function getFileTypeIcon(fileType: string, fileName?: string): string {
  const hint = `${fileType} ${fileName ?? ""}`.toLowerCase()
  if (hint.includes("word") || hint.includes("doc")) {
    return "📄"
  }
  if (hint.includes("pdf")) {
    return "📋"
  }
  return "🖼"
}
