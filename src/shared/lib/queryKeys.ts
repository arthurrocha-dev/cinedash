import type { FilterState } from '@/features/discover/model/filterStore'

export const queryKeys = {
  movies: {
    trending: () => ['movies', 'trending'] as const,
    popular: (page: number) => ['movies', 'popular', page] as const,
    search: (query: string, page: number) => ['movies', 'search', query, page] as const,
    discover: (filters: FilterState, page: number) => ['movies', 'discover', filters, page] as const,
    detail: (id: number) => ['movies', 'detail', id] as const,
    credits: (id: number) => ['movies', 'credits', id] as const,
    videos: (id: number) => ['movies', 'videos', id] as const,
  },
  genres: () => ['genres'] as const,
} as const
