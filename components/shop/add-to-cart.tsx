"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store"
import { ShoppingBag, Minus, Plus } from "lucide-react"

export function AddToCart({ product }: { product: { id: string; title: string; price: number; image: string; slug: string; stock: boolean } }) {
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  if (!product.stock) return <Button disabled className="w-full">Rupture de stock</Button>
  return (
    <div className="flex gap-3">
      <div className="flex items-center rounded-xl border">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
      </div>
      <Button className="flex-1 rounded-xl h-12 text-base" onClick={() => { add({ id: product.id, title: product.title, price: product.price, image: product.image, slug: product.slug }, qty); window.dispatchEvent(new Event('open-cart')) }}>
        <ShoppingBag className="mr-2 h-5 w-5" /> Ajouter au panier
      </Button>
    </div>
  )
}
