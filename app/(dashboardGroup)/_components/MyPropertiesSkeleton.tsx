export function MyPropertiesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border bg-card">
            <div className="h-44 animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-9 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
