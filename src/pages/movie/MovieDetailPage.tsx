import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Star, Clock, BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react'
import { useMovieDetail } from '@/features/movie-detail/model/useMovieDetail'
import { CastList, CastListSkeleton } from '@/features/movie-detail/ui/CastList'
import { TrailerModal } from '@/features/movie-detail/ui/TrailerModal'
import { SimilarMovies } from '@/features/movie-detail/ui/SimilarMovies'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { backdropUrl, posterUrl } from '@/shared/api/tmdb.endpoints'
import { formatYear, formatRating, formatRuntime } from '@/shared/utils/formatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

function MovieDetailSkeleton() {
  return (
    <div>
      {/* Backdrop skeleton */}
      <Skeleton className="h-64 w-full rounded-none md:h-96" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 -mt-24 relative z-10">
          <Skeleton className="hidden h-52 w-40 shrink-0 rounded-lg md:block" />
          <div className="flex flex-1 flex-col gap-4 pt-24 md:pt-0">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-1/3 italic" />
            <div className="flex gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full max-w-2xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <CastListSkeleton />
        </div>
      </div>
    </div>
  )
}

function MovieDetailContent() {
  const { movieId } = useParams({ from: '/protected/movie/$movieId' })
  const id = Number(movieId)
  const { data, isPending, isError, error } = useMovieDetail(id)
  const { add, remove, has } = useWatchlistStore()
  const inWatchlist = data ? has(data.id) : false

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{String(error)}</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm underline">
          <ArrowLeft className="h-4 w-4" />
          Voltar para descoberta
        </Link>
      </div>
    )
  }

  if (isPending || !data) return <MovieDetailSkeleton />

  const backdrop = backdropUrl(data.backdropPath, 'w1280')
  const poster = posterUrl(data.posterPath, 'w342')
  const tmdbUrl = `https://www.themoviedb.org/movie/${data.id}`

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
      <div className="relative h-64 overflow-hidden bg-muted md:h-96" role="img" aria-label={`Backdrop de ${data.title}`}>
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-md bg-background/80 px-3 py-1.5 text-sm backdrop-blur hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Voltar para descoberta"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
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
                alt={`Poster de ${data.title}`}
                className="w-40 rounded-lg border shadow-xl lg:w-52"
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

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="font-semibold">{formatRating(data.voteAverage)}</span>
                <span className="text-sm text-muted-foreground">
                  ({data.voteCount.toLocaleString('pt-BR')} votos)
                </span>
              </div>
              {data.runtime > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">{formatRuntime(data.runtime)}</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{formatYear(data.releaseDate)}</span>
              <a
                href={tmdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Ver no TMDB (abre em nova aba)"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                TMDB
              </a>
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Gêneros">
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
                aria-pressed={inWatchlist}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
                    Na Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                    Adicionar à Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Elenco */}
        <div className="mt-10">
          <CastList cast={data.cast} />
        </div>

        {/* Filmes similares */}
        <ErrorBoundary>
          <SimilarMovies movieId={data.id} />
        </ErrorBoundary>
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
