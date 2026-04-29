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
import { DiscoverPage } from '@/pages/discover/DiscoverPage'
import { WatchlistPage } from '@/pages/watchlist/WatchlistPage'
import { MovieDetailPage } from '@/pages/movie/MovieDetailPage'

function getIsAuthenticated() {
  return useAuthStore.getState().isAuthenticated
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (getIsAuthenticated()) throw redirect({ to: '/' })
  },
  component: LoginForm,
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: () => {
    if (!getIsAuthenticated()) throw redirect({ to: '/login' })
  },
  component: Outlet,
})

const discoverRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: DiscoverPage,
})

const watchlistRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/watchlist',
  component: WatchlistPage,
})

const movieRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/movie/$movieId',
  component: MovieDetailPage,
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
