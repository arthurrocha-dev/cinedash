import { describe, it, expect, beforeEach } from 'vitest'
import { useWatchlistStore } from '../model/watchlistStore'
import type { MovieSummary } from '@/entities/movie/model/movie.types'

const mockMovie: MovieSummary = {
  id: 1,
  title: 'Test Movie',
  overview: 'An overview',
  posterPath: '/poster.jpg',
  backdropPath: null,
  releaseDate: '2024-01-01',
  voteAverage: 8.5,
  voteCount: 1000,
  genreIds: [28],
}

const anotherMovie: MovieSummary = { ...mockMovie, id: 2, title: 'Another Movie' }

describe('watchlistStore', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ entries: [] })
  })

  it('starts with empty watchlist', () => {
    expect(useWatchlistStore.getState().entries).toHaveLength(0)
  })

  it('adds a movie', () => {
    useWatchlistStore.getState().add(mockMovie)
    expect(useWatchlistStore.getState().entries).toHaveLength(1)
    expect(useWatchlistStore.getState().entries[0]?.movieId).toBe(1)
  })

  it('does not add duplicate movies', () => {
    useWatchlistStore.getState().add(mockMovie)
    useWatchlistStore.getState().add(mockMovie)
    expect(useWatchlistStore.getState().entries).toHaveLength(1)
  })

  it('removes a movie', () => {
    useWatchlistStore.getState().add(mockMovie)
    useWatchlistStore.getState().remove(mockMovie.id)
    expect(useWatchlistStore.getState().entries).toHaveLength(0)
  })

  it('has() returns true for added movie', () => {
    useWatchlistStore.getState().add(mockMovie)
    expect(useWatchlistStore.getState().has(mockMovie.id)).toBe(true)
  })

  it('has() returns false for non-added movie', () => {
    expect(useWatchlistStore.getState().has(999)).toBe(false)
  })

  it('adds new movie at the beginning (newest first)', () => {
    useWatchlistStore.getState().add(mockMovie)
    useWatchlistStore.getState().add(anotherMovie)
    expect(useWatchlistStore.getState().entries[0]?.movieId).toBe(2)
  })

  it('preserves addedAt timestamp on add', () => {
    useWatchlistStore.getState().add(mockMovie)
    const entry = useWatchlistStore.getState().entries[0]
    expect(entry?.addedAt).toBeTruthy()
    expect(new Date(entry!.addedAt).toString()).not.toBe('Invalid Date')
  })
})
