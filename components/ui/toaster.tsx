"use client"
import { create } from "zustand"

type Toast = { id: string; title: string; description?: string; variant?: "default"|"success"|"error" }
type Store = { toasts: Toast[]; push: (t: Omit<Toast,"id">)=>void; remove: (id:string)=>void }
const useToastStore = create<Store>((set)=>({
  toasts: [],
  push: (t) => {
    const id = Math.random().toString(36).slice(2,8)
    set(s=>({ toasts: [...s.toasts, { ...t, id }]}))
    setTimeout(()=> set(s=>({ toasts: s.toasts.filter(x=>x.id!==id)})), 3000)
  },
  remove: (id) => set(s=>({ toasts: s.toasts.filter(x=>x.id!==id)}))
}))
export function useToast(){ const push = useToastStore(s=>s.push); return { toast: push } }
export function Toaster(){
  const toasts = useToastStore(s=>s.toasts)
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t=>(
        <div key={t.id} className={`pointer-events-auto min-w-[280px] rounded-xl border bg-white px-4 py-3 shadow-lg flex gap-3 items-start ${t.variant==="success"?"border-emerald-200 bg-emerald-50": t.variant==="error"?"border-red-200 bg-red-50":""}`}>
          <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${t.variant==="success"?"bg-emerald-500": t.variant==="error"?"bg-red-500":"bg-teal-500"}`} />
          <div><div className="text-sm font-semibold">{t.title}</div>{t.description && <div className="text-xs text-slate-600">{t.description}</div>}</div>
        </div>
      ))}
    </div>
  )
}
