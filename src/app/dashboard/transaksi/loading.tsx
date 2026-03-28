export default function TransaksiLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-52 bg-secondary rounded-lg" />
                <div className="h-4 w-80 bg-secondary/70 rounded-md" />
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="bg-secondary/50 border-b border-border px-4 py-3 grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-secondary rounded" />
                    ))}
                </div>
                {/* Table rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-4 py-4 grid grid-cols-4 gap-4 border-b border-border/50 last:border-0">
                        <div className="h-4 w-24 bg-secondary/70 rounded" />
                        <div className="h-4 w-20 bg-secondary rounded" />
                        <div className="h-4 w-24 bg-secondary rounded" />
                        <div className="h-5 w-16 bg-secondary rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
