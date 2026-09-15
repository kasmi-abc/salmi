"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
async function requireAdmin(){ const s=await getServerSession(authOptions); if(!s) throw new Error("Unauthorized") }

export async function adjustStock(productId: string, delta: number) {
  await requireAdmin()
  const p = await prisma.product.findUnique({ where: { id: productId } })
  if (!p) return { error: "Produit introuvable" }
  const newCount = Math.max(0, (p.stockCount || 0) + delta)
  await prisma.product.update({ where: { id: productId }, data: { stockCount: newCount, stock: newCount > 0 } })
  revalidatePath("/admin")
  return { ok: true, stockCount: newCount }
}

export async function setStock(productId: string, count: number) {
  await requireAdmin()
  await prisma.product.update({ where: { id: productId }, data: { stockCount: Math.max(0, count), stock: count > 0 } })
  revalidatePath("/admin")
  return { ok: true }
}
