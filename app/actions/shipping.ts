"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
async function requireAdmin(){ const s=await getServerSession(authOptions); if(!s) throw new Error("Unauthorized") }

export async function upsertWilaya(formData: FormData) {
  await requireAdmin()
  const wilaya = String(formData.get("wilaya"))
  const priceStopDesk = Number(formData.get("priceStopDesk")||400)
  const priceDomicile = Number(formData.get("priceDomicile")||600)
  if (!wilaya) return { error: "Wilaya requise" }
  await prisma.wilayaShipping.upsert({ where: { wilaya }, update: { priceStopDesk, priceDomicile }, create: { wilaya, priceStopDesk, priceDomicile } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function createCompany(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get("name")||"").trim().slice(0,60)
  const apiKey = String(formData.get("apiKey")||"")
  const apiUrl = String(formData.get("apiUrl")||"")
  if (!name) return { error: "Nom requis" }
  await prisma.shippingCompany.create({ data: { name, apiKey: apiKey||null, apiUrl: apiUrl||null } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function deleteCompany(id: string) {
  await requireAdmin()
  await prisma.shippingCompany.delete({ where: { id } })
  revalidatePath("/admin")
  return { ok: true }
}

export async function saveSettings(formData: FormData) {
  await requireAdmin()
  const heroTitle = String(formData.get("heroTitle")||"").slice(0,120)
  const heroSubtitle = String(formData.get("heroSubtitle")||"")
  const existing = await prisma.siteSettings.findFirst()
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: { heroTitle, heroSubtitle } })
  } else {
    await prisma.siteSettings.create({ data: { heroTitle, heroSubtitle } })
  }
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true }
}
