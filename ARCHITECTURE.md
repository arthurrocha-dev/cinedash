# ARCHITECTURE.md — CineDash

## Visão Geral

CineDash é um dashboard analítico de curadoria de filmes construído sobre a API pública do TMDB. O objetivo arquitetural central é demonstrar escalabilidade, separação de responsabilidades e decisões técnicas justificadas — não apenas código que funciona.

---

## Escolha de Arquitetura: Feature-Sliced Design (FSD)

### Por quê FSD, não Clean Architecture pura?

Clean Architecture pura (com UseCases, Repositories, Entities separados em camadas de anel) é excelente em backends mas produz over-engineering em aplicações React de médio porte:

- Introduz abstrações sem benefício real (interfaces de repository para um único provider HTTP)
- Força estrutura de pastas baseada em *papel técnico* (services/, repositories/) em vez de *domínio de negócio*

**FSD resolve isso ao organizar verticalmente por feature e horizontalmente por camada de abstração:**

```
app → pages → widgets → features → entities → shared
```

Cada camada só importa de camadas abaixo dela. Isso elimina coupling circular e torna refatoração de uma feature isolada.

### Regra de importação FSD

| Pode importar de | Não pode importar de |
|---|---|
| `features` pode importar de `entities`, `shared` | `features` NÃO importa de `pages`, `widgets` |
| `entities` pode importar de `shared` | `entities` NÃO importa de `features` |
| `shared` não importa nada do projeto | — |

---

## Stack e Justificativas

### TanStack Query — estado servidor

**Por quê:** Separa estado de servidor (cache, refetch, loading/error) de estado de UI. Alternativa com `useEffect` + `useState` produz código frágil e sem cache.

**Estratégia de cache por tipo de dado:**

| Query | staleTime | gcTime | Justificativa |
|---|---|---|---|
| Trending | 5 min | 30 min | Muda lentamente |
| Popular (paginado) | 5 min | 30 min | Estável por página |
| Search | 1 min | 5 min | Resultado específico do input |
| Discover (filtros) | 5 min | 30 min | Muda com atualização diária |
| Movie detail | 10 min | 1h | Dado imutável na prática |
| Genres | Infinity | Infinity | Lista estática |

**Prefetch on hover:** `MovieCard` dispara `queryClient.prefetchQuery` no `onMouseEnter`, tornando a navegação para detalhe instantânea na maioria dos casos.

**Queries paralelas:** `useMovieDetail` usa `useQueries` para buscar detail + credits + videos em paralelo — reduz tempo total de ~3 requisições sequenciais para ~1 RTT.

### Zustand — estado cliente

**Por quê, não Redux/Context:** Redux adiciona ~5 arquivos de boilerplate por feature. Context API causa re-renders desnecessários sem otimização manual. Zustand oferece:

- API minimal (1 hook por store)
- TypeScript nativo sem decorators
- `persist` middleware built-in para localStorage
- Seletores granulares nativos — `useStore(s => s.x)` previne re-render quando `y` muda

**Stores:**

| Store | Persistido | Responsabilidade |
|---|---|---|
| `authStore` | Sim (user + token) | Autenticação simulada |
| `watchlistStore` | Sim (entries[]) | Lista de filmes salvos |
| `filterStore` | Não | Estado de filtros da sessão atual |

### TanStack Router — roteamento type-safe

**Por quê:** Parâmetros de rota (`$movieId`) são tipados. Redirect em `beforeLoad` centraliza a lógica de guarda de rota sem HOC ou prop drilling. `loader` permite prefetch antes do render.

### React Hook Form + Zod

**Por quê RHF:** Performance nativa com inputs não controlados. Integração direta com Zod via `zodResolver`.

**Por quê Zod:** Single source of truth — o schema define tanto a validação de runtime quanto os tipos TypeScript via `z.infer<>`.

---

## Simulação de JWT

A autenticação é **simulada** — não há backend real:

1. `signToken(email, name)`: gera um payload JSON, serializa com `btoa`, concatena 3 partes separadas por `.` (simulando estrutura JWT)
2. `verifyToken(token)`: decodifica o payload, verifica campo `exp`
3. O token é persistido no `localStorage` via Zustand persist
4. `rehydrate()` é chamado na inicialização do app para invalidar tokens expirados

**Limitação conhecida:** A "assinatura" não é criptograficamente segura. Isso é intencional — o desafio pede simulação.

---

## Mapeamento de Dados (Mappers)

A API do TMDB retorna campos em `snake_case` com estrutura acoplada à implementação do servidor. Os mappers (`movie.mappers.ts`) convertem para os tipos de domínio internos:

```
TmdbMovieRaw → MovieSummary
TmdbMovieDetailRaw + TmdbCreditsRaw + TmdbVideosRaw → MovieDetail
```

Benefício: mudanças na API TMDB afetam apenas os mappers, não os componentes.

---

## Estrutura de Pastas

```
src/
├── app/           # Bootstrap, providers, router, layouts
├── pages/         # Composição de features em rotas
├── widgets/       # Blocos compostos reutilizáveis (MovieGrid, WatchlistTable, Navbar)
├── features/      # Casos de uso com estado (auth, discover, watchlist, movie-detail)
├── entities/      # Modelos de domínio + UI atômica (movie, user)
├── shared/        # Infra pura sem deps de feature (api, lib, ui, hooks, utils)
└── test/          # Setup global de testes
```

---

## Decisões de UX

- **Skeletons > Spinners:** Skeletons preservam o layout durante o carregamento, evitando CLS (Cumulative Layout Shift)
- **Debounce de 400ms na busca:** Equilibra responsividade com custo de requisições
- **Prefetch on hover:** Navegação para detalhe percebida como instantânea
- **Watchlist otimista:** Add/remove é imediato — não há operação assíncrona
- **Tema persistido:** `localStorage` garante que preferência dark/light sobrevive ao refresh
