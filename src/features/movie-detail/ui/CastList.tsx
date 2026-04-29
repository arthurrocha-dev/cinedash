import { posterUrl } from '@/shared/api/tmdb.endpoints'
import { Skeleton } from '@/shared/ui/skeleton'
import type { CastMember } from '@/entities/movie/model/movie.types'

interface CastListProps {
  cast: CastMember[]
}

export function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Elenco Principal</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
        {cast.map((member) => {
          const photo = posterUrl(member.profilePath, 'w185')
          return (
            <div key={member.id} className="flex flex-col items-center gap-1 text-center">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                {photo ? (
                  <img
                    src={photo}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <p className="text-xs font-medium leading-tight">{member.name}</p>
              <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                {member.character}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function CastListSkeleton() {
  return (
    <section>
      <Skeleton className="mb-3 h-6 w-36" />
      <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </section>
  )
}
