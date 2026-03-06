export default function Loading() {
    return (
        <div className="p-8 animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-slate-200 rounded-2xl h-64" />
                ))}
            </div>
        </div>
    )
}
