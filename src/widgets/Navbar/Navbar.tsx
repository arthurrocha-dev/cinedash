import { Link, useLocation } from '@tanstack/react-router'
import { Film, Bookmark, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTheme } from '@/app/providers/ThemeProvider'
import { Button } from '@/shared/ui/button'
import { twMerge } from 'tailwind-merge'

export function Navbar() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Descobrir', icon: Film },
    { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  ]

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
        <nav className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Film className="h-5 w-5" />
            <span>CineDash</span>
          </Link>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={twMerge(
                'flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
                location.pathname === to ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={cycleTheme} aria-label="Alternar tema">
            <ThemeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
