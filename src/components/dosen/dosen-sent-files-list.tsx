"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ChevronDown, ChevronRight, Download, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getFileTypeIcon } from "@/lib/dosen/dosen-file"
import type { DosenFileItem } from "@/lib/dosen/types"

interface DosenSentFilesListProps {
  files: DosenFileItem[]
  onUpdated: () => void
}

export function DosenSentFilesList({ files, onUpdated }: DosenSentFilesListProps) {
  const [expanded, setExpanded] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (files.length === 0) {
    return null
  }

  async function handleDelete(fileId: string) {
    setDeletingId(fileId)
    try {
      const res = await fetch(`/api/dosen/files/${fileId}`, {
        method: "DELETE",
      })

      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        onUpdated()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal menghapus berkas")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>📎 Berkas Dikirim ({files.length})</span>
        {expanded ? (
          <ChevronDown className="size-4 shrink-0" />
        ) : (
          <ChevronRight className="size-4 shrink-0" />
        )}
      </button>

      {expanded ? (
        <ul className="space-y-2 border-t px-3 py-2">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-md bg-background p-2 sm:flex-row sm:items-center sm:justify-between"
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
                  {format(new Date(item.uploadedAt), "dd MMM yyyy HH:mm", {
                    locale: localeId,
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button size="sm" variant="outline" type="button">
                      <Download className="mr-1 size-4" />
                      Download
                    </Button>
                  </a>
                <Button
                  size="sm"
                  variant="destructive"
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
