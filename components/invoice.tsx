"use client"
import { formatDA } from "@/lib/utils"

export function Invoice({ order, items, customer }: { order: { id: string, totalAmount: number, shippingFee: number, discount: number, promoCode?: string | null, shippingType: string, createdAt: string }, items: { title: string, price: number, quantity: number }[], customer: { name: string, phone: string, wilaya: string, commune: string, address?: string } }) {
  const print = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const rows = items.map(i=> `<tr><td style="padding:8px;border:1px solid #e2e8f0">${i.title}</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center">${i.quantity}</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right">${formatDA(i.price)}</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right">${formatDA(i.price*i.quantity)}</td></tr>`).join('')
    w.document.write(`<html><head><title>Facture ${order.id.slice(0,8)}</title><style>body{font-family:Inter,system-ui,sans-serif;padding:30px;color:#0f172a} .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0d9488;padding-bottom:15px} .logo{font-weight:800;font-size:18px} .logo span{color:#0d9488} table{width:100%;border-collapse:collapse;margin-top:15px} th{background:#f1f5f9;padding:8px;text-align:left;font-size:12px} .total{margin-top:15px;text-align:right} .box{border:1px solid #e2e8f0;padding:12px;border-radius:10px;background:#f8fafc;margin-top:10px} @media print{ button{display:none}}</style></head><body>
      <div class="header"><div class="logo">Salmi <span>Series</span> <span style="font-size:10px;color:#64748b">Médecine Algérie</span></div><div style="text-align:right"><div style="font-size:12px;color:#64748b">FACTURE / BON DE COMMANDE</div><div style="font-family:monospace;font-weight:700">${order.id}</div><div style="font-size:12px">${new Date(order.createdAt).toLocaleString('fr-DZ')}</div></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:15px">
        <div class="box"><b>Client:</b><br/>${customer.name}<br/>${customer.phone}<br/>${customer.wilaya} - ${customer.commune}<br/>${customer.address||''}</div>
        <div class="box"><b>Livraison:</b> ${order.shippingType==='A_DOMICILE'?'À Domicile':'Stop Desk'}<br/>Frais: ${formatDA(order.shippingFee)}<br/>${order.promoCode?`Promo: ${order.promoCode} (-${formatDA(order.discount)})`:''}<br/><b>Suivi:</b> ${order.id.slice(0,8)}</div>
      </div>
      <table><thead><tr><th>Produit</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="total"><div>Sous-total: ${formatDA(order.totalAmount - order.shippingFee + (order.discount||0))}</div>${order.discount?`<div style="color:#059669">Remise: -${formatDA(order.discount)}</div>`:''}<div>Livraison: ${formatDA(order.shippingFee)}</div><div style="font-size:18px;font-weight:800;color:#0d9488;margin-top:5px">Total: ${formatDA(order.totalAmount)}</div><div style="font-size:11px;color:#64748b">Paiement à la livraison - 58 wilayas</div></div>
      <div style="margin-top:20px;font-size:11px;color:#64748b;text-align:center">Merci pour votre confiance - Salmi Series • contact@salmiseries.dz • +213 5XX XX XX XX<br/>Conservez ce numéro de suivi: <b>${order.id}</b> - Suivi sur /track/${order.id.slice(0,8)}</div>
      <div style="text-align:center;margin-top:15px"><button onclick="window.print()" style="background:#0f172a;color:white;padding:10px 20px;border-radius:999px;border:none;cursor:pointer">Imprimer / Enregistrer PDF</button></div>
    </body></html>`)
    w.document.close()
  }
  return <button onClick={print} className="w-full mt-3 h-10 rounded-xl border bg-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50">🖨️ Imprimer facture / PDF</button>
}
