import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WatchlistTable } from '../WatchlistTable'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import type { MovieSummary } from '@/entities/movie/model/movie.types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params }: { children: React.ReactNode; to: string; params?: object }) => (
    <a href={`${to}/${JSON.stringify(params ?? {})}`}>{children}</a>
  ),
}))

const mockMovie: MovieSummary = {
  id: 1,
  title: 'Test Movie',
  overview: 'An overview',
  posterPath: null,
  backdropPath: null,
  releaseDate: '2024-01-15',
  voteAverage: 8.5,
  voteCount: 1000,
  genreIds: [28],
}

describe('WatchlistTable', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ entries: [] })
  })

  it('shows empty state when watchlist is empty', () => {
    render(<WatchlistTable />)
    expect(screen.getByText('Watchlist vazia')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /descobrir filmes/i })).toBeInTheDocument()
  })

  it('renders table with movie entries', () => {
    useWatchlistStore.getState().add(mockMovie)
    render(<WatchlistTable />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('removes movie on delete button click', () => {
    useWatchlistStore.getState().add(mockMovie)
    render(<WatchlistTable />)

    fireEvent.click(screen.getByRole('button', { name: /remover da watchlist/i }))

    expect(useWatchlistStore.getState().entries).toHaveLength(0)
    expect(screen.getByText('Watchlist vazia')).toBeInTheDocument()
  })

  it('renders sort buttons for title, rating, and addedAt', () => {
    useWatchlistStore.getState().add(mockMovie)
    render(<WatchlistTable />)

    expect(screen.getByRole('button', { name: /título/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nota/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /adicionado em/i })).toBeInTheDocument()
  })
})
