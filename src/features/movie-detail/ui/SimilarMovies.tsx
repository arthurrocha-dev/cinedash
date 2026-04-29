import { useSimilarMovies } from '../model/useSimilarMovies'
import { MovieCard } from '@/entities/movie/ui/MovieCard'
import { MovieCardSkeleton } from '@/entities/movie/ui/MovieCardSkeleton'

interface SimilarMoviesProps {
  movieId: number
}

export function SimilarMovies({ movieId }: SimilarMoviesProps) {
  const { data: movies, isPending } = useSimilarMovies(movieId)

  if (!isPending && (!movies || movies.length === 0)) return null

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">Filmes Similares</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  )
}
