import { useQuery } from '@tanstack/react-query'
import { tmdbClient } from '@/shared/api/tmdb.client'
import { endpoints } from '@/shared/api/tmdb.endpoints'
import { queryKeys } from '@/shared/lib/queryKeys'
import { mapMovieSummary } from '@/entities/movie/model/movie.mappers'
import type { TmdbMovieRaw, TmdbPaginatedResponse } from '@/entities/movie/model/movie.types'

export function useTrendingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.trending(),
    queryFn: async () => {
      const { data } = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieRaw>>(endpoints.trending())
      return data.results.map(mapMovieSummary)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function usePopularMovies(page: number) {
  return useQuery({
    queryKey: queryKeys.movies.popular(page),
    queryFn: async () => {
      const { data } = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieRaw>>(endpoints.popular(), {
        params: { page },
      })
      return {
        movies: data.results.map(mapMovieSummary),
        totalPages: data.total_pages,
        totalResults: data.total_results,
      }
    },
  })
}
