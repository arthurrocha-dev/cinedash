import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useFilterStore } from '../model/filterStore'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

export function SearchBar() {
  const storeQuery = useFilterStore((s) => s.query)
  const setFilter = useFilterStore((s) => s.setFilter)
  const [localQuery, setLocalQuery] = useState(storeQuery)
  const debouncedQuery = useDebounce(localQuery, 400)

  useEffect(() => {
    setFilter('query', debouncedQuery)
  }, [debouncedQuery, setFilter])

  function clear() {
    setLocalQuery('')
    setFilter('query', '')
  }

  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar filmes…"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-9 pr-9"
        aria-label="Buscar filmes"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={clear}
          aria-label="Limpar busca"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
