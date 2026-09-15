"use client"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store"
import { ShoppingBag } from "lucide-react"
import { useState } from "react"

type BundleProduct = { id: string; title: string; price: number; image: string; slug: string }

export function BundleAddToCart({ products, bundleTitle }: { products: BundleProduct[]; bundleTitle: string }) {
  const add = useCart((s) => s.add)
  const [done, setDone] = useState(false)

  function handle() {
    products.forEach((p) => add({ id: p.id, title: p.title, price: p.price, image: p.image, slug: p.slug }, 1))
    setDone(true)
    window.dispatchEvent(new Event("open-cart"))
    setTimeout(() => setDone(false), 2500)
  }

  if (!products.length) return null

  return (
    <Button onClick={handle} className="w-full rounded-xl h-11">
      <ShoppingBag className="mr-2 h-4 w-4" /> {done ? "✓ Ajouté au panier" : `Commander le Pack — ${products.length} livres`}
    </Button>
  )
}
