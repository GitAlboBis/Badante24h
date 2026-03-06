export default function Loading() {
    return (
        <div className="p-8 animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-32" />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-slate-200 rounded-xl h-20" />
                ))}
            </div>
        </div>
    )
}
