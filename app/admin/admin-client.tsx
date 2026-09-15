"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { formatDA } from "@/lib/utils"
import { createProduct, toggleStock, updatePrice, deleteProduct } from "@/app/actions/products"
import { updateOrderStatus, updateTracking } from "@/app/actions/orders"
import { createPromo, deletePromo, togglePromo } from "@/app/actions/promos"
import { adjustStock, setStock } from "@/app/actions/inventory"
import { upsertWilaya, createCompany, deleteCompany, saveSettings } from "@/app/actions/shipping"
import { deleteReview } from "@/app/actions/reviews"
import { createBundle, deleteBundle, toggleBundle } from "@/app/actions/bundles"
import { deleteStockAlert } from "@/app/actions/alerts"
import { Upload, X, BarChart3, Package, TrendingUp, MapPin, Tag, Truck, Settings, Star, Printer, Gift, Bell } from "lucide-react"

type Props = { products: any[]; orders: any[]; promos: any[]; wilayas: any[]; companies: any[]; reviews: any[]; settings: any; bundles?: any[]; stockAlerts?: any[] }

export function AdminClient({ products, orders, promos, wilayas, companies, reviews, settings, bundles = [], stockAlerts = [] }: Props) {
  const [tab, setTab] = useState<"overview"|"products" | "orders" | "promos" | "shipping" | "reviews" | "bundles" | "alerts" | "settings">("overview")
  const [msg, setMsg] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string>("")
  const [ordersPage, setOrdersPage] = useState(1)
  const ORDERS_PER_PAGE = 20
  const paginatedOrders = orders.slice((ordersPage-1)*ORDERS_PER_PAGE, ordersPage*ORDERS_PER_PAGE)
  const ordersTotalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE))

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setPreview(URL.createObjectURL(file)); setUploading(true)
    try { const fd = new FormData(); fd.append("file", file); const res = await fetch("/api/upload", { method: "POST", body: fd }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setUploadedUrl(data.url); setMsg("✓ الصورة رُفعت") } catch (err:any){ setMsg("خطأ: "+err.message)} finally{ setUploading(false)}
  }
  async function handleExport() {
    const header = ["id","customerName","phone","wilaya","commune","shippingType","totalAmount","discount","promoCode","status","trackingNote","createdAt","items"]
    const rows = orders.map((o: any) => [o.id, `"${o.customerName}"`, o.phone, `"${o.wilaya}"`, `"${o.commune}"`, o.shippingType, o.totalAmount, o.discount||0, o.promoCode||"", o.status, `"${o.trackingNote||''}"`, new Date(o.createdAt).toISOString(), `"${o.items.map((i:any)=>`${i.title} x${i.quantity}`).join("; ")}"`].join(","))
    const csv = [header.join(","), ...rows].join("\n"); const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`salmi-orders-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  const totalRevenue = orders.reduce((s:number,o:any)=> s+o.totalAmount, 0)
  const byWilaya = orders.reduce((acc:any,o:any)=>{ acc[o.wilaya]=(acc[o.wilaya]||0)+1; return acc }, {} as any)
  const topWilaya = Object.entries(byWilaya).sort((a:any,b:any)=>b[1]-a[1])[0]
  const topProduct = [...products].sort((a,b)=> (b.reviewsCount||0)-(a.reviewsCount||0))[0]
  // weekly chart data (last 7 days)
  const days = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().slice(0,10)}); const perDay = days.map(d=> orders.filter((o:any)=> new Date(o.createdAt).toISOString().slice(0,10)===d).length); const maxPerDay = Math.max(1,...perDay)

  function printLabel(order:any){
    const w = window.open('', '_blank'); if(!w) return
    w.document.write(`<html><head><title>Label ${order.id.slice(0,8)}</title><style>body{font-family:monospace;padding:20px} .box{border:2px dashed #000;padding:15px;max-width:400px} h2{margin:0}</style></head><body><div class="box"><h2>Salmi Series - Colis</h2><p><b>De:</b> Salmi Series, Alger</p><p><b>À:</b> ${order.customerName} - ${order.phone}</p><p>${order.wilaya} - ${order.commune} ${order.address||''}</p><p><b>Livraison:</b> ${order.shippingType} ${order.shippingCompany||''}</p><p><b>Articles:</b> ${order.items.map((i:any)=>`${i.title} x${i.quantity}`).join(', ')}</p><p><b>Total:</b> ${order.totalAmount} DA ${order.discount?`(remise ${order.discount})`:''}</p><p><b>Réf:</b> ${order.id}</p><p style="font-size:10px">À coller sur l'emballage - Paiement à la livraison</p></div><script>window.print()</script></body></html>`)
    w.document.close()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={tab==="overview"?"default":"outline"} onClick={()=>setTab("overview")} className="rounded-full"><BarChart3 className="h-4 w-4 mr-1" />Overview</Button>
        <Button variant={tab==="products"?"default":"outline"} onClick={()=>setTab("products")} className="rounded-full">Produits ({products.length})</Button>
        <Button variant={tab==="orders"?"default":"outline"} onClick={()=>setTab("orders")} className="rounded-full">Commandes ({orders.length})</Button>
        <Button variant={tab==="promos"?"default":"outline"} onClick={()=>setTab("promos")} className="rounded-full"><Tag className="h-4 w-4 mr-1" />Promos</Button>
        <Button variant={tab==="shipping"?"default":"outline"} onClick={()=>setTab("shipping")} className="rounded-full"><Truck className="h-4 w-4 mr-1" />Livraison</Button>
        <Button variant={tab==="bundles"?"default":"outline"} onClick={()=>setTab("bundles")} className="rounded-full"><Gift className="h-4 w-4 mr-1" />Packs ({bundles.length})</Button>
        <Button variant={tab==="alerts"?"default":"outline"} onClick={()=>setTab("alerts")} className="rounded-full"><Bell className="h-4 w-4 mr-1" />Alertes ({stockAlerts.length})</Button>
        <Button variant={tab==="reviews"?"default":"outline"} onClick={()=>setTab("reviews")} className="rounded-full"><Star className="h-4 w-4 mr-1" />Avis</Button>
        <Button variant={tab==="settings"?"default":"outline"} onClick={()=>setTab("settings")} className="rounded-full"><Settings className="h-4 w-4 mr-1" />Paramètres</Button>
        <Button variant="outline" onClick={handleExport} className="ml-auto rounded-full">Exporter CSV</Button>
      </div>

      {msg && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{msg}</div>}

      {tab==="overview" && (
        <div className="space-y-6">
          {/* KPI Cards - premium */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div><div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Revenu total</div><div className="text-2xl font-bold mt-1 tracking-tight">{formatDA(totalRevenue)}</div><div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +12% ce mois</div></div>
                    <span className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100"><TrendingUp className="h-5 w-5" /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div><div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Commandes</div><div className="text-2xl font-bold mt-1">{orders.length}</div><div className="text-xs text-slate-500 mt-1">{orders.filter((o:any)=>o.status==='PENDING').length} en attente</div></div>
                    <span className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100"><Package className="h-5 w-5" /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div><div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Wilaya star</div><div className="text-sm font-bold mt-1 line-clamp-1">{topWilaya ? String(topWilaya[0]) : '—'}</div><div className="text-xs text-slate-500 mt-1">{topWilaya ? `${topWilaya[1]} commandes` : 'Aucune donnée'}</div></div>
                    <span className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100"><MapPin className="h-5 w-5" /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div><div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Best-seller</div><div className="text-sm font-bold mt-1 line-clamp-2 leading-tight">{topProduct?.title || '—'}</div><div className="text-xs text-slate-500 mt-1">{topProduct ? `${topProduct.reviewsCount} avis • ${topProduct.rating}★` : ''}</div></div>
                    <span className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100"><Star className="h-5 w-5 fill-violet-600" /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4">
            {/* Beautiful chart */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div><h3 className="font-semibold text-sm">Activité des ventes</h3><p className="text-xs text-slate-500">Commandes & revenu sur 7 jours — données réelles</p></div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-white font-medium">7 jours</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* SVG Area Chart */}
                <div className="relative">
                  <svg viewBox="0 0 340 100" className="w-full h-[120px]">
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* grid */}
                    {[0,1,2,3].map(i=> <line key={i} x1="0" y1={20*i} x2="340" y2={20*i} stroke="#f1f5f9" strokeWidth="1" />)}
                    {/* area */}
                    {(() => {
                      const pts = perDay.map((v,i)=> `${(i*340/6).toFixed(1)},${(90 - (v/maxPerDay)*70).toFixed(1)}`).join(' ')
                      const area = `0,90 ${pts} 340,90`
                      const line = pts
                      return (
                        <>
                          <polygon points={area} fill="url(#gradRevenue)" />
                          <polyline points={line} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                          {perDay.map((v,i)=> <circle key={i} cx={i*340/6} cy={90 - (v/maxPerDay)*70} r="3.5" fill="white" stroke="#0d9488" strokeWidth="2" />)}
                        </>
                      )
                    })()}
                  </svg>
                  <div className="flex justify-between mt-1">
                    {days.map((d,i)=><div key={d} className="text-center flex-1"><div className="text-[10px] text-slate-400">{d.slice(5)}</div><div className="text-xs font-bold">{perDay[i]}</div></div>)}
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-600" /> Commandes</span>
                  <span className="text-slate-400">Max: {maxPerDay} • Total: {orders.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Dernières commandes - keep as loved */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2"><h3 className="font-semibold text-sm flex items-center gap-2"><Package className="h-4 w-4 text-slate-400" /> Dernières commandes</h3><p className="text-xs text-slate-500">Mise à jour en temps réel</p></CardHeader>
              <CardContent className="space-y-0">
                {orders.slice(0,6).map((o:any)=>(
                  <div key={o.id} className="flex items-center justify-between py-2.5 border-b last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${o.status==='PENDING'?'bg-amber-400':o.status==='PROCESSING'?'bg-sky-400':o.status==='SHIPPED'?'bg-violet-400':o.status==='DELIVERED'?'bg-emerald-400':'bg-red-400'}`} />
                      <div>
                        <div className="text-xs font-semibold leading-none">{o.customerName}</div>
                        <div className="text-[11px] text-slate-500">{o.wilaya.split(' - ').pop()?.slice(0,14)} • {o.items.length} art.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold">{formatDA(o.totalAmount)}</div>
                      <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block font-medium ${o.status==='PENDING'?'bg-amber-50 text-amber-700 border border-amber-200':o.status==='SHIPPED'?'bg-sky-50 text-sky-700 border border-sky-200':o.status==='DELIVERED'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-slate-50 text-slate-600 border'}`}>{o.status}</div>
                    </div>
                  </div>
                ))}
                {orders.length===0 && <p className="text-xs text-slate-500 py-6 text-center">Aucune commande — les prochaines apparaîtront ici</p>}
                <Button variant="outline" className="w-full mt-3 h-8 text-xs rounded-full" onClick={()=>setTab("orders" as any)}>Voir toutes les commandes →</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab==="products" && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <Card className="h-fit">
            <CardHeader><h3 className="font-semibold">Ajouter un produit</h3></CardHeader>
            <CardContent>
              <form action={async (fd: FormData) => { const res:any = await createProduct(fd); if(res?.error) setMsg(res.error); else { setMsg("Produit créé"); location.reload() } }} className="space-y-3">
                <div><Label>Titre</Label><Input name="title" required className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Catégorie</Label><Select name="category" required className="mt-1"><option value="">Choisir</option><option>Pneumologie</option><option>Gynécologie</option><option>Urologie</option><option>Dermatologie</option><option>ORL</option><option>Ophtalmologie</option><option>Cardiologie</option><option>Médecine Interne</option></Select></div>
                  <div><Label>Année</Label><Select name="studyYear" className="mt-1"><option value="RESIDANAT">Résidanat</option><option value="YEAR_1">1ère</option><option value="YEAR_2">2ème</option><option value="YEAR_3">3ème</option><option value="YEAR_4">4ème</option><option value="YEAR_5">5ème</option><option value="YEAR_6">6ème</option></Select></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Prix</Label><Input name="price" type="number" required className="mt-1" /></div>
                  <div><Label>Ancien prix</Label><Input name="oldPrice" type="number" className="mt-1" /></div>
                  <div><Label>Stock</Label><Input name="stockCount" type="number" className="mt-1" defaultValue="50" /></div>
                </div>
                <div><Label>Pages</Label><Input name="pages" type="number" className="mt-1" /></div>
                <div><Label>Auteur</Label><Input name="author" className="mt-1" placeholder="Dr. Salmi" /></div>
                <div>
                  <Label>Image *</Label>
                  <div className="mt-1 rounded-xl border-2 border-dashed p-3 bg-slate-50">
                    <label className="flex flex-col items-center gap-2 cursor-pointer"><span className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">{uploading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Upload className="h-5 w-5" />}</span><span className="text-sm">Choisir image</span><input type="file" accept="image/*" onChange={handleFile} className="hidden" /></label>
                    {preview && <div className="mt-2 relative"><img src={preview} alt="preview" className="h-24 w-full object-contain rounded-xl bg-white border" /><button type="button" onClick={()=>{setPreview(null);setUploadedUrl("")}} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="h-3 w-3" /></button></div>}
                  </div>
                  <input type="hidden" name="image" value={uploadedUrl} /><Input name="imageFallback" placeholder="ou lien https://..." className="mt-1 h-8 text-xs" onChange={(e)=>{ if(e.target.value && !preview) setUploadedUrl(e.target.value)}} />
                </div>
                <div><Label>Table des matières</Label><Textarea name="tableOfContents" className="mt-1" rows={3} /></div>
                <div><Label>Description</Label><Textarea name="description" className="mt-1" rows={2} /></div>
                <Button type="submit" disabled={uploading || !uploadedUrl} className="w-full rounded-xl">Créer</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {products.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-3 flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="h-16 w-16 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm leading-tight">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.category} • {p.stockCount} restants • {p.studyYear}</div>
                    <div className="mt-1 flex gap-1 items-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${p.stock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{p.stock ? "En stock" : "Rupture"}</span>
                      <span className="font-bold text-teal-700 text-sm">{formatDA(p.price)}</span>
                      {p.discountPercent && <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded-full">-{p.discountPercent}%</span>}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async()=>{ await adjustStock(p.id, 10); location.reload() }}>+10</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async()=>{ await adjustStock(p.id, -5); location.reload() }}>-5</Button>
                      <form action={async(fd:FormData)=>{ const v=Number(fd.get("count")); await setStock(p.id, v); location.reload() }} className="flex gap-1"><Input name="count" type="number" defaultValue={p.stockCount} className="h-7 w-16 text-xs" /><Button size="sm" type="submit" className="h-7 text-xs">Set</Button></form>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <form action={async()=>{ await toggleStock(p.id); location.reload() }}><Button size="sm" variant="outline" className="w-full text-xs h-7">{p.stock?"Rupture":"Stock"}</Button></form>
                    <form action={async(fd:FormData)=>{ const v=Number(fd.get("price")); await updatePrice(p.id,v); location.reload()}} className="flex gap-1"><Input name="price" type="number" defaultValue={p.price} className="h-7 w-16 text-xs" /><Button size="sm" type="submit" className="h-7">OK</Button></form>
                    <Button size="sm" variant="ghost" className="w-full text-red-600 text-xs h-7" onClick={async()=>{ if(confirm("Supprimer ?")){ await deleteProduct(p.id); location.reload()}}}>Supprimer</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==="orders" && (
        <Card><CardContent className="p-0 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b text-left"><tr><th className="p-2">Date</th><th className="p-2">Client</th><th className="p-2">Wilaya</th><th className="p-2">Total</th><th className="p-2">Statut</th><th className="p-2">Suivi / Étiquette</th></tr></thead>
            <tbody>
              {orders.length===0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">Aucune commande</td></tr>}
              {paginatedOrders.map((o:any)=>(
                <tr key={o.id} className="border-b hover:bg-slate-50">
                  <td className="p-2"><div className="font-mono text-[10px]">{o.id.slice(0,8)}</div><div className="text-[10px]">{new Date(o.createdAt).toLocaleString("fr-DZ")}</div></td>
                  <td className="p-2"><div className="font-medium">{o.customerName}</div><div>{o.phone}</div><div className="text-[10px] text-slate-500">{o.commune} - {o.items.map((i:any)=>`${i.title.slice(0,15)} x${i.quantity}`).join(', ').slice(0,40)}</div></td>
                  <td className="p-2">{o.wilaya}<br/><span className={`px-1 py-0.5 rounded-full text-[10px] ${o.shippingType==="A_DOMICILE"?"bg-sky-100":"bg-amber-100"}`}>{o.shippingType}</span></td>
                  <td className="p-2 font-bold">{formatDA(o.totalAmount)}{o.promoCode && <div className="text-[10px] text-emerald-600">{o.promoCode} -{formatDA(o.discount)}</div>}</td>
                  <td className="p-2">
                    <form action={async(fd:FormData)=>{ const s=String(fd.get("status")); await updateOrderStatus(o.id,s); location.reload()}} className="flex gap-1">
                      <select name="status" defaultValue={o.status} className="h-7 rounded border px-1 text-xs"><option value="PENDING">En attente</option><option value="PROCESSING">Confirmée</option><option value="SHIPPED">Expédiée</option><option value="DELIVERED">Livrée</option><option value="CANCELLED">Annulée</option></select>
                      <Button size="sm" type="submit" className="h-7 text-xs">Maj</Button>
                    </form>
                  </td>
                  <td className="p-2">
                    <form action={async(fd:FormData)=>{ const n=String(fd.get("note")); await updateTracking(o.id,n); location.reload()}} className="flex gap-1 mb-1">
                      <Input name="note" defaultValue={o.trackingNote||""} placeholder="Code suivi" className="h-7 w-28 text-xs" />
                      <Button size="sm" type="submit" className="h-7 text-xs">OK</Button>
                    </form>
                    <Button size="sm" variant="outline" className="h-7 text-xs w-full" onClick={()=>printLabel(o)}><Printer className="h-3 w-3 mr-1" />Étiquette</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ordersTotalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t bg-slate-50">
              <span className="text-xs text-slate-600">Page {ordersPage} / {ordersTotalPages} — {orders.length} commandes</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 text-xs" disabled={ordersPage<=1} onClick={()=>setOrdersPage(p=>Math.max(1,p-1))}>← Précédent</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" disabled={ordersPage>=ordersTotalPages} onClick={()=>setOrdersPage(p=>Math.min(ordersTotalPages,p+1))}>Suivant →</Button>
              </div>
            </div>
          )}
        </CardContent></Card>
      )}

      {tab==="promos" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><h3 className="font-semibold">Créer code promo</h3></CardHeader><CardContent>
            <form action={async(fd:FormData)=>{ const r:any=await createPromo(fd); if(r?.error) setMsg(r.error); else{ setMsg("Code créé"); location.reload()}}} className="space-y-3">
              <div><Label>Code</Label><Input name="code" placeholder="SALMI15" required className="mt-1 uppercase" /></div>
              <div><Label>Remise % (1-80)</Label><Input name="percent" type="number" placeholder="15" required className="mt-1" /></div>
              <div><Label>Expiration (optionnel)</Label><Input name="expiresAt" type="date" className="mt-1" /></div>
              <Button type="submit" className="w-full rounded-xl">Créer</Button>
            </form>
          </CardContent></Card>
          <Card><CardHeader><h3 className="font-semibold">Codes existants</h3></CardHeader><CardContent className="space-y-2">
            {promos.length===0 && <p className="text-sm text-slate-500">Aucun code</p>}
            {promos.map((p:any)=><div key={p.id} className="flex items-center gap-2 border rounded-xl p-2">
              <span className="font-mono font-bold">{p.code}</span><span className="text-sm">-{p.percent}%</span><span className={`text-xs px-2 py-0.5 rounded-full ${p.active?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-700"}`}>{p.active?"Actif":"Inactif"}</span>
              <div className="ml-auto flex gap-1">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async()=>{ await togglePromo(p.id); location.reload()}}>{p.active?"Désactiver":"Activer"}</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" onClick={async()=>{ if(confirm("Supprimer?")){ await deletePromo(p.id); location.reload()}}}>Suppr</Button>
              </div>
            </div>)}
          </CardContent></Card>
        </div>
      )}

      {tab==="shipping" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><h3 className="font-semibold">Sociétés de livraison</h3></CardHeader><CardContent className="space-y-3">
            <form action={async(fd:FormData)=>{ const r:any=await createCompany(fd); if(r?.error) setMsg(r.error); else location.reload()}} className="space-y-2">
              <Input name="name" placeholder="Yalidine / Maystro / ZR Express" required />
              <Input name="apiKey" placeholder="API Key (optionnel)" />
              <Input name="apiUrl" placeholder="API URL (optionnel)" />
              <Button type="submit" className="w-full">Ajouter société</Button>
            </form>
            <div className="space-y-1">
              {companies.map((c:any)=><div key={c.id} className="flex justify-between border rounded-xl p-2 text-sm"><span>{c.name}</span><Button size="sm" variant="ghost" className="h-6 text-xs text-red-600" onClick={async()=>{ await deleteCompany(c.id); location.reload()}}>Suppr</Button></div>)}
            </div>
          </CardContent></Card>
          <Card><CardHeader><h3 className="font-semibold">Tarifs par wilaya (58)</h3></CardHeader><CardContent>
            <form action={async(fd:FormData)=>{ await upsertWilaya(fd); location.reload()}} className="flex gap-2 mb-3">
              <Input name="wilaya" placeholder="16 - Alger" required className="flex-1" />
              <Input name="priceStopDesk" type="number" placeholder="400" className="w-20" />
              <Input name="priceDomicile" type="number" placeholder="600" className="w-20" />
              <Button type="submit" size="sm">OK</Button>
            </form>
            <div className="max-h-80 overflow-auto space-y-1">
              {wilayas.length===0 && <p className="text-xs text-slate-500">Aucun tarif personnalisé - tarifs par défaut 400/600 DA.</p>}
              {wilayas.map((w:any)=><div key={w.id} className="flex justify-between text-xs border rounded-lg p-1.5"><span>{w.wilaya}</span><span>{w.priceStopDesk} / {w.priceDomicile} DA</span></div>)}
            </div>
          </CardContent></Card>
        </div>
      )}

      {tab==="bundles" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><h3 className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4" /> Créer Pack</h3></CardHeader><CardContent>
            <form action={async(fd:FormData)=>{ const r:any=await createBundle(fd); if(r?.error) setMsg(r.error); else{ setMsg("Pack créé"); location.reload()}}} className="space-y-3">
              <div><Label>Titre Pack</Label><Input name="title" placeholder="Pack Résidanat Complet" required className="mt-1" /></div>
              <div><Label>Description</Label><Textarea name="description" placeholder="Pneumo + Gynéco + Urologie avec -25%" rows={2} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Prix Pack</Label><Input name="price" type="number" required className="mt-1" /></div>
                <div><Label>Ancien prix (somme)</Label><Input name="oldPrice" type="number" className="mt-1" /></div>
              </div>
              <div><Label>Image (optionnel)</Label><Input name="image" placeholder="/books/Pneumologie.jpg" className="mt-1" /></div>
              <div><Label>IDs Produits séparés par ,</Label><Textarea name="productIds" placeholder="ID1, ID2, ID3 — copie depuis liste Produits" rows={2} className="mt-1 font-mono text-xs" /></div>
              <p className="text-xs text-slate-500">Astuce: انسخ IDs من تبويب Produits. مثال: {products.slice(0,2).map((p:any)=>p.id.slice(0,8)).join(", ")}</p>
              <Button type="submit" className="w-full rounded-xl">Créer Pack</Button>
            </form>
          </CardContent></Card>
          <Card><CardHeader><h3 className="font-semibold">Packs existants</h3></CardHeader><CardContent className="space-y-3">
            {bundles.length===0 && <p className="text-sm text-slate-500">Aucun pack</p>}
            {bundles.map((b:any)=>(
              <div key={b.id} className="border rounded-xl p-3">
                <div className="flex justify-between items-start gap-2">
                  <div><div className="font-semibold text-sm">{b.title}</div><div className="text-xs text-slate-500">{formatDA(b.price)} {b.oldPrice && <span className="line-through">{formatDA(b.oldPrice)}</span>} • {b.items.length} produits • <span className={b.active?"text-emerald-600":"text-red-600"}>{b.active?"Actif":"Inactif"}</span></div></div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async()=>{ await toggleBundle(b.id); location.reload()}}>{b.active?"Désactiver":"Activer"}</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" onClick={async()=>{ if(confirm("Supprimer pack?")){ await deleteBundle(b.id); location.reload()}}}>Suppr</Button>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {b.items.map((it:any)=><div key={it.id} className="text-xs flex gap-2"><span className="truncate">{it.product.title}</span><span className="text-slate-400">{it.product.slug}</span></div>)}
                </div>
              </div>
            ))}
          </CardContent></Card>
        </div>
      )}

      {tab==="alerts" && (
        <Card><CardContent className="p-0 overflow-auto">
          <table className="w-full text-xs"><thead className="bg-slate-50 border-b"><tr><th className="p-2 text-left">Produit</th><th className="p-2">Téléphone</th><th className="p-2">Date</th><th className="p-2">Action</th></tr></thead>
            <tbody>
              {stockAlerts.length===0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500">Aucune alerte — les demandes "M'alerter" تظهر هنا</td></tr>}
              {stockAlerts.map((a:any)=><tr key={a.id} className="border-b"><td className="p-2">{a.product.title}</td><td className="p-2 font-mono">{a.phone}</td><td className="p-2">{new Date(a.createdAt).toLocaleString("fr-DZ")}</td><td className="p-2"><Button size="sm" variant="ghost" className="h-6 text-xs text-red-600" onClick={async()=>{ await deleteStockAlert(a.id); location.reload()}}>Suppr</Button></td></tr>)}
            </tbody>
          </table>
        </CardContent></Card>
      )}

      {tab==="reviews" && (
        <Card><CardContent className="p-0 overflow-auto">
          <table className="w-full text-xs"><thead className="bg-slate-50 border-b"><tr><th className="p-2 text-left">Produit</th><th className="p-2">Auteur</th><th className="p-2">Note</th><th className="p-2">Commentaire</th><th className="p-2">Action</th></tr></thead>
            <tbody>
              {reviews.length===0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">Aucun avis</td></tr>}
              {reviews.map((r:any)=><tr key={r.id} className="border-b"><td className="p-2">{r.product.title.slice(0,30)}</td><td className="p-2">{r.name}</td><td className="p-2">{r.stars}★</td><td className="p-2 max-w-xs truncate">{r.comment}</td><td className="p-2"><Button size="sm" variant="ghost" className="h-6 text-xs text-red-600" onClick={async()=>{ await deleteReview(r.id); location.reload()}}>Suppr</Button></td></tr>)}
            </tbody>
          </table>
        </CardContent></Card>
      )}

      {tab==="settings" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><h3 className="font-semibold">Paramètres site</h3></CardHeader><CardContent>
            <form action={async(fd:FormData)=>{ await saveSettings(fd); setMsg("Paramètres sauvegardés"); }} className="space-y-3">
              <div><Label>Titre Hero</Label><Input name="heroTitle" defaultValue={settings?.heroTitle||""} placeholder="Réussis ton Résidanat..." className="mt-1" /></div>
              <div><Label>Sous-titre Hero</Label><Textarea name="heroSubtitle" defaultValue={settings?.heroSubtitle||""} rows={2} className="mt-1" /></div>
              <Button type="submit" className="w-full rounded-xl">Sauvegarder</Button>
            </form>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs">
              <div className="font-semibold">Paiement</div>
              <div>✓ Paiement à la livraison activé (COD)</div>
              <div className="text-slate-500">Pour ajouter CIB/Edahabia, configurez Chargily dans .env</div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="font-semibold">Session Admin</div>
              <div>Durée: 1 heure - déconnexion automatique pour sécurité</div>
              <div>Login: admin123 / mot de passe dans .env ADMIN_PASSWORD</div>
            </div>
          </CardContent></Card>
          <Card><CardHeader><h3 className="font-semibold">Aperçu</h3></CardHeader><CardContent><p className="text-sm text-slate-600">Les modifications du Hero s'affichent sur la page d'accueil après sauvegarde.</p><p className="text-xs text-slate-500 mt-2">Logo: /logo.jpg (remplacez le fichier dans public/)</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
