import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/shop/product-card"
import { Check, Star, Truck, ShieldCheck, BookOpen, Users, Award, ArrowRight, Quote } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof prisma.product.findMany>> = []
  try {
    featured = await prisma.product.findMany({ where: { featured: true }, take: 6, orderBy: { createdAt: 'desc' } })
  } catch {
    featured = []
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Nouveau : Série Cardiologie 2024 disponible
              </div>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Réussis tes <span className="text-teal-600">études médicales</span> avec <br />
                <span className="bg-gradient-to-r from-teal-600 to-sky-500 bg-clip-text text-transparent">Salmi Series</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Des résumés clairs, synthétiques et illustrés pour chaque année — de la 1ère année au Résidanat. Validés par des majors, pour toutes les spécialités — livrés dans les 69 wilayas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/shop"><Button size="lg" className="rounded-full h-12 px-8">Explorer la boutique <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <Link href="#series"><Button variant="outline" size="lg" className="rounded-full h-12">Voir les séries</Button></Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-teal-600" /> Paiement à la livraison</span>
                <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-teal-600" /> 69 wilayas</span>
                <span className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500 fill-amber-500" /> 4.9/5 (1.2k avis)</span>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-3 max-w-md">
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">4k+</div><div className="text-xs text-slate-500">Étudiants</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">98%</div><div className="text-xs text-slate-500">Satisfaction</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">69</div><div className="text-xs text-slate-500">Wilayas</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">12+</div><div className="text-xs text-slate-500">Spécialités</div></CardContent></Card>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto max-w-md rounded-[2rem] bg-white p-4 shadow-2xl border">
                <img src="/pneumologie.jpg" alt="Pneumologie - Salmi Series" className="rounded-2xl aspect-[4/3] object-cover w-full" />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center text-white"><BookOpen className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold text-sm">Pneumologie</div>
                    <div className="text-xs text-slate-500">184 pages • Best-seller</div>
                  </div>
                  <span className="ml-2 font-bold text-teal-700">2 500 DA</span>
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-slate-900 rounded-full px-3 py-1 text-xs font-bold shadow">Stock limité</div>
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-teal-100 to-sky-100 rounded-[2rem] blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Value props */}
      <section className="py-10 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: "Fiches ultra-synthétiques", desc: "L’essentiel sans blabla, tableaux & schémas." },
            { icon: Award, title: "Validé par des majors", desc: "Contenu relu par majors du concours." },
            { icon: Truck, title: "Livraison rapide", desc: "Stop Desk & À Domicile, 69 wilayas." },
            { icon: Users, title: "Communauté 4k+", desc: "Groupe Telegram & support 7j/7." },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0"><f.icon className="h-5 w-5" /></span>
              <div><div className="font-semibold">{f.title}</div><div className="text-sm text-slate-600">{f.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Series quick nav */}
      <section id="series" className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl font-bold">Nos séries médicales</h2>
            <Link href="/shop" className="text-sm font-medium text-teal-700 hover:underline">Voir toute la boutique →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {["Pneumologie","Gériatrie","Radiologie","Gynécologie","Urologie","Cardiologie","Dermatologie","Ophtalmologie"].map((cat) => (
              <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} className="rounded-2xl bg-white border p-4 hover:shadow-md transition text-center">
                <div className="h-10 w-10 mx-auto rounded-xl bg-slate-900 text-white flex items-center justify-center mb-2"><BookOpen className="h-5 w-5" /></div>
                <div className="font-medium text-sm">{cat}</div>
                <div className="text-xs text-slate-500">Résumés</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Best-sellers du moment</h2>
            <Badge>Édition 2024</Badge>
          </div>
          {featured.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
              Base de données non connectée — les produits s’afficheront après <code>prisma db push</code> + <code>seed</code>.
            </div>
          )}
          <div className="mt-8 text-center">
            <Link href="/shop"><Button variant="outline" className="rounded-full">Voir tous les produits</Button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="temoignages" className="py-12 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold mb-2">Ce que disent nos étudiants</h2>
          <p className="text-slate-400 mb-6">Avis vérifiés — livraison & qualité plébiscitées dans toute l’Algérie.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Amira B. — Alger", text: "Résumés incroyables, j’ai gagné un temps fou. Pneumologie ultra claire, schémas parfaits pour l’ECN.", stars: 5 },
              { name: "Yacine M. — Oran", text: "Livraison à domicile en 48h à Oran, emballage soigné. La gynéco m’a sauvé aux EMD !", stars: 5 },
              { name: "Sara K. — Constantine", text: "Le meilleur investissement de mon année. Prix étudiant, qualité pro. Je recommande Salmi les yeux fermés.", stars: 5 },
            ].map((t) => (
              <Card key={t.name} className="bg-white text-slate-900">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">{Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <Quote className="h-5 w-5 text-slate-300 mb-2" />
                  <p className="text-sm leading-relaxed">“{t.text}”</p>
                  <div className="mt-4 text-sm font-semibold">{t.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-teal-600 to-sky-500 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold">Prêt à booster tes révisions ?</h3>
              <p className="text-teal-50 mt-2">Commande aujourd’hui, reçois en 24-72h partout en Algérie. Paiement à la livraison.</p>
              <ul className="mt-3 space-y-1 text-sm text-teal-50">
                <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Livraison Stop Desk & À Domicile</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Support WhatsApp réactif</li>
              </ul>
            </div>
            <Link href="/shop"><Button variant="secondary" size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100">Commander maintenant</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
