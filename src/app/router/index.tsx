import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { z } from 'zod'
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

// Search params schema para a rota discover
const discoverSearchSchema = z.object({
  q: z.string().optional(),
  genre: z.number().optional(),
  year: z.number().optional(),
  rating: z.number().optional(),
  sort: z.enum(['popularity.desc', 'vote_average.desc', 'release_date.desc']).optional(),
  page: z.number().optional(),
})

export type DiscoverSearch = z.infer<typeof discoverSearchSchema>

const discoverRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  validateSearch: discoverSearchSchema,
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
