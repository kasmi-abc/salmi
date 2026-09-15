import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/shop/product-card"
import { SearchDebounce } from "@/components/shop/search-debounce"
import Link from "next/link"
import type { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

const YEAR_LABELS: Record<string,string> = {
  YEAR_1: "1ère Année", YEAR_2: "2ème Année", YEAR_3: "3ème Année", YEAR_4: "4ème Année", YEAR_5: "5ème Année", YEAR_6: "6ème Année", RESIDANAT: "Résidanat", ALL: "Tous"
}

export default async function ShopPage({ searchParams }: { searchParams: { category?: string; q?: string; year?: string; page?: string } }) {
  const category = searchParams.category
  const year = searchParams.year
  const q = searchParams.q
  const page = Math.max(1, Number(searchParams.page || 1))
  const PAGE_SIZE = 12

  let products: Prisma.ProductGetPayload<{}>[] = []
  let categories: string[] = []
  let total = 0
  try {
    const where: Prisma.ProductWhereInput = {}
    if (category) where.category = category
    if (year) where.studyYear = year as any
    if (q) where.title = { contains: q, mode: 'insensitive' }
    const [c, prods, catsRaw] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.product.findMany({ distinct: ['category'], select: { category: true } })
    ])
    total = c
    products = prods
    categories = catsRaw.map((c) => c.category)
  } catch { products = [] }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const buildUrl = (cat?: string, yr?: string, pg?: number) => {
    const p = new URLSearchParams()
    if (cat) p.set('category', cat)
    if (yr) p.set('year', yr)
    if (q) p.set('q', q)
    if (pg && pg > 1) p.set('page', String(pg))
    return `/shop${p.toString() ? '?' + p.toString() : ''}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Boutique</h1>
          <p className="text-slate-600 mt-1">Filtrez par spécialité et année d'étude — édition 2024 • {total} produits</p>
        </div>
        <div className="flex gap-2">
          <SearchDebounce initialQ={q} />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        <Link href={buildUrl(undefined, year)} className={`rounded-full border px-4 py-1.5 text-sm ${!category ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50'}`}>Tous</Link>
        {(categories.length ? categories : ["Pneumologie","Gériatrie","Radiologie","Gynécologie","Urologie","Dermatologie","ORL","Ophtalmologie"]).map((cat) => (
          <Link key={cat} href={buildUrl(cat, year)} className={`rounded-full border px-4 py-1.5 text-sm ${category === cat ? 'bg-teal-600 text-white border-teal-600' : 'bg-white hover:bg-slate-50'}`}>
            {cat}
          </Link>
        ))}
      </div>
      {/* Year filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <span className="text-sm text-slate-500 py-1.5">Année:</span>
        <Link href={buildUrl(category, undefined)} className={`rounded-full border px-3 py-1.5 text-xs ${!year ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white'}`}>Toutes</Link>
        {Object.entries(YEAR_LABELS).filter(([k])=>k!=='ALL').map(([k,v])=>(
          <Link key={k} href={buildUrl(category, k)} className={`rounded-full border px-3 py-1.5 text-xs ${year===k ? 'bg-teal-600 text-white border-teal-600' : 'bg-white hover:bg-slate-50'}`}>{v}</Link>
        ))}
      </div>

      {/* Bundles banner */}
      <Link href="/bundles" className="mb-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
        <div><div className="font-bold">🎁 Packs Résidanat - Économisez jusqu'à 25%</div><div className="text-sm opacity-90">Bundle Pneumologie + Gynécologie + Urologie</div></div>
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-orange-600">Voir les Packs →</span>
      </Link>

      {products.length ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Link href={buildUrl(category, year, page - 1)} className={`h-9 px-4 rounded-full border flex items-center text-sm ${page <= 1 ? 'pointer-events-none opacity-40' : 'bg-white hover:bg-slate-50'}`}>← Précédent</Link>
              <span className="text-sm text-slate-600">Page {page} / {totalPages}</span>
              <Link href={buildUrl(category, year, page + 1)} className={`h-9 px-4 rounded-full border flex items-center text-sm ${page >= totalPages ? 'pointer-events-none opacity-40' : 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'}`}>Suivant →</Link>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">Aucun produit trouvé</p>
          <p className="text-sm text-slate-500 mt-1">Essayez un autre filtre ou <Link href="/shop" className="text-teal-600 underline">réinitialiser</Link></p>
        </div>
      )}
    </div>
  )
}
