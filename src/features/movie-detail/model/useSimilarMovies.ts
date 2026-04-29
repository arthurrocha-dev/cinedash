import { useQuery } from '@tanstack/react-query'
import { tmdbClient } from '@/shared/api/tmdb.client'
import { mapMovieSummary } from '@/entities/movie/model/movie.mappers'
import type { TmdbMovieRaw, TmdbPaginatedResponse } from '@/entities/movie/model/movie.types'

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ['movies', 'similar', movieId],
    queryFn: async () => {
      const { data } = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieRaw>>(
        `/movie/${movieId}/similar`,
      )
      return data.results.slice(0, 6).map(mapMovieSummary)
    },
    staleTime: 1000 * 60 * 10,
  })
}
