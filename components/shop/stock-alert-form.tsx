"use client"
import { useState } from "react"
import { createStockAlert } from "@/app/actions/alerts"

export function StockAlertForm({ productId }: { productId: string }) {
  const [phone, setPhone] = useState("")
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const fd = new FormData()
    fd.set("productId", productId)
    fd.set("phone", phone)
    const res: any = await createStockAlert(fd)
    setLoading(false)
    if (res?.error) setMsg({ type: "err", text: res.error })
    else setMsg({ type: "ok", text: "✓ تم تسجيل طلبك — سنتصل بك عند توفر المنتج (WhatsApp/SMS)" })
  }

  return (
    <div id="notify" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
      <div className="font-semibold">Rupture temporaire — كن أول من يُبلغ</div>
      <p className="text-xs text-slate-600 mt-1">اترك رقمك وسنعلمك فور عودة المخزون. لا رسائل مزعجة.</p>
      <form onSubmit={onSubmit} className="mt-2 flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="0(5|6|7)[0-9]{8}"
          placeholder="0555 12 34 56"
          className="flex-1 h-9 rounded-xl border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button disabled={loading} className="h-9 rounded-xl bg-amber-500 px-4 text-sm font-bold text-white disabled:opacity-60">
          {loading ? "..." : "M’alerter"}
        </button>
      </form>
      {msg && <div className={`mt-2 text-xs font-medium ${msg.type === "ok" ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</div>}
    </div>
  )
}
