export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
  order: number
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface MovieSummary {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  voteCount: number
  genreIds: number[]
}

export interface MovieDetail {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  voteCount: number
  runtime: number
  tagline: string
  genres: Genre[]
  cast: CastMember[]
  trailer: Video | null
}

export interface WatchlistEntry {
  movieId: number
  addedAt: string
  movie: MovieSummary
}

// TMDB raw API response types
export interface TmdbMovieRaw {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface TmdbMovieDetailRaw extends Omit<TmdbMovieRaw, 'genre_ids'> {
  runtime: number
  tagline: string
  genres: { id: number; name: string }[]
}

export interface TmdbCreditsRaw {
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }[]
}

export interface TmdbVideosRaw {
  results: {
    id: string
    key: string
    name: string
    site: string
    type: string
  }[]
}

export interface TmdbPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
