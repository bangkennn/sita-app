import { GoogleGenerativeAI } from "@google/generative-ai"

const SK_PARSE_PROMPT = `Extract from this Indonesian SK document:
1. nama_dosen_1: Full name of Pembimbing I (first supervisor)
2. nama_dosen_2: Full name of Pembimbing II (second supervisor)
3. judul_skripsi: Full title of the thesis
Return ONLY valid JSON:
{"nama_dosen_1": "...", "nama_dosen_2": "...", "judul_skripsi": "..."}`

export interface SkParseResult {
  nama_dosen_1: string | null
  nama_dosen_2: string | null
  judul_skripsi: string | null
}

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }
  return apiKey
}

function getModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash"
}

function parseStringField(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export function cleanGeminiJsonResponse(raw: string): string {
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim()
}

export function parseSkJson(text: string): SkParseResult {
  const clean = cleanGeminiJsonResponse(text)
  const parsed = JSON.parse(clean) as {
    nama_dosen_1?: unknown
    nama_dosen_2?: unknown
    judul_skripsi?: unknown
    nama_dosen?: unknown
  }

  return {
    nama_dosen_1:
      parseStringField(parsed.nama_dosen_1) ??
      parseStringField(parsed.nama_dosen),
    nama_dosen_2: parseStringField(parsed.nama_dosen_2),
    judul_skripsi: parseStringField(parsed.judul_skripsi),
  }
}

export async function parseSkDocument(
  buffer: Buffer,
  mimeType: string
): Promise<SkParseResult> {
  const genAI = new GoogleGenerativeAI(getApiKey())
  const model = genAI.getGenerativeModel({ model: getModelName() })

  const base64Data = buffer.toString("base64")

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    },
    { text: SK_PARSE_PROMPT },
  ])

  const text = result.response.text()
  return parseSkJson(text)
}
