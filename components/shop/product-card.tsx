"use client"
import Link from "next/link"
import Image from "next/image"
import { formatDA } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, BookOpen } from "lucide-react"
import { useCart } from "@/lib/store"
import { useToast } from "@/components/ui/toaster"
import React from "react"

type Props = {
  product: {
    id: string
    title: string
    slug: string
    price: number
    oldPrice?: number | null
    category: string
    pages?: number | null
    image: string
    stock: boolean
  }
}

export const ProductCard = React.memo(function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add)
  const { toast } = useToast()
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{product.category}</Badge>
          {!product.stock && <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">Rupture</span>}
        </div>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/shop/${product.slug}`} className="line-clamp-2 font-semibold leading-tight hover:text-teal-600">
          {product.title}
        </Link>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <BookOpen className="h-3.5 w-3.5" /> {product.pages ?? 160} pages
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-teal-700">{formatDA(product.price)}</span>
          {product.oldPrice && <span className="text-sm line-through text-slate-400">{formatDA(product.oldPrice)}</span>}
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            disabled={!product.stock}
            className="flex-1 rounded-xl"
            onClick={() => { add({ id: product.id, title: product.title, price: product.price, image: product.image, slug: product.slug }); toast({ title: "Ajouté au panier", description: product.title, variant: "success"}) }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> {product.stock ? "Ajouter" : "Indisponible"}
          </Button>
          <Link href={`/shop/${product.slug}`} className="inline-flex h-10 px-4 items-center justify-center rounded-xl border bg-white text-sm font-medium hover:bg-slate-50">
            Voir
          </Link>
        </div>
      </div>
    </div>
  )
})
