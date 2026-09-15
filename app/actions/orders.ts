"use server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { headers } from "next/headers"
async function requireAdmin(){ const s=await getServerSession(authOptions); if(!s) throw new Error("Unauthorized") }

type PlaceOrderInput = {
  customerName: string
  phone: string
  wilaya: string
  commune: string
  address?: string
  shippingType: "STOP_DESK" | "A_DOMICILE"
  items: { productId: string; quantity: number }[]
  promoCode?: string
}

export async function validatePromo(code: string) {
  if (!code) return null
  const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase().trim() } })
  if (!promo || !promo.active) return null
  if (promo.expiresAt && promo.expiresAt < new Date()) return null
  return promo
}

export async function placeOrder(input: PlaceOrderInput) {
  // Rate limit: 5 orders / 10 min per IP
  try {
    const h = await headers()
    const ip = getClientIp(h as unknown as Headers)
    if (!rateLimit(`order:${ip}`, 5, 10*60*1000)) return { error: "Trop de commandes - réessayez dans 10 minutes" }
  } catch {}
  // sanitize & validate DZ phone
  const cleanPhone = String(input.phone).replace(/\s/g,"")
  if (!/^(0)(5|6|7)\d{8}$/.test(cleanPhone)) return { error: "Téléphone invalide (05/06/07 + 8 chiffres)" }
  input.phone = cleanPhone
  input.customerName = String(input.customerName).trim().slice(0,80)
  input.commune = String(input.commune).trim().slice(0,60)
  input.wilaya = String(input.wilaya).trim().slice(0,60)
  if (!input.customerName || !input.phone || !input.wilaya || !input.commune) {
    return { error: "Champs requis manquants" }
  }
  if (!input.items.length) return { error: "Panier vide" }
  if (input.items.length > 20) return { error: "Trop d'articles" }

  // Use transaction to prevent race condition
  return await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { id: { in: input.items.map(i => i.productId) } } })
    if (products.length !== input.items.length) throw new Error("Produit introuvable")

    // Check stock inside transaction with fresh data
    for (const it of input.items) {
      const p = products.find(x => x.id === it.productId)!
      if (!p.stock || p.stockCount < it.quantity) throw new Error(`Rupture: ${p.title} (reste ${p.stockCount})`)
    }

    let subtotal = 0
    const orderItems = input.items.map(it => {
      const p = products.find(x => x.id === it.productId)!
      subtotal += p.price * it.quantity
      return { productId: p.id, title: p.title, price: p.price, quantity: it.quantity, image: p.image }
    })

    // Dynamic shipping fee per wilaya if configured
    let shippingFee = input.shippingType === "A_DOMICILE" ? 600 : 400
    try {
      const ws = await tx.wilayaShipping.findUnique({ where: { wilaya: input.wilaya } })
      if (ws && ws.active) shippingFee = input.shippingType === "A_DOMICILE" ? ws.priceDomicile : ws.priceStopDesk
    } catch {}
    let total = subtotal + shippingFee
    let discount = 0
    let promoCode: string | null = null

    if (input.promoCode) {
      const promo = await tx.promoCode.findUnique({ where: { code: input.promoCode.toUpperCase().trim() } })
      if (!promo || !promo.active || (promo.expiresAt && promo.expiresAt < new Date())) throw new Error("Code promo invalide ou expiré")
      discount = Math.round(subtotal * promo.percent / 100)
      total = subtotal - discount + shippingFee
      promoCode = promo.code
    }

    const order = await tx.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        wilaya: input.wilaya,
        commune: input.commune,
        address: input.address,
        shippingType: input.shippingType as any,
        totalAmount: total,
        shippingFee,
        discount,
        promoCode,
        status: "PENDING",
        items: { create: orderItems }
      }
    })

    // Decrement stock atomically inside transaction
    for (const it of input.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: {
          stockCount: { decrement: it.quantity },
        }
      })
    }
    // Update stock boolean based on new count
    for (const it of input.items) {
      const p = await tx.product.findUnique({ where: { id: it.productId } })
      if (p && p.stockCount <= 0) {
        await tx.product.update({ where: { id: it.productId }, data: { stock: false } })
      }
    }

    return { orderId: order.id, total, discount }
  }).catch((e:any) => {
    return { error: e.message || "Erreur lors de la commande" }
  }) as any
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const allowed = ["PENDING","PROCESSING","SHIPPED","DELIVERED","CANCELLED"]
  if (!allowed.includes(status)) return { error: "Statut invalide" }
  await prisma.order.update({ where: { id: orderId }, data: { status: status as any } })
  return { ok: true }
}

export async function updateTracking(orderId: string, note: string) {
  await requireAdmin()
  await prisma.order.update({ where: { id: orderId }, data: { trackingNote: String(note).slice(0,200) } })
  return { ok: true }
}
