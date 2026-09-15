"use client"
import { useState } from "react"
import Image from "next/image"
export function Lightbox({ src, alt }: { src:string; alt:string }){
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="rounded-2xl overflow-hidden border bg-white cursor-zoom-in group" onClick={()=>setOpen(true)}>
        <div className="relative aspect-[4/3]">
          <Image src={src} alt={alt} fill className="object-cover group-hover:scale-[1.02] transition" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div className="relative max-w-3xl w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" />
            <button onClick={()=>setOpen(false)} className="absolute top-3 right-3 bg-black/60 text-white rounded-full h-8 w-8 flex items-center justify-center">✕</button>
          </div>
        </div>
      )}
    </>
  )
}
