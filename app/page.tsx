export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="size-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-white text-3xl font-bold">B</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Badante24h
        </h1>
        <p className="text-lg text-slate-500 max-w-md">
          Trova badanti e caregiver qualificati nella tua zona
        </p>
      </div>
    </main>
  )
}
