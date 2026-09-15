import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, ShieldCheck, Truck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">À propos de Salmi Series</h1>
      <p className="text-slate-600 mt-2 leading-relaxed">
        Salmi Series est née d'une idée simple: rendre les résumés médicaux <b>clairs, précis et fidèles au programme officiel algérien</b>. 
        Conçus par des majors du Résidanat et validés par des enseignants du CHU, nos fiches vous font gagner des mois de synthèse.
      </p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><BookOpen className="h-8 w-8 mx-auto text-teal-600" /><div className="font-semibold mt-2">Pédagogie</div><div className="text-sm text-slate-600">Schémas, tableaux, QCM</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Award className="h-8 w-8 mx-auto text-teal-600" /><div className="font-semibold mt-2">Validé</div><div className="text-sm text-slate-600">Par des lauréats</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><ShieldCheck className="h-8 w-8 mx-auto text-teal-600" /><div className="font-semibold mt-2">Confiance</div><div className="text-sm text-slate-600">12k+ étudiants</div></CardContent></Card>
      </div>
      <Card className="mt-6 border-teal-200 bg-teal-50">
        <CardContent className="p-6">
          <h3 className="font-bold">Besoin d'aide ?</h3>
          <p className="text-sm text-slate-600 mt-1">WhatsApp Business disponible 7j/7 - réponse en &lt; 2h</p>
          <a href="https://wa.me/213555123456" target="_blank" className="mt-3 inline-flex rounded-full bg-emerald-500 px-6 py-2 text-sm font-bold text-white">💬 WhatsApp: +213 555 12 34 56</a>
        </CardContent>
      </Card>
    </div>
  )
}
