import { ChevronLeft, ChevronRight, Film } from 'lucide-react'
import { useFilterStore } from '@/features/discover/model/filterStore'
import { useMovieSearch } from '@/features/discover/model/useMovieSearch'
import { MovieCard } from '@/entities/movie/ui/MovieCard'
import { MovieCardSkeleton } from '@/entities/movie/ui/MovieCardSkeleton'
import { Button } from '@/shared/ui/button'

interface MovieGridProps {
  page: number
  onPageChange: (page: number) => void
}

export function MovieGrid({ page, onPageChange }: MovieGridProps) {
  const filters = useFilterStore()
  const { data, isPending, isError, error } = useMovieSearch(filters, page)

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Film className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{String(error)}</p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (data.movies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Film className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Nenhum filme encontrado.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= data.totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
