export default function AssetsLoading() {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10 animate-pulse">
            <div>
                <div className="h-8 bg-secondary rounded w-48 mb-2" />
                <div className="h-5 bg-secondary rounded w-80" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="h-5 bg-secondary rounded w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-10 bg-secondary rounded" />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card">
                        <div className="aspect-[4/3] bg-secondary rounded-t-2xl" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-secondary rounded w-3/4" />
                            <div className="h-3 bg-secondary rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
