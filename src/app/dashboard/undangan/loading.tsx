export default function UndanganLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 animate-pulse">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-9 w-52 bg-secondary rounded-lg" />
                    <div className="h-5 w-80 bg-secondary/70 rounded-md" />
                </div>
                <div className="h-11 w-44 bg-secondary rounded-lg" />
            </div>

            {/* Cards grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="p-5 pb-0 flex justify-between">
                            <div className="h-5 w-20 bg-secondary rounded-full" />
                            <div className="h-4 w-28 bg-secondary/70 rounded-md" />
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="h-7 w-40 bg-secondary rounded-md" />
                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/50">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex flex-col items-center gap-1">
                                        <div className="h-4 w-4 bg-secondary rounded" />
                                        <div className="h-4 w-6 bg-secondary rounded" />
                                        <div className="h-3 w-12 bg-secondary/70 rounded" />
                                    </div>
                                ))}
                            </div>
                            {/* Buttons row */}
                            <div className="flex gap-2">
                                <div className="flex-1 h-9 bg-secondary rounded-lg" />
                                <div className="h-9 w-9 bg-secondary rounded-lg" />
                                <div className="h-9 w-9 bg-secondary rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
