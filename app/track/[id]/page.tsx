import { prisma } from "@/lib/db"
import { formatDA } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

const STATUS_STEPS = ["PENDING","PROCESSING","SHIPPED","DELIVERED"] as const
const STATUS_LABEL: Record<string,string> = { PENDING: "Commande reçue", PROCESSING: "En préparation", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée" }

export default async function TrackPage({ params }: { params: { id: string } }) {
  let order: any = null
  try { order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } }) } catch {}
  if (!order) return notFound()
  const stepIndex = STATUS_STEPS.indexOf(order.status as any)
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Suivi commande</h1>
      <p className="text-sm text-slate-600 font-mono">{order.id}</p>
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex justify-between text-xs mb-4">
            {STATUS_STEPS.map((s,i)=>(
              <div key={s} className={`flex-1 text-center ${i <= stepIndex ? 'text-teal-600 font-bold' : 'text-slate-400'}`}>
                <div className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center mb-1 ${i <= stepIndex ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>{i+1}</div>
                {STATUS_LABEL[s]}
              </div>
            ))}
          </div>
          {order.trackingNote && <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 text-sm">📦 Suivi transporteur: {order.trackingNote}</div>}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>{order.customerName} • {order.phone}</span><span>{order.wilaya} - {order.commune}</span></div>
            <div className="flex justify-between"><span>Livraison: {order.shippingType === 'A_DOMICILE' ? 'À Domicile' : 'Stop Desk'}</span><span className="font-bold">{formatDA(order.totalAmount)}</span></div>
          </div>
          <div className="mt-4 border-t pt-3 space-y-2">
            {order.items.map((it:any)=><div key={it.id} className="flex justify-between text-sm"><span>{it.title} x{it.quantity}</span><span>{formatDA(it.price*it.quantity)}</span></div>)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
