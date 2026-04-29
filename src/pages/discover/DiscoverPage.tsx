import { useState } from 'react'
import { useFilterStore } from '@/features/discover/model/filterStore'
import { SearchBar } from '@/features/discover/ui/SearchBar'
import { FilterPanel } from '@/features/discover/ui/FilterPanel'
import { TrendingHero } from '@/widgets/TrendingHero/TrendingHero'
import { TrendingStrip } from '@/widgets/TrendingStrip/TrendingStrip'
import { MovieGrid } from '@/widgets/MovieGrid/MovieGrid'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

export function DiscoverPage() {
  const [page, setPage] = useState(1)
  const { query, genreId, year, minRating } = useFilterStore()
  const hasActiveFilters = !!query || genreId !== null || year !== null || minRating !== null

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero com trending — oculto quando filtros ativos */}
      {!hasActiveFilters && (
        <ErrorBoundary>
          <TrendingHero />
        </ErrorBoundary>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Busca e filtros */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {hasActiveFilters ? 'Resultados' : 'Descobrir Filmes'}
            </h1>
          </div>
          <SearchBar />
          <FilterPanel />
        </div>

        <ErrorBoundary>
          {/* Trending strip — apenas na view inicial sem filtros */}
          {!hasActiveFilters && (
            <div className="mb-10">
              <TrendingStrip />
              <div className="my-8 border-t" />
              <h2 className="mb-4 text-lg font-semibold">Populares</h2>
            </div>
          )}
          <MovieGrid page={page} onPageChange={handlePageChange} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
