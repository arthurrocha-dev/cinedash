# Plano de Implementação — CineDash

## Opção escolhida: CineDash (Filmes)

**Justificativa:** TMDB API é rica em dados (trailers via YouTube, elenco completo, ratings, backdrops), entregando maior impacto visual e mais oportunidades para demonstrar capacidades técnicas como queries paralelas, prefetch e skeletons.

---

## Stack e Justificativas

| Tecnologia | Justificativa |
|---|---|
| React 18 + TypeScript Strict | Base obrigatória; strict mode elimina `any` implícito |
| Vite | Build rápido, HMR nativo, config mínima |
| TanStack Query | Cache inteligente, estados de loading/error/success, deduplicação |
| Zustand + persist | Estado cliente sem boilerplate, persist middleware nativo |
| TanStack Router | Rotas type-safe, guards em `beforeLoad`, loaders para prefetch |
| shadcn/ui + TailwindCSS | Componentes acessíveis, customizáveis, sem bundle bloat |
| React Hook Form + Zod | Performance com inputs não controlados; schema como fonte única de verdade |
| TanStack Table | Sorting, paginação e colunas tipadas para WatchlistTable |
| Vitest + RTL | Testes rápidos com API Jest-compatível; RTL para testes de comportamento |

---

## Arquitetura: Feature-Sliced Design (FSD)

### Camadas (do mais alto ao mais baixo nível)

```
app → pages → widgets → features → entities → shared
```

**Regra:** cada camada só importa das camadas abaixo. Zero coupling circular.

### Estrutura de Pastas

```
src/
├── app/
│   ├── layouts/RootLayout.tsx
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── router/index.tsx
├── pages/
│   ├── auth/         → LoginPage
│   ├── discover/     → DiscoverPage
│   ├── watchlist/    → WatchlistPage
│   └── movie/        → MovieDetailPage
├── widgets/
│   ├── MovieGrid/    → grid responsivo com paginação
│   ├── WatchlistTable/ → TanStack Table
│   └── Navbar/       → navegação + theme toggle + logout
├── features/
│   ├── auth/         → authStore, loginSchema, LoginForm
│   ├── discover/     → filterStore, useMovies, useMovieSearch, useGenres, SearchBar, FilterPanel
│   ├── watchlist/    → watchlistStore
│   └── movie-detail/ → useMovieDetail, CastList, TrailerModal
├── entities/
│   ├── movie/        → tipos, mappers, MovieCard, MovieCardSkeleton
│   └── user/         → tipos de usuário
└── shared/
    ├── api/          → tmdb.client, tmdb.endpoints
    ├── lib/          → queryClient, queryKeys, jwt.mock
    ├── ui/           → Button, Input, Label, Card, Badge, Skeleton, Dialog, Select, ErrorBoundary
    ├── hooks/        → useDebounce
    └── utils/        → formatters
```

---

## Princípios SOLID Aplicados

### Single Responsibility
- `authStore.ts` — gerencia apenas estado de autenticação
- `watchlistStore.ts` — gerencia apenas estado da watchlist
- `filterStore.ts` — gerencia apenas filtros da sessão
- `useMovieDetail.ts` — orquestra apenas o fetching de dados do detalhe

### Open/Closed
- `endpoints.ts` — novos endpoints são adicionados sem modificar o cliente HTTP
- `FilterPanel` — novos filtros são adicionados estendendo o array de configuração

### Interface Segregation
- `MovieSummary` vs `MovieDetail` — listagem não carrega dados do detalhe
- TanStack Query com `queryKeys` tipados — cada query tem seu próprio contrato

### Dependency Inversion
- Componentes dependem de hooks (abstração), não de chamadas HTTP diretas
- `mapMovieDetail` é uma função pura injetável — testável sem mocks HTTP

---

## Estratégia de Cache (TanStack Query)

| Query | staleTime | Justificativa |
|---|---|---|
| Trending | 5 min | Muda lentamente (semanal) |
| Search | 1 min | Input-específico |
| Detail | 10 min | Dado praticamente imutável |
| Genres | Infinity | Lista estática da TMDB |

**Prefetch on hover:** `MovieCard` dispara `prefetchQuery` no `onMouseEnter` — navegação percebida como instantânea.

**Queries paralelas:** `useMovieDetail` usa `useQueries` para buscar detail + credits + videos simultaneamente.

---

## Fases de Implementação (7 dias)

| Dia | Entrega |
|---|---|
| 1 | Setup (Vite, TS strict, deps, estrutura FSD) |
| 2 | Auth (authStore, loginSchema, LoginForm, route guard) |
| 3 | Discover core (MovieCard, MovieGrid, paginação) |
| 4 | Discover avançado (SearchBar debounce, FilterPanel) |
| 5 | Watchlist (watchlistStore persist, WatchlistTable TanStack Table) |
| 6 | Movie Detail (useMovieDetail parallel, CastList, TrailerModal) |
| 7 | Polimento (responsive, a11y, ARCHITECTURE.md, INSTRUCTIONS.md, PR) |

---

## Estratégia de Testes

**Pirâmide focada em valor, não em cobertura:**

### Unit Tests (Vitest puro)
- `useDebounce` — timing behavior com fake timers
- `authStore` — login/logout/rehydrate
- `loginSchema` — casos válidos e inválidos
- `watchlistStore` — add/remove/has/order
- `filterStore` — setFilter/resetFilters

### Integration Tests (RTL)
- `LoginForm` — submit válido, erros de validação, trigger do store
- `MovieGrid` — mock TanStack Query, render de cards, empty state, error state
- `WatchlistTable` — render de dados, sorting, empty state

---

## Git Workflow

### Branches
```
main
├── feat/project-setup
├── feat/auth
├── feat/discover
├── feat/watchlist
├── feat/movie-detail
└── docs/architecture
```

### Conventional Commits
```
feat(auth): add Zod validation schema for login form
feat(discover): implement debounced search with TanStack Query
feat(watchlist): add Zustand store with localStorage persistence
fix(movie-detail): handle null trailer gracefully
test(watchlist): add unit tests for add/remove/has actions
docs: add ARCHITECTURE.md with FSD decisions
```
