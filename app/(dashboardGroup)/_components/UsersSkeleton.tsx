export function UsersSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="h-10 animate-pulse rounded-full bg-muted" />
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
