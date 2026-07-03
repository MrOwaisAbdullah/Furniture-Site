import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

// ── Presigned upload URL ───────────────────────────────────────────────────────

export async function createPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    ContentType: contentType,
  })
  return getSignedUrl(r2, command, { expiresIn: 60 * 15 }) // 15-min TTL
}

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`
}

// ── Path helpers ──────────────────────────────────────────────────────────────

export function paymentScreenshotKey(orderRef: string, ext: string): string {
  return `payments/${orderRef}.${ext}`
}

export function productImageKey(productSlug: string, index: number, ext: string): string {
  return `products/${productSlug}/${index}.${ext}`
}
