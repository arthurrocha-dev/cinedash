import { Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import { Navbar } from '@/widgets/Navbar/Navbar'

export function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip-to-content para acessibilidade por teclado */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Pular para o conteúdo principal
      </a>

      {isAuthenticated && <Navbar />}

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
