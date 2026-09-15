import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AdminClient } from "./admin-client"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  let products: any[] = []; let orders: any[] = []; let promos: any[] = []; let wilayas: any[] = []; let companies: any[] = []; let reviews: any[] = []; let settings: any = null; let bundles: any[] = []; let stockAlerts: any[] = []
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true } })
    promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } })
    wilayas = await prisma.wilayaShipping.findMany({ orderBy: { wilaya: 'asc' } })
    companies = await prisma.shippingCompany.findMany()
    reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { product: { select: { title: true } } } })
    settings = await prisma.siteSettings.findFirst()
    bundles = await prisma.bundle.findMany({ orderBy: { createdAt: 'desc' }, include: { items: { include: { product: { select: { title: true, slug: true } } } } } })
    try { stockAlerts = await prisma.stockAlert.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { product: { select: { title: true, slug: true } } } }) } catch { stockAlerts = [] }
  } catch {}

  return <AdminClient products={products} orders={orders} promos={promos} wilayas={wilayas} companies={companies} reviews={reviews} settings={settings} bundles={bundles} stockAlerts={stockAlerts} />
}
