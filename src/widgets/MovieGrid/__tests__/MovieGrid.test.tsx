import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MovieGrid } from '../MovieGrid'
import { useFilterStore } from '@/features/discover/model/filterStore'
import * as movieSearchModule from '@/features/discover/model/useMovieSearch'
import type { MovieSummary } from '@/entities/movie/model/movie.types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <a {...props}>{children}</a>
  ),
}))

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

const mockMovies: MovieSummary[] = [
  {
    id: 1,
    title: 'Movie One',
    overview: 'Overview',
    posterPath: '/poster1.jpg',
    backdropPath: null,
    releaseDate: '2024-03-01',
    voteAverage: 8.0,
    voteCount: 500,
    genreIds: [28],
  },
  {
    id: 2,
    title: 'Movie Two',
    overview: 'Overview 2',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2024-06-15',
    voteAverage: 7.2,
    voteCount: 300,
    genreIds: [35],
  },
]

describe('MovieGrid', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters()
  })

  it('renders skeletons while loading', () => {
    vi.spyOn(movieSearchModule, 'useMovieSearch').mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    } as ReturnType<typeof movieSearchModule.useMovieSearch>)

    render(<MovieGrid page={1} onPageChange={vi.fn()} />, { wrapper })
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders movie cards when data is loaded', () => {
    vi.spyOn(movieSearchModule, 'useMovieSearch').mockReturnValue({
      data: { movies: mockMovies, totalPages: 1 },
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof movieSearchModule.useMovieSearch>)

    render(<MovieGrid page={1} onPageChange={vi.fn()} />, { wrapper })
    expect(screen.getByText('Movie One')).toBeInTheDocument()
    expect(screen.getByText('Movie Two')).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    vi.spyOn(movieSearchModule, 'useMovieSearch').mockReturnValue({
      data: { movies: [], totalPages: 0 },
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof movieSearchModule.useMovieSearch>)

    render(<MovieGrid page={1} onPageChange={vi.fn()} />, { wrapper })
    expect(screen.getByText('Nenhum filme encontrado.')).toBeInTheDocument()
  })

  it('shows error message on failure', () => {
    vi.spyOn(movieSearchModule, 'useMovieSearch').mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('API Error'),
    } as ReturnType<typeof movieSearchModule.useMovieSearch>)

    render(<MovieGrid page={1} onPageChange={vi.fn()} />, { wrapper })
    expect(screen.getByText(/api error/i)).toBeInTheDocument()
  })

  it('hides pagination when only one page', () => {
    vi.spyOn(movieSearchModule, 'useMovieSearch').mockReturnValue({
      data: { movies: mockMovies, totalPages: 1 },
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof movieSearchModule.useMovieSearch>)

    render(<MovieGrid page={1} onPageChange={vi.fn()} />, { wrapper })
    expect(screen.queryByRole('button', { name: /próxima página/i })).not.toBeInTheDocument()
  })
})
