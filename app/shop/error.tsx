"use client"
export default function Error({ reset }: { error: Error, reset: () => void }) {
  return <div className="p-8 text-center"><p className="font-medium">Erreur chargement boutique</p><button onClick={reset} className="mt-3 h-9 px-4 rounded-full border text-sm">Réessayer</button></div>
}
