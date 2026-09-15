"use server"
import { prisma } from "@/lib/db"

export async function getShippingFee(wilaya: string, type: "STOP_DESK" | "A_DOMICILE") {
  if (!wilaya) return type === "A_DOMICILE" ? 600 : 400
  try {
    const row = await prisma.wilayaShipping.findUnique({ where: { wilaya } })
    if (!row || !row.active) return type === "A_DOMICILE" ? 600 : 400
    return type === "A_DOMICILE" ? row.priceDomicile : row.priceStopDesk
  } catch {
    return type === "A_DOMICILE" ? 600 : 400
  }
}

export async function getAllWilayaFees() {
  try {
    const rows = await prisma.wilayaShipping.findMany()
    const map: Record<string, { stopDesk: number; domicile: number }> = {}
    rows.forEach((r) => (map[r.wilaya] = { stopDesk: r.priceStopDesk, domicile: r.priceDomicile }))
    return map
  } catch { return {} }
}
