"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { WILAYAS, formatDA } from "@/lib/utils"
import { placeOrder, validatePromo } from "@/app/actions/orders"
import { getAllWilayaFees } from "@/app/actions/shipping-fee"
import { Truck, Store, CheckCircle2, Tag } from "lucide-react"
import Link from "next/link"
import { Invoice } from "@/components/invoice"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const subtotal = total()
  const [shippingType, setShippingType] = useState<"STOP_DESK" | "A_DOMICILE">("STOP_DESK")
  const [selectedWilaya, setSelectedWilaya] = useState("")
  const [wilayaFees, setWilayaFees] = useState<Record<string, { stopDesk: number; domicile: number }>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [promo, setPromo] = useState("")
  const [promoApplied, setPromoApplied] = useState<{code:string,percent:number}|null>(null)
  const [promoMsg, setPromoMsg] = useState("")

  useEffect(() => { getAllWilayaFees().then(setWilayaFees) }, [])

  function getFee(wilaya: string, type: "STOP_DESK" | "A_DOMICILE") {
    const f = wilayaFees[wilaya]
    if (!f) return type === "A_DOMICILE" ? 600 : 400
    return type === "A_DOMICILE" ? f.domicile : f.stopDesk
  }

  const shippingFee = getFee(selectedWilaya, shippingType)
  const discount = promoApplied ? Math.round(subtotal * promoApplied.percent / 100) : 0
  const grandTotal = subtotal - discount + (items.length ? shippingFee : 0)

  async function applyPromo() {
    setPromoMsg("")
    if (!promo.trim()) return
    const res = await validatePromo(promo)
    if (!res) { setPromoMsg("Code invalide ou expiré"); setPromoApplied(null) }
    else { setPromoApplied({ code: res.code, percent: res.percent }); setPromoMsg(`✓ -${res.percent}% appliqué`) }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!items.length) { setError("Votre panier est vide"); return }
    const fd = new FormData(e.currentTarget)
    const customer = {
      name: String(fd.get("customerName")),
      phone: String(fd.get("phone")),
      wilaya: String(fd.get("wilaya")),
      commune: String(fd.get("commune")),
      address: String(fd.get("address") || ""),
    }
    setLoading(true)
    try {
      const res = await placeOrder({
        customerName: customer.name,
        phone: customer.phone,
        wilaya: customer.wilaya,
        commune: customer.commune,
        address: customer.address,
        shippingType,
        promoCode: promoApplied?.code,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      })
      if ((res as any)?.error) throw new Error((res as any).error)
      setSuccess((res as any).orderId || "Commande créée")
      setSuccessData({ id: (res as any).orderId, total: (res as any).total, discount: (res as any).discount, customer, shippingType, items: [...items] })
      clear()
    } catch (err: any) {
      setError(err.message || "Erreur lors de la commande")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="text-center">
          <CheckCircle2 className="h-14 w-14 mx-auto text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold">Commande confirmée !</h1>
          <p className="text-slate-600 mt-2">Référence : <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded-lg">{success}</span></p>
          <p className="text-sm text-slate-500 mt-2">Conservez ce numéro - il est votre reçu et suivi.</p>
        </div>
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-slate-600">Numéro suivi</span><span className="font-mono font-bold">{success.slice(0,8)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Suivi</span><Link href={`/track/${success}`} className="text-teal-600 underline">/track/{success.slice(0,8)}</Link></div>
            </div>
            {successData && (
              <Invoice
                order={{ id: successData.id, totalAmount: successData.total, shippingFee: getFee(successData.customer.wilaya, shippingType), discount: successData.discount||0, promoCode: promoApplied?.code, shippingType, createdAt: new Date().toISOString() }}
                items={successData.items}
                customer={successData.customer}
              />
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={`/track/${success}`}><Button variant="outline" className="w-full rounded-xl">Suivre commande</Button></Link>
              <Link href="/shop"><Button className="w-full rounded-xl">Continuer</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Finaliser la commande</h1>
      <p className="text-slate-600">Paiement à la livraison — 69 wilayas • Pas de compte requis</p>
      <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
        <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Nom complet *</Label><Input name="customerName" required minLength={3} maxLength={80} placeholder="Ex: Ahmed Salmi" className="mt-1" aria-required="true" /></div>
            <div><Label>Téléphone *</Label><Input name="phone" required pattern="0(5|6|7)[0-9]{8}" title="0555123456 - 10 chiffres commençant par 05/06/07" placeholder="05/06/07 XX XX XX XX" className="mt-1" aria-required="true" inputMode="numeric" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Wilaya *</Label><Select name="wilaya" required defaultValue="" onChange={(e)=>setSelectedWilaya(e.target.value)} className="mt-1"><option value="" disabled>Choisir une wilaya</option>{WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}</Select></div>
            <div><Label>Commune *</Label><Input name="commune" required placeholder="Ex: Bab Ezzouar" className="mt-1" /></div>
          </div>
          {selectedWilaya && wilayaFees[selectedWilaya] && (
            <div className="text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
              Frais pour {selectedWilaya}: Stop Desk {formatDA(wilayaFees[selectedWilaya].stopDesk)} • À Domicile {formatDA(wilayaFees[selectedWilaya].domicile)}
            </div>
          )}
          <div><Label>Adresse (optionnel)</Label><Input name="address" placeholder="Rue, quartier, repère..." className="mt-1" /></div>
          <div>
            <Label>Mode de livraison *</Label>
            <div className="mt-2 grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => setShippingType("STOP_DESK")} className={`rounded-2xl border p-4 text-left transition ${shippingType === "STOP_DESK" ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "bg-white hover:bg-slate-50"}`}>
                <div className="flex items-center gap-3"><span className={`h-10 w-10 rounded-xl flex items-center justify-center ${shippingType === "STOP_DESK" ? "bg-teal-600 text-white" : "bg-slate-100"}`}><Store className="h-5 w-5" /></span><div><div className="font-semibold">Stop Desk</div><div className="text-xs text-slate-600">Retrait bureau Yalidine</div></div><span className="ml-auto font-bold">{formatDA(getFee(selectedWilaya, "STOP_DESK"))}</span></div>
              </button>
              <button type="button" onClick={() => setShippingType("A_DOMICILE")} className={`rounded-2xl border p-4 text-left transition ${shippingType === "A_DOMICILE" ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "bg-white hover:bg-slate-50"}`}>
                <div className="flex items-center gap-3"><span className={`h-10 w-10 rounded-xl flex items-center justify-center ${shippingType === "A_DOMICILE" ? "bg-teal-600 text-white" : "bg-slate-100"}`}><Truck className="h-5 w-5" /></span><div><div className="font-semibold">À Domicile</div><div className="text-xs text-slate-600">Jusqu’à votre porte</div></div><span className="ml-auto font-bold">{formatDA(getFee(selectedWilaya, "A_DOMICILE"))}</span></div>
              </button>
            </div>
          </div>
          <div className="rounded-xl border bg-slate-50 p-3">
            <Label className="flex items-center gap-1"><Tag className="h-4 w-4" /> Code promo (si vous en avez un)</Label>
            <div className="mt-2 flex gap-2">
              <Input value={promo} onChange={(e)=>setPromo(e.target.value)} placeholder="Entrez votre code" className="bg-white" />
              <Button type="button" variant="outline" onClick={applyPromo}>Appliquer</Button>
            </div>
            {promoMsg && <div className={`text-xs mt-1 ${promoApplied ? 'text-emerald-600' : 'text-red-600'}`}>{promoMsg}</div>}
          </div>
          {error && <div role="alert" aria-live="polite" className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <Button type="submit" disabled={loading || items.length === 0} aria-busy={loading} className="w-full rounded-xl h-11 text-base">{loading ? "Traitement..." : `Commander • ${formatDA(grandTotal)}`}</Button>
        </form>
        <div className="rounded-2xl border bg-white p-6 h-fit sticky top-20">
          <h3 className="font-semibold">Votre commande</h3>
          {items.length === 0 ? <p className="text-sm text-slate-500 mt-3">Panier vide</p> : (
            <div className="mt-4 space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="h-12 w-12 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1"><div className="font-medium leading-tight line-clamp-1">{it.title}</div><div className="text-xs text-slate-500">x{it.quantity}</div></div>
                  <div className="font-semibold">{formatDA(it.price * it.quantity)}</div>
                </div>
              ))}
              <div className="border-t pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Sous-total</span><span>{formatDA(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Remise {promoApplied?.code}</span><span>-{formatDA(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-600">Livraison</span><span>{formatDA(shippingFee)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span className="text-teal-700">{formatDA(grandTotal)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
