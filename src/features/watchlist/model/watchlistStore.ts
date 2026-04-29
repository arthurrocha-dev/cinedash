import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MovieSummary, WatchlistEntry } from '@/entities/movie/model/movie.types'

interface WatchlistState {
  entries: WatchlistEntry[]
}

interface WatchlistActions {
  add: (movie: MovieSummary) => void
  remove: (movieId: number) => void
  has: (movieId: number) => boolean
}

export const useWatchlistStore = create<WatchlistState & WatchlistActions>()(
  persist(
    (set, get) => ({
      entries: [],

      add: (movie) => {
        if (get().has(movie.id)) return
        set((state) => ({
          entries: [
            { movieId: movie.id, addedAt: new Date().toISOString(), movie },
            ...state.entries,
          ],
        }))
      },

      remove: (movieId) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.movieId !== movieId),
        }))
      },

      has: (movieId) => get().entries.some((e) => e.movieId === movieId),
    }),
    {
      name: 'cinedash-watchlist',
    },
  ),
)
