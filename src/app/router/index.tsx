import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAuthStore } from '@/features/auth/model/authStore'
import { RootLayout } from '../layouts/RootLayout'

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Auth guard wrapper
function getIsAuthenticated() {
  return useAuthStore.getState().isAuthenticated
}

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (getIsAuthenticated()) throw redirect({ to: '/' })
  },
  component: () => <LoginForm />,
})

// Protected layout route
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: () => {
    if (!getIsAuthenticated()) throw redirect({ to: '/login' })
  },
  component: () => <Outlet />,
})

// Discover (home)
const discoverRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: () => {
    const { DiscoverPage } = require('@/pages/discover/DiscoverPage')
    return <DiscoverPage />
  },
})

// Watchlist
const watchlistRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/watchlist',
  component: () => {
    const { WatchlistPage } = require('@/pages/watchlist/WatchlistPage')
    return <WatchlistPage />
  },
})

// Movie detail
const movieRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/movie/$movieId',
  component: () => {
    const { MovieDetailPage } = require('@/pages/movie/MovieDetailPage')
    return <MovieDetailPage />
  },
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([discoverRoute, watchlistRoute, movieRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
