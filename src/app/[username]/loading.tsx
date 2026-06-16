export default function Loading() {
  return (
    <main className="max-w-app mx-auto px-4">
      <div className="flex items-center justify-between py-4">
        <div className="h-5 w-28 bg-base-border rounded-lg animate-pulse" />
        <div className="h-8 w-28 bg-base-border rounded-xl animate-pulse" />
      </div>

      <div className="card p-5 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-base-border animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-base-border rounded-lg animate-pulse" />
            <div className="h-3 w-24 bg-base-border rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-base-dark rounded-xl animate-pulse" />
          <div className="h-16 bg-base-dark rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <div className="h-3 w-24 bg-base-border rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-base-dark rounded-xl animate-pulse" />)}
        </div>
        <div className="h-11 bg-base-dark rounded-xl animate-pulse" />
        <div className="h-12 bg-base-border rounded-xl animate-pulse" />
      </div>
    </main>
  )
}
