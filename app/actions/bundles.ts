"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
async function requireAdmin(){ const s=await getServerSession(authOptions); if(!s) throw new Error("Unauthorized") }

export async function createBundle(formData: FormData) {
  await requireAdmin()
  const title = String(formData.get("title") || "").trim().slice(0,120)
  const description = String(formData.get("description") || "").trim()
  const price = Number(formData.get("price"))
  const oldPrice = Number(formData.get("oldPrice") || 0) || null
  const image = String(formData.get("image") || "").trim() || null
  const productIds = String(formData.get("productIds") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (!title || !price) return { error: "Titre et prix requis" }
  if (productIds.length === 0) return { error: "Sélectionnez au moins 1 produit (IDs séparés par ,)" }
  const slug = slugify(title) + "-" + Date.now().toString(36)
  try {
    const bundle = await prisma.bundle.create({
      data: { title, slug, description: description || title, price, oldPrice, image, active: true },
    })
    for (const pid of productIds) {
      const exists = await prisma.product.findUnique({ where: { id: pid } })
      if (exists) await prisma.bundleItem.create({ data: { bundleId: bundle.id, productId: pid } })
    }
    revalidatePath("/bundles")
    revalidatePath("/admin")
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteBundle(id: string) {
  await requireAdmin()
  await prisma.bundle.delete({ where: { id } })
  revalidatePath("/bundles")
  revalidatePath("/admin")
  return { ok: true }
}

export async function toggleBundle(id: string) {
  await requireAdmin()
  const b = await prisma.bundle.findUnique({ where: { id } })
  if (!b) return { error: "Not found" }
  await prisma.bundle.update({ where: { id }, data: { active: !b.active } })
  revalidatePath("/bundles")
  revalidatePath("/admin")
  return { ok: true }
}
