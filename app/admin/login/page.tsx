"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, ShieldCheck, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(""); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await signIn("credentials", { email: String(fd.get("email")), password: String(fd.get("password")), redirect: false })
    setLoading(false)
    if (res?.error) setError("Identifiants incorrects. Vérifiez le nom et le mot de passe.")
    else if (res?.ok) router.push("/admin")
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left - Brand / Visual */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-sky-600 to-slate-900 opacity-90" />
        <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="h-9 w-9 rounded-xl bg-white text-teal-600 flex items-center justify-center"><Stethoscope className="h-5 w-5" /></span>
            <span className="font-bold text-lg">Salmi Series</span>
            <span className="text-white/60 text-xs ml-2">• Médecine Algérie</span>
          </Link>
        </div>
        <div className="relative p-10 text-white">
          <h1 className="font-display text-3xl font-bold leading-tight">L'administration<br/>au service des<br/><span className="text-teal-200">futurs médecins.</span></h1>
          <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-md">Gérez vos commandes, votre stock et vos étudiants depuis une interface pensée pour la rapidité et la précision. Sécurisée, rapide, et élégante.</p>
          <div className="mt-8 flex gap-6 text-xs">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-300" /> Chiffré</span>
            <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-teal-300" /> Session 1h</span>
          </div>
        </div>
        <div className="relative p-10 text-white/40 text-xs">© {new Date().getFullYear()} Salmi Series — Accès réservé</div>
        {/* Decorative book mock */}
        <div className="absolute -right-10 bottom-20 w-72 h-96 bg-white rounded-2xl shadow-2xl opacity-10 rotate-3 hidden xl:block" />
        <div className="absolute -right-6 bottom-24 w-72 h-96 bg-white rounded-2xl shadow-2xl opacity-20 rotate-6 hidden xl:block flex items-center justify-center">
          <span className="text-slate-900 font-bold">Pneumologie</span>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center px-6 py-10 lg:px-16 bg-slate-50">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center"><Stethoscope className="h-5 w-5" /></span>
            <span className="font-bold">Salmi Series</span>
          </div>

          <div className="bg-white rounded-[24px] border shadow-sm p-7">
            <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4"><Lock className="h-5 w-5" /></div>
            <h2 className="font-display text-xl font-bold">Connexion sécurisée</h2>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre tableau de bord administrateur</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-slate-600">Identifiant</Label>
                <Input name="email" required placeholder="admin123" className="mt-1.5 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" autoComplete="username" />
              </div>
              <div>
                <div className="flex justify-between"><Label className="text-xs font-semibold text-slate-600">Mot de passe</Label><span className="text-xs text-slate-400">1h session</span></div>
                <div className="relative mt-1.5">
                  <Input name="password" type={show ? "text" : "password"} required placeholder="••••••••" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white pr-10" autoComplete="current-password" />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700 flex gap-2"><span>⚠</span> {error}</div>}

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-medium">
                {loading ? "Vérification..." : <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>

              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                <ShieldCheck className="h-3.5 w-3.5" /> Protégé par NextAuth • Chiffrement bcrypt
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">Besoin d'aide ? <a href="https://wa.me/2135XXXXXXXX" className="text-teal-600 hover:underline">Contacter le support</a></p>
          <div className="text-center mt-2"><Link href="/" className="text-xs text-slate-500 hover:text-slate-800">← Retour au site</Link></div>
        </div>
      </div>
    </div>
  )
}
