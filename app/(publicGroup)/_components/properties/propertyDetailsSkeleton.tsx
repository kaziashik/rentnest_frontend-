import { Skeleton } from "@/components/ui/skeleton";

export function PropertyDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-96 w-full rounded-xl" />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-5 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}