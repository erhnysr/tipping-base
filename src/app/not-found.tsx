import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-6xl text-base-blue mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
        <p className="text-base-muted text-sm mb-8">This builder hasn't registered yet.</p>
        <Link href="/" className="bg-base-blue text-white px-6 py-3 rounded-xl font-semibold text-sm btn-glow">
          Back to home
        </Link>
      </div>
    </main>
  )
}
