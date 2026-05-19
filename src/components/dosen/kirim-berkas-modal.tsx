"use client"

import { Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDosenFileValidationError } from "@/lib/dosen/dosen-file"

interface KirimBerkasModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dokumenId: string
  onSuccess: () => void
}

export function KirimBerkasModal({
  open,
  onOpenChange,
  dokumenId,
  onSuccess,
}: KirimBerkasModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [keterangan, setKeterangan] = useState("")
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    const picked = accepted[0]
    if (!picked) return

    const validationError = getDosenFileValidationError(picked)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setFile(picked)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  function resetForm() {
    setFile(null)
    setKeterangan("")
  }

  function handleClose(nextOpen: boolean) {
    if (!uploading) {
      onOpenChange(nextOpen)
      if (!nextOpen) resetForm()
    }
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Pilih file terlebih dahulu")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (keterangan.trim()) {
        formData.append("keterangan", keterangan.trim())
      }

      const res = await fetch(`/api/dosen/dokumen/${dokumenId}/upload-file`, {
        method: "POST",
        body: formData,
      })

      const result = await res.json()
      if (result.success) {
        toast.success("Berkas berhasil dikirim")
        resetForm()
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal mengirim berkas")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim Berkas ke Mahasiswa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/30 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Lepaskan file di sini"
                : "Seret file atau klik untuk memilih"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, DOC, DOCX, JPG, PNG — maks. 10MB
            </p>
          </div>

          {file ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">File dipilih:</span> {file.name}
            </p>
          ) : null}

          <div>
            <Label htmlFor="keterangan-berkas">Keterangan (opsional)</Label>
            <Input
              id="keterangan-berkas"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Dokumen dengan catatan revisi"
              disabled={uploading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={uploading}
          >
            Batal
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={uploading || !file}>
            {uploading ? "Mengirim..." : "Kirim Berkas"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
