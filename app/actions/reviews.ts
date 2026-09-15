"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

// In-memory rate limit fallback (per instance) — 1 review / 2 minutes per IP+product
const reviewCooldown = new Map<string, number>()

export async function createReview(formData: FormData) {
  const productId = String(formData.get("productId"))
  const name = String(formData.get("name") || "").trim()
  const stars = Number(formData.get("stars") || 5)
  const comment = String(formData.get("comment") || "").trim()
  if (!productId || !name || !comment) return { error: "Tous les champs sont requis" }
  if (name.length < 2) return { error: "Nom trop court" }
  if (comment.length < 10) return { error: "Commentaire trop court (min 10 caractères)" }
  if (comment.length > 500) return { error: "Commentaire trop long (max 500)" }
  if (stars < 1 || stars > 5) return { error: "Note invalide" }

  // Rate limit: 1 per 2 min per IP+product
  try {
    const h = await headers()
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
    const key = `${ip}:${productId}`
    const last = reviewCooldown.get(key)
    if (last && Date.now() - last < 2 * 60 * 1000) {
      return { error: "Veuillez patienter 2 minutes avant de poster un autre avis" }
    }
    // DB check: same name+product in last 5 min (spam)
    const recent = await prisma.review.findFirst({
      where: { productId, name, createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
    })
    if (recent) return { error: "Vous avez déjà posté un avis récemment. Réessayez dans quelques minutes." }
    reviewCooldown.set(key, Date.now())
    // cleanup old entries
    if (reviewCooldown.size > 500) {
      const now = Date.now()
      reviewCooldown.forEach((t, k) => { if (now - t > 10 * 60 * 1000) reviewCooldown.delete(k) })
    }
  } catch {}

  await prisma.review.create({ data: { productId, name, stars, comment, verified: false } })
  await prisma.product.update({ where: { id: productId }, data: { reviewsCount: { increment: 1 } } })
  revalidatePath(`/shop/[slug]`)
  revalidatePath(`/shop`)
  return { ok: true }
}

export async function deleteReview(reviewId: string) {
  const { getServerSession } = await import("next-auth")
  const { authOptions } = await import("@/lib/auth")
  const s = await getServerSession(authOptions)
  if (!s) throw new Error("Unauthorized")
  const r = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!r) return { error: "Not found" }
  await prisma.review.delete({ where: { id: reviewId } })
  await prisma.product.update({ where: { id: r.productId }, data: { reviewsCount: { decrement: 1 } } })
  revalidatePath("/admin")
  return { ok: true }
}
