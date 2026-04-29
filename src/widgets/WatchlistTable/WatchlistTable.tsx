import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpDown, Trash2, Bookmark } from 'lucide-react'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { posterUrl } from '@/shared/api/tmdb.endpoints'
import { formatYear, formatRating } from '@/shared/utils/formatters'
import { Button } from '@/shared/ui/button'
import type { WatchlistEntry } from '@/entities/movie/model/movie.types'

const col = createColumnHelper<WatchlistEntry>()

const columns = [
  col.display({
    id: 'poster',
    header: '',
    cell: ({ row }) => {
      const src = posterUrl(row.original.movie.posterPath, 'w185')
      return src ? (
        <img src={src} alt={row.original.movie.title} className="h-16 w-11 rounded object-cover" />
      ) : (
        <div className="h-16 w-11 rounded bg-muted" />
      )
    },
  }),
  col.accessor((e) => e.movie.title, {
    id: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 gap-1"
      >
        Título
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        to="/movie/$movieId"
        params={{ movieId: String(row.original.movieId) }}
        className="font-medium hover:underline"
      >
        {row.original.movie.title}
      </Link>
    ),
  }),
  col.accessor((e) => e.movie.releaseDate, {
    id: 'year',
    header: 'Ano',
    cell: ({ getValue }) => formatYear(getValue()),
  }),
  col.accessor((e) => e.movie.voteAverage, {
    id: 'rating',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 gap-1"
      >
        Nota
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{formatRating(getValue())}</span>
    ),
  }),
  col.accessor('addedAt', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 gap-1"
      >
        Adicionado em
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ getValue }) =>
      new Date(getValue()).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  }),
  col.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const remove = useWatchlistStore.getState().remove
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => remove(row.original.movieId)}
          aria-label="Remover da watchlist"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    },
  }),
]

export function WatchlistTable() {
  const entries = useWatchlistStore((s) => s.entries)
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: entries,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Bookmark className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Sua watchlist está vazia. Adicione filmes na tela de descoberta.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b transition-colors hover:bg-muted/30 last:border-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
