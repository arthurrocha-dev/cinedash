import { Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import { Navbar } from '@/widgets/Navbar/Navbar'

export function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
