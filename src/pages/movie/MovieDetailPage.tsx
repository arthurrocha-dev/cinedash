import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Star, Clock, BookmarkPlus, BookmarkCheck } from 'lucide-react'
import { useMovieDetail } from '@/features/movie-detail/model/useMovieDetail'
import { CastList, CastListSkeleton } from '@/features/movie-detail/ui/CastList'
import { TrailerModal } from '@/features/movie-detail/ui/TrailerModal'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { backdropUrl, posterUrl } from '@/shared/api/tmdb.endpoints'
import { formatYear, formatRating, formatRuntime } from '@/shared/utils/formatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

function MovieDetailContent() {
  const { movieId } = useParams({ from: '/movie/$movieId' })
  const id = Number(movieId)
  const { data, isPending, isError, error } = useMovieDetail(id)
  const { add, remove, has } = useWatchlistStore()
  const inWatchlist = data ? has(data.id) : false

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{String(error)}</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">
          Voltar para descoberta
        </Link>
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div>
        <Skeleton className="h-72 w-full md:h-96" />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <CastListSkeleton />
        </div>
      </div>
    )
  }

  const backdrop = backdropUrl(data.backdropPath, 'w1280')
  const poster = posterUrl(data.posterPath, 'w342')

  function toggleWatchlist() {
    if (inWatchlist) {
      remove(data!.id)
    } else {
      add({
        id: data!.id,
        title: data!.title,
        overview: data!.overview,
        posterPath: data!.posterPath,
        backdropPath: data!.backdropPath,
        releaseDate: data!.releaseDate,
        voteAverage: data!.voteAverage,
        voteCount: data!.voteCount,
        genreIds: data!.genres.map((g) => g.id),
      })
    }
  }

  return (
    <div>
      {/* Hero backdrop */}
      <div className="relative h-64 overflow-hidden bg-muted md:h-96">
        {backdrop && (
          <img
            src={backdrop}
            alt={data.title}
            className="h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-md bg-background/80 px-3 py-1.5 text-sm backdrop-blur hover:bg-background"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 -mt-24 relative z-10">
          {/* Poster */}
          {poster && (
            <div className="hidden shrink-0 md:block">
              <img
                src={poster}
                alt={data.title}
                className="w-40 rounded-lg border shadow-lg lg:w-52"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex flex-1 flex-col gap-4 pt-24 md:pt-0">
            <div>
              <h1 className="text-3xl font-bold leading-tight">{data.title}</h1>
              {data.tagline && (
                <p className="mt-1 text-muted-foreground italic">"{data.tagline}"</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{formatRating(data.voteAverage)}</span>
                <span className="text-sm text-muted-foreground">
                  ({data.voteCount.toLocaleString('pt-BR')} votos)
                </span>
              </div>
              {data.runtime > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatRuntime(data.runtime)}</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{formatYear(data.releaseDate)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.genres.map((g) => (
                <Badge key={g.id} variant="secondary">
                  {g.name}
                </Badge>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
              {data.overview || 'Sem descrição disponível.'}
            </p>

            <div className="flex flex-wrap gap-3">
              {data.trailer && (
                <TrailerModal trailer={data.trailer} movieTitle={data.title} />
              )}
              <Button
                variant={inWatchlist ? 'secondary' : 'default'}
                onClick={toggleWatchlist}
                className="gap-2"
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Na Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4" />
                    Adicionar à Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <CastList cast={data.cast} />
        </div>
      </div>
    </div>
  )
}

export function MovieDetailPage() {
  return (
    <ErrorBoundary>
      <MovieDetailContent />
    </ErrorBoundary>
  )
}
