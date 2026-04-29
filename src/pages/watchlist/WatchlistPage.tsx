import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { WatchlistTable } from '@/widgets/WatchlistTable/WatchlistTable'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

export function WatchlistPage() {
  const count = useWatchlistStore((s) => s.entries.length)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Minha Watchlist</h1>
        {count > 0 && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
            {count}
          </span>
        )}
      </div>
      <ErrorBoundary>
        <WatchlistTable />
      </ErrorBoundary>
    </div>
  )
}
