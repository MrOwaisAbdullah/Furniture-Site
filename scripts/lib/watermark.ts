/**
 * Stamps the Yousuf Living logo, centered and low-opacity, onto product
 * photos before they're uploaded to Sanity — centered (not cornered) so it
 * can't be cropped out of a lifted photo.
 *
 * The source logo file is a flat forest-green square (no alpha channel) —
 * getTransparentLogo() keys out that exact background color to build a
 * transparent cutout once, cached on disk since it's the same every run.
 */
import sharp from "sharp"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"

const LOGO_SRC = "/mnt/d/Furniture/Yousuf Living - Logo.png"
const BG_COLOR = { r: 22, g: 53, b: 42 } // the logo file's flat forest-green background
const BG_TOLERANCE = 40 // euclidean RGB distance under which a pixel counts as background
const WATERMARK_OPACITY = 0.45
const WATERMARK_WIDTH_RATIO = 0.4 // watermark width as a fraction of the target image's width

const CACHED_CUTOUT = join(process.cwd(), "scripts", ".cache", "watermark-cutout.png")

async function getTransparentLogo(): Promise<Buffer> {
  if (existsSync(CACHED_CUTOUT)) return readFileSync(CACHED_CUTOUT)

  const { data, info } = await sharp(LOGO_SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  for (let i = 0; i < data.length; i += channels) {
    const dr = data[i] - BG_COLOR.r
    const dg = data[i + 1] - BG_COLOR.g
    const db = data[i + 2] - BG_COLOR.b
    const dist = Math.sqrt(dr * dr + dg * dg + db * db)
    if (dist < BG_TOLERANCE) data[i + 3] = 0
  }

  const cutout = await sharp(data, { raw: { width, height, channels } }).png().toBuffer()
  mkdirSync(dirname(CACHED_CUTOUT), { recursive: true })
  writeFileSync(CACHED_CUTOUT, cutout)
  return cutout
}

/** Returns a copy of `imageBuffer` with the low-opacity logo composited
 * centered on top. Safe to call on any raster image sharp can decode. */
export async function watermarkImage(imageBuffer: Buffer): Promise<Buffer> {
  const base = sharp(imageBuffer)
  const meta = await base.metadata()
  const targetWidth = Math.round((meta.width ?? 1200) * WATERMARK_WIDTH_RATIO)

  const cutout = await getTransparentLogo()
  const resized = await sharp(cutout).resize({ width: targetWidth }).toBuffer()

  const { data, info } = await sharp(resized).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += info.channels) {
    data[i + 3] = Math.round(data[i + 3] * WATERMARK_OPACITY)
  }
  const translucent = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer()

  const logoMeta = await sharp(translucent).metadata()
  const left = Math.round(((meta.width ?? 0) - (logoMeta.width ?? 0)) / 2)
  const top = Math.round(((meta.height ?? 0) - (logoMeta.height ?? 0)) / 2)

  return base.composite([{ input: translucent, left, top }]).png().toBuffer()
}
