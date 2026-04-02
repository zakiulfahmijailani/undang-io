export default function InvitationsLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="h-8 bg-secondary rounded w-56 mb-2" />
                    <div className="h-5 bg-secondary rounded w-80" />
                </div>
                <div className="h-11 bg-secondary rounded-lg w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between">
                                <div className="h-5 bg-secondary rounded-full w-20" />
                                <div className="h-4 bg-secondary rounded w-28" />
                            </div>
                            <div className="h-7 bg-secondary rounded w-3/4 mt-3" />
                            <div className="grid grid-cols-3 gap-2 py-4 mt-2">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex flex-col items-center gap-1">
                                        <div className="h-4 w-4 bg-secondary rounded" />
                                        <div className="h-4 bg-secondary rounded w-6" />
                                        <div className="h-2 bg-secondary rounded w-10" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <div className="h-9 bg-secondary rounded flex-1" />
                                <div className="h-9 w-9 bg-secondary rounded" />
                                <div className="h-9 w-9 bg-secondary rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
