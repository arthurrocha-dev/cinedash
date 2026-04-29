import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useFilterStore } from '../model/filterStore'
import { useGenres } from '../model/useGenres'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'

const YEARS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i)
const RATINGS = [6, 7, 7.5, 8, 8.5, 9]
const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidade' },
  { value: 'vote_average.desc', label: 'Melhor avaliados' },
  { value: 'release_date.desc', label: 'Mais recentes' },
] as const

export function FilterPanel() {
  const filters = useFilterStore()
  const { data: genres = [] } = useGenres()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

      <Select
        value={filters.genreId?.toString() ?? 'all'}
        onValueChange={(v) => filters.setFilter('genreId', v === 'all' ? null : Number(v))}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os gêneros</SelectItem>
          {genres.map((g) => (
            <SelectItem key={g.id} value={g.id.toString()}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year?.toString() ?? 'all'}
        onValueChange={(v) => filters.setFilter('year', v === 'all' ? null : Number(v))}
      >
        <SelectTrigger className="h-9 w-28 text-sm">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.minRating?.toString() ?? 'all'}
        onValueChange={(v) => filters.setFilter('minRating', v === 'all' ? null : Number(v))}
      >
        <SelectTrigger className="h-9 w-28 text-sm">
          <SelectValue placeholder="Nota mín." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Qualquer</SelectItem>
          {RATINGS.map((r) => (
            <SelectItem key={r} value={r.toString()}>
              {r}+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(v) => filters.setFilter('sortBy', v as typeof filters.sortBy)}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={filters.resetFilters} className="gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        Resetar
      </Button>
    </div>
  )
}
