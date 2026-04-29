import { useQuery } from '@tanstack/react-query'
import { tmdbClient } from '@/shared/api/tmdb.client'
import { endpoints } from '@/shared/api/tmdb.endpoints'
import { queryKeys } from '@/shared/lib/queryKeys'
import { mapMovieSummary } from '@/entities/movie/model/movie.mappers'
import type { FilterState } from './filterStore'
import type { TmdbMovieRaw, TmdbPaginatedResponse } from '@/entities/movie/model/movie.types'

export function useMovieSearch(filters: FilterState, page: number) {
  const hasQuery = filters.query.trim().length > 0
  const hasFilters = filters.genreId !== null || filters.year !== null || filters.minRating !== null

  return useQuery({
    queryKey: hasQuery
      ? queryKeys.movies.search(filters.query, page)
      : queryKeys.movies.discover(filters, page),
    queryFn: async () => {
      if (hasQuery) {
        const { data } = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieRaw>>(
          endpoints.search(),
          { params: { query: filters.query, page } },
        )
        return {
          movies: data.results.map(mapMovieSummary),
          totalPages: data.total_pages,
        }
      }

      const params: Record<string, string | number> = {
        page,
        sort_by: filters.sortBy,
      }
      if (filters.genreId) params['with_genres'] = filters.genreId
      if (filters.year) params['primary_release_year'] = filters.year
      if (filters.minRating) params['vote_average.gte'] = filters.minRating

      const { data } = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieRaw>>(
        endpoints.discover(),
        { params },
      )
      return {
        movies: data.results.map(mapMovieSummary),
        totalPages: data.total_pages,
      }
    },
    enabled: hasQuery || hasFilters || true,
  })
}
