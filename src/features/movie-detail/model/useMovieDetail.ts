import { useQueries } from '@tanstack/react-query'
import { tmdbClient } from '@/shared/api/tmdb.client'
import { endpoints } from '@/shared/api/tmdb.endpoints'
import { queryKeys } from '@/shared/lib/queryKeys'
import { mapMovieDetail } from '@/entities/movie/model/movie.mappers'
import type {
  TmdbMovieDetailRaw,
  TmdbCreditsRaw,
  TmdbVideosRaw,
} from '@/entities/movie/model/movie.types'

export function useMovieDetail(movieId: number) {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.movies.detail(movieId),
        queryFn: () =>
          tmdbClient
            .get<TmdbMovieDetailRaw>(endpoints.movieDetail(movieId))
            .then((r) => r.data),
        staleTime: 1000 * 60 * 10,
      },
      {
        queryKey: queryKeys.movies.credits(movieId),
        queryFn: () =>
          tmdbClient
            .get<TmdbCreditsRaw>(endpoints.movieCredits(movieId))
            .then((r) => r.data),
        staleTime: 1000 * 60 * 10,
      },
      {
        queryKey: queryKeys.movies.videos(movieId),
        queryFn: () =>
          tmdbClient
            .get<TmdbVideosRaw>(endpoints.movieVideos(movieId))
            .then((r) => r.data),
        staleTime: 1000 * 60 * 10,
      },
    ],
  })

  const [detailQuery, creditsQuery, videosQuery] = results
  const isPending = results.some((r) => r.isPending)
  const isError = results.some((r) => r.isError)
  const error = results.find((r) => r.error)?.error

  const data =
    detailQuery.data && creditsQuery.data && videosQuery.data
      ? mapMovieDetail(detailQuery.data, creditsQuery.data, videosQuery.data)
      : null

  return { data, isPending, isError, error }
}
