import { useQuery } from '@tanstack/react-query'
import { tmdbClient } from '@/shared/api/tmdb.client'
import { endpoints } from '@/shared/api/tmdb.endpoints'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { Genre } from '@/entities/movie/model/movie.types'

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: async () => {
      const { data } = await tmdbClient.get<{ genres: Genre[] }>(endpoints.genres())
      return data.genres
    },
    staleTime: Infinity,
  })
}
