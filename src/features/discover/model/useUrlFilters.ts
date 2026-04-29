import { useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useFilterStore } from './filterStore'

/**
 * Sincroniza o filterStore com os search params da URL.
 * Usa strict: false para não lançar invariant ao navegar entre rotas.
 */
export function useUrlFilters() {
  const search = useSearch({ strict: false }) as {
    q?: string
    genre?: number
    year?: number
    rating?: number
    sort?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc'
    page?: number
  }
  const navigate = useNavigate()
  const store = useFilterStore()

  // URL → store na montagem inicial
  useEffect(() => {
    store.setFilter('query', search.q ?? '')
    store.setFilter('genreId', search.genre ?? null)
    store.setFilter('year', search.year ?? null)
    store.setFilter('minRating', search.rating ?? null)
    store.setFilter('sortBy', search.sort ?? 'popularity.desc')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // store → URL ao mudar filtros
  useEffect(() => {
    void navigate({
      to: '/',
      search: {
        q: store.query || undefined,
        genre: store.genreId ?? undefined,
        year: store.year ?? undefined,
        rating: store.minRating ?? undefined,
        sort: store.sortBy !== 'popularity.desc' ? store.sortBy : undefined,
        page: undefined,
      },
      replace: true,
    })
  }, [store.query, store.genreId, store.year, store.minRating, store.sortBy, navigate])

  return search.page ?? 1
}
