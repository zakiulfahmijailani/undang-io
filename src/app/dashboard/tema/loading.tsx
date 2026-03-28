export default function TemaLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 animate-pulse">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-secondary rounded-lg" />
                    <div className="h-4 w-72 bg-secondary/70 rounded-md" />
                </div>
            </div>

            {/* Filter tabs skeleton */}
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 w-24 bg-secondary rounded-full" />
                ))}
            </div>

            {/* Theme grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
                        <div className="h-48 bg-secondary" />
                        <div className="p-4 space-y-2">
                            <div className="h-5 w-32 bg-secondary rounded-md" />
                            <div className="h-4 w-20 bg-secondary/70 rounded-md" />
                            <div className="h-9 w-full bg-secondary rounded-lg mt-3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
