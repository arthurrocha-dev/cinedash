import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Film, Bookmark, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { Button } from '@/shared/ui/button'
import { twMerge } from 'tailwind-merge'

export function Navbar() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const watchlistCount = useWatchlistStore((s) => s.entries.length)
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const

  function cycleTheme() {
    const order: (typeof theme)[] = ['light', 'dark', 'system']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next ?? 'system')
  }

  const ThemeIcon = themeIcons[theme]

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <nav className="flex items-center gap-6" aria-label="Navegação principal">
          <Link to="/" className="flex items-center gap-2 font-semibold" aria-label="CineDash — início">
            <Film className="h-5 w-5" aria-hidden="true" />
            <span>CineDash</span>
          </Link>

          <Link
            to="/"
            className={twMerge(
              'flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
              location.pathname === '/' ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            <Film className="h-4 w-4" aria-hidden="true" />
            Descobrir
          </Link>

          <Link
            to="/watchlist"
            className={twMerge(
              'relative flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
              location.pathname === '/watchlist'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground',
            )}
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            Watchlist
            {watchlistCount > 0 && (
              <span
                className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground"
                aria-label={`${watchlistCount} filmes na watchlist`}
              >
                {watchlistCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={cycleTheme} aria-label={`Tema atual: ${theme}. Clique para alternar`}>
            <ThemeIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { logout(); void navigate({ to: '/login' }) }} aria-label="Sair da conta">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
