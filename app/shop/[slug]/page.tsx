import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDA } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCart } from "@/components/shop/add-to-cart"
import { BookOpen, ShieldCheck, Truck, Star, FileText, UserCheck, Eye, Download, Award } from "lucide-react"
import Link from "next/link"
import { createReview } from "@/app/actions/reviews"
import { createStockAlert } from "@/app/actions/alerts"
import { StockAlertForm } from "@/components/shop/stock-alert-form"
import { Lightbox } from "@/components/shop/lightbox"

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product: any = null
  let reviews: any[] = []
  let related: any[] = []
  try {
    product = await prisma.product.findUnique({ where: { slug: params.slug } })
    if (!product) return notFound()
    // Parallelize to avoid N+1 sequential delay
    const [rvs, rel] = await Promise.all([
      prisma.review.findMany({ where: { productId: product.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.product.findMany({ where: { category: product.category, NOT: { id: product.id } }, take: 3 }),
    ])
    reviews = rvs
    related = rel
  } catch { if (!product) return notFound() }

  const toc = product.tableOfContents ? product.tableOfContents.split('\n').filter(Boolean) : []
  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/shop" className="text-sm text-slate-500 hover:text-slate-900">← Retour boutique</Link>
      <div className="mt-4 grid lg:grid-cols-2 gap-8">
        <div>
          <Lightbox src={product.image} alt={product.title} />
          {/* Thumbnails if additional images */}
          {product.images?.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(0,4).map((img:string,i:number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`${product.title} aperçu ${i+1}`} className="h-20 w-full object-cover rounded-xl border" loading="lazy" />
              ))}
            </div>
          )}
          {/* Author card */}
          {product.author && (
            <Card className="mt-4 border-teal-200 bg-teal-50">
              <CardContent className="p-4 flex gap-3">
                <span className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center"><UserCheck className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs text-teal-700 font-semibold flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Auteur / Référence</div>
                  <div className="text-sm font-medium">{product.author}</div>
                  <div className="text-xs text-slate-600">Validé par des lauréats du Résidanat</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <div className="flex gap-2">
            <Badge>{product.category}</Badge>
            <Badge className="bg-slate-900 text-white">{product.studyYear?.replace('YEAR_','Année ')?.replace('RESIDANAT','Résidanat') || 'Résidanat'}</Badge>
            {product.featured && <Badge className="bg-amber-500 text-white border-amber-500">Best-seller</Badge>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{product.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {product.pages ?? 160} pages</span>
            <span className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-amber-500" /> {product.rating?.toFixed(1) || '4.8'} ({product.reviewsCount || reviews.length} avis)</span>
            {product.stock ? <span className="text-emerald-600 font-medium">● En stock ({product.stockCount ?? '—'} restants)</span> : <span className="text-red-500 font-medium">● Rupture - <a href="#notify" className="underline">Être alerté</a></span>}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-teal-700">{formatDA(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="line-through text-slate-400">{formatDA(product.oldPrice)}</span>
                <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">-{product.discountPercent || Math.round((1 - product.price/product.oldPrice)*100)}%</span>
              </>
            )}
          </div>
          <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-teal-600" /> Table des matières</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                  {toc.map((line:string,i:number) => <li key={i} className="flex gap-2"><span className="text-teal-600 font-bold">{i+1}.</span> {line}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* PDF Preview */}
          <Card className="mt-4 border-sky-200 bg-sky-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Eye className="h-8 w-8 text-sky-600" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Aperçu gratuit (PDF Sample)</div>
                <div className="text-xs text-slate-600">5 pages d’exemple - qualité d’impression & schémas</div>
              </div>
              {product.pdfPreview ? (
                <a href={product.pdfPreview} target="_blank" className="rounded-full bg-sky-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-1"><Download className="h-4 w-4" /> Voir PDF</a>
              ) : (
                <span className="text-xs text-slate-500">Bientôt disponible</span>
              )}
            </CardContent>
          </Card>

          <div className="mt-6">
            <AddToCart product={{ id: product.id, title: product.title, price: product.price, image: product.image, slug: product.slug, stock: product.stock }} />
            {!product.stock && (
              <StockAlertForm productId={product.id} />
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <Card><CardContent className="p-3 text-center"><Truck className="h-5 w-5 mx-auto text-teal-600" /><div className="font-medium mt-1">69 wilayas</div></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><ShieldCheck className="h-5 w-5 mx-auto text-teal-600" /><div className="font-medium mt-1">Paiement à la livraison</div></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><BookOpen className="h-5 w-5 mx-auto text-teal-600" /><div className="font-medium mt-1">Édition 2024</div></CardContent></Card>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-bold flex items-center gap-2"><Star className="h-5 w-5 text-amber-500 fill-amber-500" /> Avis des étudiants ({reviews.length})</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {reviews.length ? reviews.map((r:any) => (
            <Card key={r.id}><CardContent className="p-4">
              <div className="flex gap-1">{Array.from({length: r.stars}).map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="mt-2 text-sm">“{r.comment}”</p>
              <div className="mt-3 text-xs font-semibold text-slate-500">{r.name} {r.verified && <span className="text-emerald-600">✓ Achat vérifié</span>}</div>
            </CardContent></Card>
          )) : <p className="text-sm text-slate-500">Aucun avis pour l’instant - soyez le premier !</p>}
        </div>
        {/* Add review form - functional */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm">Laisser un avis</h3>
            <form action={async (fd: FormData) => {
              "use server"
              const res = await createReview(fd)
              // handled via revalidate
            }} className="mt-3 grid sm:grid-cols-3 gap-3">
              <input type="hidden" name="productId" value={product.id} />
              <input name="name" required placeholder="Votre nom - ex: Ahmed - Oran" className="h-10 rounded-xl border px-3 text-sm" />
              <select name="stars" className="h-10 rounded-xl border px-3 text-sm"><option value="5">5 ★ Excellent</option><option value="4">4 ★ Très bien</option><option value="3">3 ★ Bien</option><option value="2">2 ★ Moyen</option><option value="1">1 ★ Décevant</option></select>
              <button type="submit" className="h-10 rounded-xl bg-slate-900 text-white text-sm font-medium">Envoyer l'avis ✓</button>
              <textarea name="comment" required placeholder="Votre commentaire (min 10 caractères) - ex: Très clair, schémas parfaits..." className="sm:col-span-3 min-h-[80px] rounded-xl border px-3 py-2 text-sm" />
            </form>
            <p className="text-xs text-slate-500 mt-2">Les avis sont modérés par l'admin avant publication (vérification).</p>
          </CardContent>
        </Card>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold">Vous aimerez aussi</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {related.map((p:any) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="rounded-2xl border bg-white p-3 flex gap-3 hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                <div><div className="text-sm font-semibold line-clamp-2">{p.title}</div><div className="text-sm font-bold text-teal-700">{formatDA(p.price)}</div></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
