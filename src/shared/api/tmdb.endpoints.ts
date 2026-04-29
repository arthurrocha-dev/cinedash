export const IMAGE_BASE_URL = import.meta.env['VITE_TMDB_IMAGE_BASE_URL'] ?? 'https://image.tmdb.org/t/p'

export const posterUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null

export const backdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null

export const endpoints = {
  trending: () => '/trending/movie/week',
  popular: () => '/movie/popular',
  search: () => '/search/movie',
  discover: () => '/discover/movie',
  movieDetail: (id: number) => `/movie/${id}`,
  movieCredits: (id: number) => `/movie/${id}/credits`,
  movieVideos: (id: number) => `/movie/${id}/videos`,
  genres: () => '/genre/movie/list',
} as const
