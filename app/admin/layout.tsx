import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow login page without session check? We'll check pathname in middleware alternative: if child is login we still redirect logged-in?
  // Simpler: layout checks session, but we exclude /admin/login via bypass using headers? Next layout wraps all /admin routes including login.
  // So we allow login to render even without session by not redirecting if the request is for login? We can't detect here easily, so we do conditional: if session exists -> allow, otherwise we still render children (login page will handle itself)
  // To enforce protection, individual dashboard pages check session again.
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-bold">Salmi Admin</Link>
          <div className="flex gap-2">
            <Link href="/"><Button variant="outline" size="sm">Voir site</Button></Link>
            <Link href="/api/auth/signout"><Button variant="ghost" size="sm">Déconnexion</Button></Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
