export function MyRentalRequestsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border sm:flex-row"
        >
          <div className="h-44 w-full animate-pulse bg-muted sm:h-40 sm:w-52" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="mt-auto h-9 w-32 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
