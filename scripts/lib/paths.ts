import { join } from "path"

// The product photo/logo source lives outside the repo, at a fixed spot on
// the D: drive — but these seed scripts get run both from WSL (bash) and
// from native Windows (PowerShell), which need different path syntax for
// the same physical location.
export const FURNITURE_ROOT = process.platform === "win32" ? "D:\\Furniture" : "/mnt/d/Furniture"
export const GENERATED_ROOT = join(FURNITURE_ROOT, "Generated")
export const LOGO_PATH = join(FURNITURE_ROOT, "Yousuf Living - Logo.png")
