import { create } from 'zustand'

export interface FilterState {
  query: string
  genreId: number | null
  year: number | null
  minRating: number | null
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc'
}

interface FilterActions {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}

const initialState: FilterState = {
  query: '',
  genreId: null,
  year: null,
  minRating: null,
  sortBy: 'popularity.desc',
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () => set(initialState),
}))
