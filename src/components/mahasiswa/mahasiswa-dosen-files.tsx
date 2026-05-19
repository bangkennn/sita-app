"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ChevronDown, ChevronRight, Download } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { getFileTypeIcon } from "@/lib/dosen/dosen-file"
import type { DosenFileItem } from "@/lib/mahasiswa/types"

interface MahasiswaDosenFilesProps {
  files: DosenFileItem[]
}

export function MahasiswaDosenFiles({ files }: MahasiswaDosenFilesProps) {
  const [expanded, setExpanded] = useState(true)

  if (files.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>📎 Berkas dari Dosen ({files.length})</span>
        {expanded ? (
          <ChevronDown className="size-4 shrink-0" />
        ) : (
          <ChevronRight className="size-4 shrink-0" />
        )}
      </button>

      {expanded ? (
        <ul className="space-y-2 border-t border-primary/10 px-3 py-2">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-md bg-background/80 p-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  <span className="mr-1.5">
                    {getFileTypeIcon(item.fileType, item.fileName)}
                  </span>
                  {item.fileName}
                </p>
                {item.keterangan ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.keterangan}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Dikirim{" "}
                  {format(new Date(item.uploadedAt), "dd MMM yyyy HH:mm", {
                    locale: localeId,
                  })}
                </p>
              </div>
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full shrink-0 sm:w-auto"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  type="button"
                >
                  <Download className="mr-1 size-4" />
                  Download
                </Button>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
