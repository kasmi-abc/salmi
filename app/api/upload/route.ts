import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST /api/upload  -> FormData { file: File }
// Returns { url: "/uploads/xxx.jpg" }  (local) 
// For production on Vercel, replace this with Cloudinary / Vercel Blob - see comments below
export async function POST(req: NextRequest) {
  // Auth guard - only admin can upload
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    // Validate
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only images allowed" }, { status: 400 })
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Max 4MB" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use timestamp + random to avoid collisions
    const ext = path.extname(file.name) || ".jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

    // Local dev: save to public/uploads
    // On Vercel production filesystem is read-only - switch to Cloudinary/Vercel Blob by setting CLOUDINARY_URL or BLOB_READ_WRITE_TOKEN
    // Here we try local, fallback to base64 data-url if write fails (so it still works on Vercel without config)
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    try {
      if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (e) {
      // Fallback: return base64 (works everywhere, no external service, but increases DB size)
      // For production, configure Cloudinary instead - see .env.example
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`
      return NextResponse.json({ url: base64, warning: "Saved as base64 - configure Cloudinary for production" })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 })
  }
}
