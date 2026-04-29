import { useNavigate } from '@tanstack/react-router'
import { useFilterStore } from '@/features/discover/model/filterStore'
import { useUrlFilters } from '@/features/discover/model/useUrlFilters'
import { SearchBar } from '@/features/discover/ui/SearchBar'
import { FilterPanel } from '@/features/discover/ui/FilterPanel'
import { TrendingHero } from '@/widgets/TrendingHero/TrendingHero'
import { TrendingStrip } from '@/widgets/TrendingStrip/TrendingStrip'
import { MovieGrid } from '@/widgets/MovieGrid/MovieGrid'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

export function DiscoverPage() {
  const { query, genreId, year, minRating } = useFilterStore()
  const navigate = useNavigate()
  const currentPage = useUrlFilters()
  const hasActiveFilters = !!query || genreId !== null || year !== null || minRating !== null

  function handlePageChange(newPage: number) {
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, page: newPage > 1 ? newPage : undefined }),
      replace: false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {!hasActiveFilters && (
        <ErrorBoundary>
          <TrendingHero />
        </ErrorBoundary>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            {hasActiveFilters ? 'Resultados' : 'Descobrir Filmes'}
          </h1>
          <SearchBar />
          <FilterPanel />
        </div>

        <ErrorBoundary>
          {!hasActiveFilters && (
            <div className="mb-10">
              <TrendingStrip />
              <div className="my-8 border-t" />
              <h2 className="mb-4 text-lg font-semibold">Populares</h2>
            </div>
          )}
          <MovieGrid page={currentPage} onPageChange={handlePageChange} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
