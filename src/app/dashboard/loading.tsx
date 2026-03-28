export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10 pt-2">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-5 w-72 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card p-6 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Invitations section skeleton */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="h-7 w-40 bg-muted animate-pulse rounded-xl" />
          <div className="h-4 w-56 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-muted animate-pulse rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-36 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-muted animate-pulse rounded-xl" />
                <div className="h-10 bg-muted animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
