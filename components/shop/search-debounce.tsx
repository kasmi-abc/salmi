"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function SearchDebounce({ initialQ }: { initialQ?: string }){
  const [q, setQ] = useState(initialQ||"")
  const router = useRouter()
  const sp = useSearchParams()
  useEffect(()=>{
    const t = setTimeout(()=>{
      const params = new URLSearchParams(sp.toString())
      if(q) params.set("q", q)
      else params.delete("q")
      params.delete("page")
      router.push(`/shop?${params.toString()}`)
    }, 450)
    return ()=> clearTimeout(t)
  }, [q])
  return (
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher un résumé..." className="h-10 rounded-xl border px-3 text-sm w-64 focus:ring-2 focus:ring-teal-500 outline-none" />
  )
}
