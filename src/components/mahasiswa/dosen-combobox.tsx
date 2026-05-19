"use client"

import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DosenOption } from "@/lib/mahasiswa/types"
import { cn } from "@/lib/utils"

interface DosenComboboxProps {
  dosenList: DosenOption[]
  value: string
  onChange: (dosenId: string) => void
  label: string
  excludeId?: string
  disabled?: boolean
}

export function DosenCombobox({
  dosenList,
  value,
  onChange,
  label,
  excludeId,
  disabled,
}: DosenComboboxProps) {
  const [search, setSearch] = useState("")
  const inputId = `dosen-search-${label.replace(/\s+/g, "-").toLowerCase()}`

  const selected = dosenList.find((d) => d.id === value)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return dosenList.filter((d) => {
      if (excludeId && d.id === excludeId) return false
      if (!query) return true
      return (
        d.nama.toLowerCase().includes(query) ||
        d.nip.toLowerCase().includes(query) ||
        d.prodi.toLowerCase().includes(query)
      )
    })
  }, [dosenList, search, excludeId])

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        placeholder="Cari nama, NIP, atau prodi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={disabled}
      />
      {selected ? (
        <p className="text-xs text-muted-foreground">
          Terpilih: {selected.nama} — {selected.nip}
        </p>
      ) : null}
      <ul
        className={cn(
          "max-h-48 overflow-y-auto rounded-lg border bg-background",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {filtered.length === 0 ? (
          <li className="px-3 py-4 text-center text-sm text-muted-foreground">
            Dosen tidak ditemukan
          </li>
        ) : (
          filtered.map((dosen) => (
            <li key={dosen.id}>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                  value === dosen.id && "bg-primary/10 font-medium"
                )}
                onClick={() => onChange(dosen.id)}
                disabled={disabled}
              >
                <span className="block font-medium">{dosen.nama}</span>
                <span className="text-xs text-muted-foreground">
                  {dosen.nip} · {dosen.prodi}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
