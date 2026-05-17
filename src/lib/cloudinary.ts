import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadResult {
  url: string
  publicId: string
}

export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  resourceType: "image" | "raw" | "auto" = "auto"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:application/octet-stream;base64,${file.toString("base64")}`,
    {
      folder: `sita/${folder}`,
      resource_type: resourceType,
    }
  )

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function uploadImageBuffer(
  buffer: Buffer,
  mimeType: string,
  folder: string
): Promise<UploadResult> {
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `sita/${folder}`,
    resource_type: "image",
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export { cloudinary }
