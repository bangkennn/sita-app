"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DosenListItem } from "@/lib/admin/types"

interface DosenFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  dosen?: DosenListItem | null
  onSuccess: () => void
}

interface FormState {
  nama: string
  nip: string
  email: string
  prodi: string
  password: string
}

const emptyForm: FormState = {
  nama: "",
  nip: "",
  email: "",
  prodi: "",
  password: "",
}

export function DosenFormDialog({
  open,
  onOpenChange,
  mode,
  dosen,
  onSuccess,
}: DosenFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && dosen) {
      setForm({
        nama: dosen.nama,
        nip: dosen.nip,
        email: dosen.email,
        prodi: dosen.prodi,
        password: "",
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, mode, dosen])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        const response = await fetch("/api/admin/dosen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const result = (await response.json()) as {
          success: boolean
          message: string
        }

        if (!response.ok || !result.success) {
          toast.error(result.message ?? "Gagal menambahkan dosen.")
          return
        }

        toast.success(result.message)
      } else if (dosen) {
        const payload: Record<string, string> = {
          nama: form.nama,
          nip: form.nip,
          email: form.email,
          prodi: form.prodi,
        }
        if (form.password) {
          payload.password = form.password
        }

        const response = await fetch(`/api/admin/dosen/${dosen.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const result = (await response.json()) as {
          success: boolean
          message: string
        }

        if (!response.ok || !result.success) {
          toast.error(result.message ?? "Gagal memperbarui dosen.")
          return
        }

        toast.success(result.message)
      }

      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error("Terjadi kesalahan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Dosen" : "Edit Dosen"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Buat akun dosen baru untuk sistem SiTA."
              : "Perbarui informasi akun dosen."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              value={form.nama}
              onChange={(e) => updateField("nama", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              value={form.nip}
              onChange={(e) => updateField("nip", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prodi">Program Studi</Label>
            <Input
              id="prodi"
              value={form.prodi}
              onChange={(e) => updateField("prodi", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {mode === "edit" ? "(kosongkan jika tidak diubah)" : ""}
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required={mode === "create"}
              minLength={mode === "create" ? 8 : undefined}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="border-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : mode === "create"
                  ? "Tambah"
                  : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
