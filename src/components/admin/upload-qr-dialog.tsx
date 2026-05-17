"use client"

import Image from "next/image"
import { Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface UploadQrDialogProps {
  dosenId: string | null
  dosenNama: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadQrDialog({
  dosenId,
  dosenNama,
  open,
  onOpenChange,
  onSuccess,
}: UploadQrDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  useEffect(() => {
    if (!open) {
      setFile(null)
      setPreview(null)
    }
  }, [open])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.")
      return
    }

    setFile(selected)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!dosenId || !file) {
      toast.error("Pilih file gambar QR terlebih dahulu.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/admin/dosen/${dosenId}/qr-code`, {
        method: "PATCH",
        body: formData,
      })

      const result = (await response.json()) as {
        success: boolean
        message: string
      }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? "Gagal mengunggah QR Code.")
        return
      }

      toast.success(result.message)
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload QR Code</DialogTitle>
          <DialogDescription>
            Unggah gambar QR Code untuk {dosenNama}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-file">File gambar</Label>
            <input
              ref={inputRef}
              id="qr-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="size-4" />
              Pilih gambar
            </Button>
            {file ? (
              <p className="text-xs text-muted-foreground">{file.name}</p>
            ) : null}
          </div>

          {preview ? (
            <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={preview}
                alt="Preview QR Code"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full max-w-[240px] items-center justify-center rounded-lg border border-dashed bg-muted/50 text-sm text-muted-foreground">
              Preview akan muncul di sini
            </div>
          )}

          <DialogFooter className="border-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Mengunggah..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
