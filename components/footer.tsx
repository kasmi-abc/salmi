import Link from "next/link"
import { Stethoscope } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white"><Stethoscope className="h-4 w-4" /></span>
              <span className="font-bold">Salmi Series</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Résumés médicaux d’excellence pour les étudiants en médecine en Algérie. Pneumologie, Gynécologie, Urologie et plus — conçus par des majors.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Boutique</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/shop?category=Pneumologie" className="hover:text-teal-600">Pneumologie</Link></li>
              <li><Link href="/shop?category=Gériatrie" className="hover:text-teal-600">Gériatrie</Link></li>
              <li><Link href="/shop?category=Radiologie" className="hover:text-teal-600">Radiographies thoraciques</Link></li>
              <li><Link href="/shop" className="hover:text-teal-600">Tout voir →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Aide</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Livraison 69 wilayas</li>
              <li>Paiement à la livraison</li>
              <li>Support WhatsApp 7j/7</li>
              <li><Link href="/track" className="hover:text-teal-600">Suivi commande</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-slate-600">Alger, Algérie<br />contact@salmiseries.dz<br /><a href="https://wa.me/213555123456" target="_blank" className="hover:text-teal-600">WhatsApp: +213 555 12 34 56</a><br /><a href="https://www.instagram.com/salmiseries/" target="_blank" rel="noopener" className="hover:text-teal-600 flex items-center gap-1 mt-1">Instagram: @salmiseries</a></p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Salmi Series. Tous droits réservés.</span>
          <span>Fait avec ♥ pour les étudiants en médecine algériens.</span>
        </div>
      </div>
    </footer>
  )
}
