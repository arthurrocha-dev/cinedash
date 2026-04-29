import { useState } from 'react'
import { SearchBar } from '@/features/discover/ui/SearchBar'
import { FilterPanel } from '@/features/discover/ui/FilterPanel'
import { MovieGrid } from '@/widgets/MovieGrid/MovieGrid'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

export function DiscoverPage() {
  const [page, setPage] = useState(1)

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Descobrir Filmes</h1>
        <SearchBar />
        <FilterPanel />
      </div>

      <ErrorBoundary>
        <MovieGrid page={page} onPageChange={handlePageChange} />
      </ErrorBoundary>
    </div>
  )
}
