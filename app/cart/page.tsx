"use client"
import Link from "next/link"
import { useCart } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { formatDA } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, inc, dec, remove, total, clear } = useCart()
  const t = total()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold">Votre panier est vide</h1>
        <p className="text-slate-600 mt-2">Parcourez la boutique et ajoutez vos résumés préférés.</p>
        <Link href="/shop" className="inline-flex mt-6"><Button className="rounded-full">Aller à la boutique</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Panier ({items.length})</h1>
      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex gap-4 rounded-2xl border bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt={it.title} className="h-20 w-20 rounded-xl object-cover bg-slate-100" />
              <div className="flex-1">
                <div className="font-semibold leading-tight">{it.title}</div>
                <div className="text-sm text-teal-700 font-bold">{formatDA(it.price)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => dec(it.id)} className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center font-semibold">{it.quantity}</span>
                  <button onClick={() => inc(it.id)} className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
                  <button onClick={() => remove(it.id)} className="ml-2 text-sm text-red-600 flex items-center gap-1 hover:underline"><Trash2 className="h-4 w-4" /> Supprimer</button>
                </div>
              </div>
              <div className="font-bold">{formatDA(it.price * it.quantity)}</div>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-slate-500 hover:text-slate-900">Vider le panier</button>
        </div>

        <div className="rounded-2xl border bg-white p-6 h-fit sticky top-20">
          <h3 className="font-semibold">Résumé</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Sous-total</span><span className="font-medium">{formatDA(t)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Livraison</span><span className="text-slate-500">Calculée au checkout</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-teal-700">{formatDA(t)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 block"><Button className="w-full rounded-xl h-11 text-base">Passer commande</Button></Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-slate-600 hover:text-slate-900">Continuer vos achats</Link>
        </div>
      </div>
    </div>
  )
}
