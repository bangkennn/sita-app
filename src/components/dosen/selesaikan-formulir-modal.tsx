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
import { Textarea } from "@/components/ui/textarea"
import { getDosenFileValidationError } from "@/lib/dosen/dosen-file"

interface SelesaikanFormulirModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pengajuanId: string
  onSuccess: () => void
}

export function SelesaikanFormulirModal({
  open,
  onOpenChange,
  pengajuanId,
  onSuccess,
}: SelesaikanFormulirModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [pesan, setPesan] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  function resetForm() {
    setFile(null)
    setPesan("")
  }

  function handleClose(nextOpen: boolean) {
    if (!submitting) {
      onOpenChange(nextOpen)
      if (!nextOpen) resetForm()
    }
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Pilih file formulir terlebih dahulu")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (pesan.trim()) formData.append("pesan", pesan.trim())

      const res = await fetch(`/api/dosen/selesaikan/${pengajuanId}`, {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      if (result.success) {
        toast.success("Formulir berhasil dikirim! Bimbingan telah diselesaikan.", {
          className: "bg-emerald-600 text-white border-emerald-700",
        })
        resetForm()
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal mengirim formulir")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim Formulir Bimbingan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-emerald-500 bg-emerald-50"
                : "border-muted-foreground/30 hover:border-emerald-500/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Upload Formulir Bimbingan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, Word, atau gambar — maks. 10MB
            </p>
          </div>

          {file && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">File dipilih:</span> {file.name}
            </p>
          )}

          <div>
            <p className="mb-2 text-xs text-muted-foreground">
              Pesan untuk mahasiswa (opsional)
            </p>
            <Textarea
              placeholder="Contoh: Formulir bimbingan terlampir, silakan simpan sebagai arsip."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleSubmit}
            disabled={submitting || !file}
          >
            {submitting ? "Mengirim..." : "Kirim Formulir & Selesaikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
