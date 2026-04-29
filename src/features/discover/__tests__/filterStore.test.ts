import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from '../model/filterStore'

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters()
  })

  it('starts with default values', () => {
    const state = useFilterStore.getState()
    expect(state.query).toBe('')
    expect(state.genreId).toBeNull()
    expect(state.year).toBeNull()
    expect(state.minRating).toBeNull()
    expect(state.sortBy).toBe('popularity.desc')
  })

  it('sets query filter', () => {
    useFilterStore.getState().setFilter('query', 'Inception')
    expect(useFilterStore.getState().query).toBe('Inception')
  })

  it('sets genre filter', () => {
    useFilterStore.getState().setFilter('genreId', 28)
    expect(useFilterStore.getState().genreId).toBe(28)
  })

  it('sets year filter', () => {
    useFilterStore.getState().setFilter('year', 2023)
    expect(useFilterStore.getState().year).toBe(2023)
  })

  it('resets all filters', () => {
    useFilterStore.getState().setFilter('query', 'test')
    useFilterStore.getState().setFilter('genreId', 28)
    useFilterStore.getState().setFilter('year', 2020)
    useFilterStore.getState().resetFilters()

    const state = useFilterStore.getState()
    expect(state.query).toBe('')
    expect(state.genreId).toBeNull()
    expect(state.year).toBeNull()
  })

  it('sets sortBy', () => {
    useFilterStore.getState().setFilter('sortBy', 'vote_average.desc')
    expect(useFilterStore.getState().sortBy).toBe('vote_average.desc')
  })
})
