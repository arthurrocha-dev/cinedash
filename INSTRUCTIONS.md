# INSTRUCTIONS.md — CineDash

## Pré-requisitos

- Node.js 18+
- npm 9+
- Chave de API do TMDB (gratuita em [themoviedb.org](https://www.themoviedb.org/settings/api))

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e insira sua VITE_TMDB_API_KEY

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_TMDB_API_KEY` | Chave de API do TMDB | — (obrigatório) |
| `VITE_TMDB_BASE_URL` | URL base da API | `https://api.themoviedb.org/3` |
| `VITE_TMDB_IMAGE_BASE_URL` | URL base de imagens | `https://image.tmdb.org/t/p` |

## Login

A autenticação é simulada — não há backend real. Use qualquer combinação válida:

- **E-mail:** qualquer endereço de e-mail válido (ex: `usuario@email.com`)
- **Senha:** qualquer string com 6 ou mais caracteres

## Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run typecheck  # Verificação de tipos TypeScript
npm test           # Rodar testes (Vitest)
npm run test:ui    # Interface visual dos testes
```

## Funcionalidades

### Descoberta de Filmes (`/`)
- Listagem de filmes populares via TMDB
- Busca com debounce de 400ms
- Filtros por gênero, ano de lançamento, nota mínima e ordenação
- Paginação

### Watchlist (`/watchlist`)
- Tabela com sorting por título, nota e data de adição
- Persistida em localStorage — sobrevive ao refresh
- Adicionar/remover diretamente dos cards ou na página de detalhe

### Detalhe do Filme (`/movie/:id`)
- Backdrop, poster, informações completas
- Elenco principal
- Trailer (YouTube embed via modal)
- Prefetch automático no hover do card

### Tema
- Dark/Light/System — alternado pelo ícone na navbar
- Preferência persistida em localStorage

## Testes

```bash
npm test
```

Cobertos:
- `useDebounce` — comportamento de timing
- `authStore` — login/logout/rehydrate
- `loginSchema` — validação Zod
- `watchlistStore` — add/remove/has/order
- `filterStore` — setFilter/resetFilters
- `LoginForm` — integração com RHF + feedback de validação
