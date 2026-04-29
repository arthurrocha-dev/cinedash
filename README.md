# CineDash

Dashboard analítico de curadoria de filmes, construído com React 18 + TypeScript sobre a API pública do TMDB.

Projeto desenvolvido como solução ao [React Frontend Challenge](https://github.com/buzzmates/react-frontend-challenge) da Buzzmates.

---

## Funcionalidades

- **Autenticação simulada** — login com validação Zod, JWT mock, sessão persistida em localStorage
- **Descoberta de filmes** — hero com trending semanal, busca com debounce, filtros por gênero / ano / nota mínima / ordenação, paginação, filtros sincronizados na URL
- **Watchlist** — adicionar/remover filmes, tabela com sorting por título, nota e data, persistida em localStorage
- **Detalhe do filme** — backdrop hero, elenco principal, trailer via YouTube embed, filmes similares, link para TMDB
- **Tema dark / light / system** — preferência persistida

## Stack

| Categoria | Tecnologia |
|---|---|
| Core | React 18, TypeScript (strict), Vite |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand v5 + persist |
| Roteamento | TanStack Router v1 |
| UI | shadcn/ui (Radix UI) + TailwindCSS v4 |
| Formulários | React Hook Form + Zod |
| Tabelas | TanStack Table v8 |
| Testes | Vitest + React Testing Library |

## Arquitetura

O projeto adota **Feature-Sliced Design (FSD)** com cinco camadas ordenadas por nível de abstração:

```
app → pages → widgets → features → entities → shared
```

Cada camada importa apenas das camadas abaixo dela, eliminando coupling circular. Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para a justificativa completa das decisões técnicas.

## Setup

**Pré-requisitos:** Node.js 18+, chave de API do TMDB (gratuita em [themoviedb.org](https://www.themoviedb.org/settings/api))

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua VITE_TMDB_API_KEY

# Iniciar em desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

**Login:** use qualquer e-mail válido e senha com 6+ caracteres.

## Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run typecheck  # Verificação TypeScript
npm test           # Rodar testes (Vitest)
```

## Testes

```
40 testes | 8 suítes | 0 erros TypeScript
```

Cobertura focada em valor real:
- Stores (auth, watchlist, filtros)
- Validação de schema (Zod)
- Hook `useDebounce`
- Integração: `LoginForm`, `MovieGrid`, `WatchlistTable`
