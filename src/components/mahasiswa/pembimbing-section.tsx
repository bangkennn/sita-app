"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { DosenCombobox } from "@/components/mahasiswa/dosen-combobox"
import type { DosenOption, MatchedDosen } from "@/lib/mahasiswa/types"

interface PembimbingSectionProps {
  title: string
  parsedName: string | null
  matchedDosen: MatchedDosen | null
  optional?: boolean
  dosenList: DosenOption[]
  value: string
  onChange: (dosenId: string) => void
  excludeId?: string
  disabled?: boolean
}

export function PembimbingSection({
  title,
  parsedName,
  matchedDosen,
  optional = false,
  dosenList,
  value,
  onChange,
  excludeId,
  disabled,
}: PembimbingSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="font-medium">
          {title}
          {optional ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (opsional)
            </span>
          ) : null}
        </h3>
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground">Hasil parsing</Label>
        <p className="font-medium">{parsedName ?? "—"}</p>
        {parsedName ? (
          matchedDosen ? (
            <Badge className="bg-green-600 hover:bg-green-600">
              ✓ Dosen ditemukan: {matchedDosen.nama}
            </Badge>
          ) : (
            <Badge variant="destructive">
              ⚠ Dosen tidak ditemukan — pilih manual
            </Badge>
          )
        ) : optional ? (
          <Badge variant="secondary">Tidak terdeteksi di SK</Badge>
        ) : (
          <Badge variant="destructive">
            ⚠ Tidak terdeteksi — pilih manual
          </Badge>
        )}
      </div>

      <DosenCombobox
        label={`Pilih ${title}`}
        dosenList={dosenList}
        value={value}
        onChange={onChange}
        excludeId={excludeId}
        disabled={disabled}
      />
    </div>
  )
}
