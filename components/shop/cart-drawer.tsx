"use client"
import { useCart } from "@/lib/store"
import { formatDA } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { X, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"

export function CartDrawer({ related }: { related?: any[] }) {
  const { items, total } = useCart()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(()=>setMounted(true),[])
  // Listen for custom event to open drawer when adding to cart
  useEffect(()=>{
    const h = () => setOpen(true)
    window.addEventListener('open-cart', h)
    return ()=> window.removeEventListener('open-cart', h)
  },[])
  if (!mounted) return null
  return (
    <>
      <button onClick={()=>setOpen(true)} className="fixed bottom-20 right-4 z-40 bg-slate-900 text-white rounded-full p-3 shadow-lg flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" /> {items.length} • {formatDA(total())}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full overflow-auto p-4">
            <div className="flex justify-between items-center"><h3 className="font-bold">Panier</h3><button onClick={()=>setOpen(false)}><X className="h-5 w-5" /></button></div>
            <div className="mt-4 space-y-3">
              {items.map((it:any)=><div key={it.id} className="flex gap-3 text-sm"><img src={it.image} alt={it.title} className="h-12 w-12 rounded-lg object-cover" /><div className="flex-1"><div className="font-medium line-clamp-1">{it.title}</div><div className="text-xs">x{it.quantity}</div></div><div>{formatDA(it.price*it.quantity)}</div></div>)}
              {items.length===0 && <p className="text-sm text-slate-500">Panier vide</p>}
            </div>
            {related && related.length>0 && (
              <div className="mt-6 border-t pt-4">
                <div className="text-sm font-semibold">Complétez avec</div>
                <div className="mt-2 space-y-2">
                  {related.slice(0,2).map((p:any)=><Link key={p.id} href={`/shop/${p.slug}`} className="flex gap-2 text-sm border rounded-xl p-2"><img src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1 line-clamp-2">{p.title}</span><span className="font-bold text-teal-700">{formatDA(p.price)}</span></Link>)}
                </div>
              </div>
            )}
            <Link href="/checkout" className="mt-6 block"><Button className="w-full rounded-xl" onClick={()=>setOpen(false)}>Commander</Button></Link>
            <Link href="/cart" className="mt-2 block text-center text-sm text-slate-600" onClick={()=>setOpen(false)}>Voir panier complet</Link>
          </div>
        </div>
      )}
    </>
  )
}
