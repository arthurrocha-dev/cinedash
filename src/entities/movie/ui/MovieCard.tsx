import { Link } from '@tanstack/react-router'
import { Star, BookmarkPlus, BookmarkCheck } from 'lucide-react'
import { posterUrl } from '@/shared/api/tmdb.endpoints'
import { formatYear, formatRating } from '@/shared/utils/formatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { queryClient } from '@/shared/lib/queryClient'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { MovieSummary } from '../model/movie.types'

interface MovieCardProps {
  movie: MovieSummary
}

export function MovieCard({ movie }: MovieCardProps) {
  const { add, remove, has } = useWatchlistStore()
  const inWatchlist = has(movie.id)
  const poster = posterUrl(movie.posterPath, 'w342')

  function toggleWatchlist(e: React.MouseEvent) {
    e.preventDefault()
    if (inWatchlist) {
      remove(movie.id)
    } else {
      add(movie)
    }
  }

  function prefetchDetail() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.movies.detail(movie.id),
      staleTime: 1000 * 60 * 10,
    })
  }

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: String(movie.id) }}
      onMouseEnter={prefetchDetail}
      aria-label={`${movie.title} (${formatYear(movie.releaseDate)}) — nota ${formatRating(movie.voteAverage)}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Sem imagem
          </div>
        )}
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleWatchlist}
          aria-label={inWatchlist ? 'Remover da watchlist' : 'Adicionar à watchlist'}
          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {inWatchlist ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">{movie.title}</h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{formatYear(movie.releaseDate)}</span>
          <Badge variant="secondary" className="gap-1 px-1.5 py-0.5 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {formatRating(movie.voteAverage)}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
