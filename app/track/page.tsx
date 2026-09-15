"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Package, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function TrackLandingPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center">
        <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto"><Package className="h-6 w-6" /></div>
        <h1 className="font-display text-2xl font-bold mt-4">Suivi de commande</h1>
        <p className="text-slate-600 text-sm mt-1">Entrez le code reçu après votre commande</p>
      </div>
      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={(e)=>{ e.preventDefault(); const v=code.trim(); if(v) router.push(`/track/${v}`) }} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Ex: clx9a8b2 ou ID complet" className="w-full h-11 rounded-xl border bg-slate-50 pl-10 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600" required />
            </div>
            <Button type="submit" className="h-11 rounded-xl px-6">Suivre</Button>
          </form>
          <p className="text-xs text-slate-500 mt-3">Le code figure sur la page de confirmation. Vous pouvez coller l'ID complet.</p>
        </CardContent>
      </Card>
      <div className="mt-6 grid md:grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center"><Truck className="h-6 w-6 mx-auto text-teal-600" /><div className="font-semibold text-sm mt-2">69 wilayas</div><div className="text-xs text-slate-500">24-72h</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><ShieldCheck className="h-6 w-6 mx-auto text-teal-600" /><div className="font-semibold text-sm mt-2">Paiement à la livraison</div><div className="text-xs text-slate-500">Sécurisé</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Package className="h-6 w-6 mx-auto text-teal-600" /><div className="font-semibold text-sm mt-2">Support WhatsApp</div><div className="text-xs text-slate-500">7j/7</div></CardContent></Card>
      </div>
      <div className="text-center mt-6"><Link href="/shop" className="text-sm text-slate-500 hover:text-slate-800">← Retour boutique</Link></div>
    </div>
  )
}
