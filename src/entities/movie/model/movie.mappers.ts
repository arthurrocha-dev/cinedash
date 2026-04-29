import type {
  MovieSummary,
  MovieDetail,
  TmdbMovieRaw,
  TmdbMovieDetailRaw,
  TmdbCreditsRaw,
  TmdbVideosRaw,
} from './movie.types'

export function mapMovieSummary(raw: TmdbMovieRaw): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    genreIds: raw.genre_ids,
  }
}

export function mapMovieDetail(
  raw: TmdbMovieDetailRaw,
  credits: TmdbCreditsRaw,
  videos: TmdbVideosRaw,
): MovieDetail {
  const trailer =
    videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    videos.results.find((v) => v.site === 'YouTube') ??
    null

  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    runtime: raw.runtime,
    tagline: raw.tagline,
    genres: raw.genres,
    cast: credits.cast.slice(0, 10).map((m) => ({
      id: m.id,
      name: m.name,
      character: m.character,
      profilePath: m.profile_path,
      order: m.order,
    })),
    trailer: trailer
      ? {
          id: trailer.id,
          key: trailer.key,
          name: trailer.name,
          site: trailer.site,
          type: trailer.type,
        }
      : null,
  }
}
