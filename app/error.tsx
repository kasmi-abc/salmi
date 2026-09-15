"use client"
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h2 className="text-xl font-bold">Une erreur est survenue</h2>
      <p className="text-sm text-slate-600 mt-2">{error.message || "Erreur inattendue"}</p>
      <button onClick={() => reset()} className="mt-6 h-10 px-6 rounded-xl bg-slate-900 text-white text-sm">Réessayer</button>
    </div>
  )
}
