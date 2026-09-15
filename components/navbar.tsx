"use client"
import Link from "next/link"
import { ShoppingBag, Menu, Stethoscope, X } from "lucide-react"
import { useCart } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Navbar() {
  const count = useCart((s) => s.count())
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">Salmi <span className="text-teal-600">Series</span></span>
          <span className="hidden sm:inline-flex ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">Médecine Algérie</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-teal-600 transition">Accueil</Link>
          <Link href="/shop" className="hover:text-teal-600 transition">Boutique</Link>
          <Link href="/bundles" className="hover:text-teal-600 transition">Packs</Link>
          <Link href="/track" className="hover:text-teal-600 transition">Suivi</Link>
          <Link href="/#temoignages" className="hover:text-teal-600 transition">Avis</Link>
          <Link href="/admin" className="text-slate-500 hover:text-slate-900">Admin</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-slate-50">
            <ShoppingBag className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/shop" className="hidden sm:inline-flex h-10 px-6 items-center justify-center rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700">
            Acheter
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setOpen(false)} className="block">Accueil</Link>
          <Link href="/shop" onClick={() => setOpen(false)} className="block">Boutique</Link>
          <Link href="/bundles" onClick={() => setOpen(false)} className="block">Packs</Link>
          <Link href="/track" onClick={() => setOpen(false)} className="block">Suivi commande</Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="block">Panier</Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block text-slate-500">Admin</Link>
        </div>
      )}
    </header>
  )
}
