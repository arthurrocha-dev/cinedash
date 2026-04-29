import { useTrendingMovies } from '@/features/discover/model/useMovies'
import { MovieCard } from '@/entities/movie/ui/MovieCard'
import { MovieCardSkeleton } from '@/entities/movie/ui/MovieCardSkeleton'

export function TrendingStrip() {
  const { data: movies, isPending } = useTrendingMovies()

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Em Alta Esta Semana</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.slice(0, 6).map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  )
}
