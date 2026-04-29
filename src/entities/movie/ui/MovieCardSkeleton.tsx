import { Skeleton } from '@/shared/ui/skeleton'

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}
