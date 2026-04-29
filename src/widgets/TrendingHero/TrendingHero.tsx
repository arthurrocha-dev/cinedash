import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Star, Play, BookmarkPlus, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTrendingMovies } from '@/features/discover/model/useMovies'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { backdropUrl, posterUrl } from '@/shared/api/tmdb.endpoints'
import { formatYear, formatRating } from '@/shared/utils/formatters'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'

export function TrendingHero() {
  const { data: movies, isPending } = useTrendingMovies()
  const [index, setIndex] = useState(0)
  const { add, remove, has } = useWatchlistStore()

  if (isPending) return <TrendingHeroSkeleton />
  if (!movies || movies.length === 0) return null

  const featured = movies[index]!
  const backdrop = backdropUrl(featured.backdropPath, 'w1280')
  const poster = posterUrl(featured.posterPath, 'w342')
  const inWatchlist = has(featured.id)

  function prev() {
    setIndex((i) => (i === 0 ? movies.length - 1 : i - 1))
  }
  function next() {
    setIndex((i) => (i === movies.length - 1 ? 0 : i + 1))
  }

  function toggleWatchlist(e: React.MouseEvent) {
    e.preventDefault()
    if (inWatchlist) {
      remove(featured.id)
    } else {
      add(featured)
    }
  }

  return (
    <section className="relative h-[420px] overflow-hidden bg-black md:h-[500px]" aria-label="Filme em destaque">
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-500"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="relative flex h-full items-end pb-10">
        <div className="container mx-auto flex items-end gap-6 px-4">
          {poster && (
            <img
              src={poster}
              alt={featured.title}
              className="hidden w-28 shrink-0 rounded-lg border shadow-xl md:block lg:w-36"
            />
          )}
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="secondary" className="w-fit">Em Alta Esta Semana</Badge>
            <h2 className="text-2xl font-bold text-white drop-shadow md:text-3xl">
              {featured.title}
            </h2>
            <div className="flex items-center gap-3 text-white/80">
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {formatRating(featured.voteAverage)}
              </span>
              <span className="text-sm">{formatYear(featured.releaseDate)}</span>
            </div>
            <p className="line-clamp-2 text-sm text-white/70">{featured.overview}</p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="gap-2">
                <Link to="/movie/$movieId" params={{ movieId: String(featured.id) }}>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Ver Detalhes
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWatchlist}
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                {inWatchlist ? (
                  <BookmarkCheck className="h-3.5 w-3.5" />
                ) : (
                  <BookmarkPlus className="h-3.5 w-3.5" />
                )}
                {inWatchlist ? 'Na Watchlist' : 'Watchlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-white/20 text-white hover:bg-white/30"
          onClick={prev}
          aria-label="Filme anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-white/60">
          {index + 1} / {movies.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-white/20 text-white hover:bg-white/30"
          onClick={next}
          aria-label="Próximo filme"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

function TrendingHeroSkeleton() {
  return (
    <div className="relative h-[420px] overflow-hidden bg-muted md:h-[500px]">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute inset-0 flex items-end pb-10">
        <div className="container mx-auto flex items-end gap-6 px-4">
          <Skeleton className="hidden h-36 w-28 shrink-0 rounded-lg md:block" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    </div>
  )
}
