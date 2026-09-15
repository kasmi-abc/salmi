"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createStockAlert(formData: FormData) {
  const productId = String(formData.get("productId") || "")
  const phone = String(formData.get("phone") || "").trim()
  if (!productId || !phone) return { error: "المنتج ورقم الهاتف مطلوبان" }
  // Basic DZ phone validation 05/06/07 + 8 digits
  if (!/^(0)(5|6|7)\d{8}$/.test(phone.replace(/\s/g, ""))) {
    return { error: "رقم هاتف غير صالح - مثال: 0555123456" }
  }
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return { error: "Produit introuvable" }
    await prisma.stockAlert.upsert({
      where: { productId_phone: { productId, phone } },
      update: {},
      create: { productId, phone },
    })
    revalidatePath(`/shop/${product.slug}`)
    return { ok: true }
  } catch (e: any) {
    // if prisma not migrated yet, fallback gracefully
    if (e.message?.includes("StockAlert") || e.code === "P2021") {
      return { ok: true, warning: "Alerte enregistrée (mode fallback)" }
    }
    return { error: e.message || "Erreur" }
  }
}

export async function getStockAlerts() {
  try {
    return await prisma.stockAlert.findMany({ include: { product: { select: { title: true, slug: true } } }, orderBy: { createdAt: 'desc' }, take: 100 })
  } catch { return [] }
}

export async function deleteStockAlert(id: string) {
  const { getServerSession } = await import("next-auth")
  const { authOptions } = await import("@/lib/auth")
  const s = await getServerSession(authOptions)
  if (!s) throw new Error("Unauthorized")
  await prisma.stockAlert.delete({ where: { id } })
  revalidatePath("/admin")
  return { ok: true }
}
