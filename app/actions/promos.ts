"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
async function requireAdmin(){ const s=await getServerSession(authOptions); if(!s) throw new Error("Unauthorized") }

export async function createPromo(formData: FormData) {
  await requireAdmin()
  const code = String(formData.get("code") || "").toUpperCase().trim().slice(0,20)
  const percent = Number(formData.get("percent") || 0)
  const expiresAt = String(formData.get("expiresAt") || "")
  if (!code || !percent || percent < 1 || percent > 80) return { error: "Code et pourcentage (1-80) requis" }
  if (await prisma.promoCode.findUnique({ where: { code } })) return { error: "Code déjà existant" }
  await prisma.promoCode.create({ data: { code, percent, expiresAt: expiresAt ? new Date(expiresAt) : null } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function deletePromo(id: string) {
  await requireAdmin()
  await prisma.promoCode.delete({ where: { id } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function togglePromo(id: string) {
  await requireAdmin()
  const p = await prisma.promoCode.findUnique({ where: { id } })
  if (!p) return { error: "Not found" }
  await prisma.promoCode.update({ where: { id }, data: { active: !p.active } })
  revalidatePath("/admin")
  return { ok: true }
}
