export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-6" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({length:8}).map((_,i)=>(
          <div key={i} className="rounded-2xl border p-4 space-y-3 animate-pulse">
            <div className="h-40 bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
