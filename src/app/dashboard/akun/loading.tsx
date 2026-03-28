export default function AkunLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-secondary rounded-lg" />
                <div className="h-4 w-72 bg-secondary/70 rounded-md" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">
                        <div className="space-y-1">
                            <div className="h-5 w-32 bg-secondary rounded-md" />
                            <div className="h-4 w-48 bg-secondary/70 rounded-md" />
                        </div>
                        <div className="space-y-3 pt-2">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="space-y-1">
                                    <div className="h-3 w-24 bg-secondary/70 rounded" />
                                    <div className="h-5 w-40 bg-secondary rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-32 bg-secondary rounded-lg mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
