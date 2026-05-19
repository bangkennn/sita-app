import { del, put } from "@vercel/blob"

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  folder: string,
  contentType: string
): Promise<{ url: string; pathname: string }> {
  const blob = await put(`${folder}/${Date.now()}-${filename}`, buffer, {
    access: "public",
    contentType,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error("Failed to delete file:", error)
  }
}
