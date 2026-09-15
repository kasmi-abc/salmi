import { prisma } from "@/lib/db"
import { formatDA } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BundleAddToCart } from "@/components/shop/bundle-add-to-cart"

export const dynamic = 'force-dynamic'

export default async function BundlesPage() {
  let bundles: any[] = []
  try { bundles = await prisma.bundle.findMany({ where: { active: true }, include: { items: { include: { product: true } } } }) } catch {}
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold">Packs & Bundles</h1>
      <p className="text-slate-600 mt-1">Économisez jusqu'à 25% en achetant en pack — idéal pour Résidanat</p>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {bundles.length ? bundles.map((b:any)=>(
          <Card key={b.id} className="overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-teal-600 to-sky-500 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image || '/books/Pneumologie.jpg'} alt={b.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
              <div className="absolute bottom-3 left-4 text-white">
                <Badge className="bg-amber-400 text-slate-900 border-amber-400">-25% Pack</Badge>
                <h3 className="font-bold text-xl mt-1">{b.title}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600">{b.description}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-teal-700">{formatDA(b.price)}</span>
                {b.oldPrice && <span className="line-through text-slate-400 text-sm">{formatDA(b.oldPrice)}</span>}
              </div>
              <div className="mt-3 space-y-1">
                {b.items.map((it:any)=>(
                  <div key={it.id} className="flex gap-2 text-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.product.image} alt={it.product.title} className="h-8 w-8 rounded-lg object-cover" />
                    <span>{it.product.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {b.items.length > 0 ? (
                  <BundleAddToCart
                    bundleTitle={b.title}
                    products={b.items.map((it:any)=>({ id: it.product.id, title: it.product.title, price: it.product.price, image: it.product.image, slug: it.product.slug }))}
                  />
                ) : (
                  <Link href="/shop" className="block"><Button className="w-full rounded-xl" variant="outline">Voir boutique — Pack vide</Button></Link>
                )}
                <Link href="/cart" className="block text-center text-xs text-slate-500 hover:text-slate-700">Voir panier →</Link>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="p-8 text-center col-span-2 border-dashed"><p className="font-medium">Pack Résidanat Complet - 9 500 DA</p><p className="text-sm text-slate-500">Pneumo + Gynéco + Urologie + Dermato + ORL (au lieu de 12 800 DA)</p><Link href="/shop" className="inline-flex mt-3"><Button>Voir boutique</Button></Link></Card>
        )}
      </div>
    </div>
  )
}
