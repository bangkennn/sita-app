"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, Loader2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { PembimbingSection } from "@/components/mahasiswa/pembimbing-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DosenOption, ParseSkResponse } from "@/lib/mahasiswa/types"

type FormStep = 1 | 2 | 3

export function PengajuanForm() {
  const router = useRouter()
  const [step, setStep] = useState<FormStep>(1)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [parseResult, setParseResult] = useState<ParseSkResponse | null>(null)
  const [dosenList, setDosenList] = useState<DosenOption[]>([])
  const [selectedDosenId, setSelectedDosenId] = useState("")
  const [selectedDosenId2, setSelectedDosenId2] = useState("")
  const [judulSkripsi, setJudulSkripsi] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0]
    if (!selected) return

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.")
      return
    }

    setFile(selected)
    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected))
    } else {
      setPreviewUrl(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    disabled: step !== 1 || isParsing,
  })

  async function loadDosenList() {
    const response = await fetch("/api/mahasiswa/dosen-list")
    const result = (await response.json()) as {
      success: boolean
      data?: DosenOption[]
    }
    if (result.success && result.data) {
      setDosenList(result.data)
    }
  }

  async function handleParseSk() {
    if (!file) {
      toast.error("Pilih file SK terlebih dahulu.")
      return
    }

    setStep(2)
    setIsParsing(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/mahasiswa/parse-sk", {
        method: "POST",
        body: formData,
      })

      const result = (await response.json()) as {
        success: boolean
        data?: ParseSkResponse
        message?: string
      }

      if (!response.ok || !result.success || !result.data) {
        toast.error(result.message ?? "Gagal memproses SK.")
        setStep(1)
        return
      }

      setParseResult(result.data)
      setJudulSkripsi(result.data.judul_skripsi ?? "")
      setSelectedDosenId(result.data.matched_dosen_1?.id ?? "")
      setSelectedDosenId2(result.data.matched_dosen_2?.id ?? "")
      await loadDosenList()
      setStep(3)
    } catch {
      toast.error("Terjadi kesalahan saat memproses SK.")
      setStep(1)
    } finally {
      setIsParsing(false)
    }
  }

  async function handleSubmit() {
    if (!parseResult || !selectedDosenId || !judulSkripsi.trim()) {
      toast.error("Lengkapi Pembimbing I dan judul skripsi.")
      return
    }

    if (selectedDosenId2 && selectedDosenId2 === selectedDosenId) {
      toast.error("Pembimbing I dan Pembimbing II tidak boleh sama.")
      return
    }

    setIsSubmitting(true)

    try {
      const body: {
        dosenId: string
        dosenId2?: string
        judulSkripsi: string
        skFileUrl: string
        skFilePublicId: string
      } = {
        dosenId: selectedDosenId,
        judulSkripsi: judulSkripsi.trim(),
        skFileUrl: parseResult.sk_url,
        skFilePublicId: parseResult.sk_public_id,
      }

      if (selectedDosenId2) {
        body.dosenId2 = selectedDosenId2
      }

      const response = await fetch("/api/mahasiswa/pengajuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = (await response.json()) as {
        success: boolean
        message?: string
      }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? "Gagal mengirim pengajuan.")
        return
      }

      toast.success(result.message ?? "Pengajuan berhasil dikirim.")
      router.refresh()
      router.push("/mahasiswa/pengajuan")
    } catch {
      toast.error("Terjadi kesalahan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <Badge
            key={s}
            variant={step === s ? "default" : step > s ? "secondary" : "outline"}
          >
            Langkah {s}
          </Badge>
        ))}
      </div>

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Langkah 1: Upload SK</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="size-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">
                  Seret & lepas file SK di sini, atau klik untuk memilih
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF atau gambar, maks. 5MB
                </p>
              </div>
            </div>

            {file ? (
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <FileText className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : null}

            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview SK"
                className="mx-auto max-h-64 rounded-lg border object-contain"
              />
            ) : null}

            <Button
              className="w-full"
              disabled={!file || isParsing}
              onClick={() => void handleParseSk()}
            >
              Proses SK
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-center font-medium">
              Sedang membaca SK Anda...
            </p>
            <p className="text-center text-sm text-muted-foreground">
              AI sedang mengekstrak nama dosen pembimbing dan judul skripsi
            </p>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 && parseResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Langkah 3: Konfirmasi Hasil Parsing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PembimbingSection
              title="Pembimbing I"
              parsedName={parseResult.nama_dosen_1}
              matchedDosen={parseResult.matched_dosen_1}
              dosenList={dosenList}
              value={selectedDosenId}
              onChange={setSelectedDosenId}
              excludeId={selectedDosenId2 || undefined}
              disabled={isSubmitting}
            />

            <PembimbingSection
              title="Pembimbing II"
              parsedName={parseResult.nama_dosen_2}
              matchedDosen={parseResult.matched_dosen_2}
              optional
              dosenList={dosenList}
              value={selectedDosenId2}
              onChange={setSelectedDosenId2}
              excludeId={selectedDosenId}
              disabled={isSubmitting}
            />

            <div className="space-y-2">
              <Label htmlFor="judul">Judul Skripsi</Label>
              {parseResult.judul_skripsi ? (
                <p className="text-sm text-muted-foreground">
                  Hasil parsing: {parseResult.judul_skripsi}
                </p>
              ) : null}
              <Textarea
                id="judul"
                rows={4}
                value={judulSkripsi}
                onChange={(e) => setJudulSkripsi(e.target.value)}
                placeholder="Masukkan judul skripsi..."
                disabled={isSubmitting}
              />
            </div>

            <Button
              className="w-full"
              disabled={isSubmitting || !selectedDosenId || !judulSkripsi.trim()}
              onClick={() => void handleSubmit()}
            >
              {isSubmitting ? "Mengirim..." : "Submit Pengajuan"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
