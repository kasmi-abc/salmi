"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized - admin only")
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const title = String(formData.get("title")).trim().slice(0, 200)
  const price = Number(formData.get("price"))
  const oldPrice = Number(formData.get("oldPrice") || 0) || null
  const category = String(formData.get("category"))
  const studyYear = String(formData.get("studyYear") || "RESIDANAT")
  const pages = Number(formData.get("pages") || 0)
  const stockCount = Number(formData.get("stockCount") || 50)
  const author = String(formData.get("author") || "").trim().slice(0,100)
  const tableOfContents = String(formData.get("tableOfContents") || "").trim().slice(0,2000)
  let image = String(formData.get("image") || "").trim().slice(0,500)
  const fallback = String(formData.get("imageFallback") || "").trim().slice(0,500)
  if (!image && fallback) image = fallback
  const description = String(formData.get("description") || "").trim().slice(0,5000)
  if (!title || !price || !category) return { error: "Champs requis manquants" }
  if (title.length < 3) return { error: "Titre trop court" }
  if (price < 100 || price > 50000) return { error: "Prix invalide (100-50000 DA)" }
  if (!image) return { error: "الصورة مطلوبة" }
  if (!image.startsWith("/") && !image.startsWith("https://") && !image.startsWith("data:")) return { error: "URL image invalide" }
  const slug = slugify(title) + "-" + Date.now().toString(36)
  const discountPercent = oldPrice && oldPrice > price ? Math.round((1 - price/oldPrice)*100) : null
  await prisma.product.create({
    data: { title, slug, price, oldPrice, discountPercent, category, studyYear: studyYear as any, pages: pages || null, stockCount, stock: stockCount>0, image, description: description || title, author: author || null, tableOfContents: tableOfContents || null, rating: 4.8, featured: false }
  })
  revalidatePath("/admin"); revalidatePath("/shop")
  return { ok: true }
}

export async function toggleStock(productId: string) {
  await requireAdmin()
  const p = await prisma.product.findUnique({ where: { id: productId } })
  if (!p) return { error: "Not found" }
  await prisma.product.update({ where: { id: productId }, data: { stock: !p.stock, stockCount: !p.stock ? 50 : 0 } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function updatePrice(productId: string, price: number) {
  await requireAdmin()
  const p = await prisma.product.findUnique({ where: { id: productId } })
  if (!p) return { error: "Not found" }
  const discountPercent = p.oldPrice && p.oldPrice > price ? Math.round((1 - price/p.oldPrice)*100) : p.discountPercent
  await prisma.product.update({ where: { id: productId }, data: { price, discountPercent } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function deleteProduct(productId: string) {
  await requireAdmin()
  await prisma.product.delete({ where: { id: productId } })
  revalidatePath("/admin")
  return { ok: true }
}
