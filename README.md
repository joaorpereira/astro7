# Customer Dashboard

Dashboard de clientes que agrega dados de usuários e carrinhos da API [DummyJSON](https://dummyjson.com).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run test       # testes
npm run lint       # eslint
npm run build      # build de produção
npm run start      # servidor de produção
npm run lint       # ESLint
npm run test       # testes unitários (Vitest)
npm run test:watch # testes em modo watch
```
## Technical Decisions

- **Next.js App Router** — estrutura moderna com Server/Client Components
- **TanStack Query** — cache, loading/error states, retry e refetch simplificados
- **Feature-based architecture** — código organizado por domínio (`features/customers`)
- **DTO + Adapter pattern** — a UI nunca consome dados raw da API
- **Zod** — validação de respostas externas na camada de serviço
- **Tailwind CSS** — estilização utilitária com suporte a dark mode
- **Vitest** — testes unitários para adapters, utils e services

## Project Structure

```
src/
├── app/                    # rotas e layout (App Router)
├── features/customers/
│   ├── adapters/           # transformação DTO → view model
│   ├── components/         # UI da feature
│   ├── hooks/              # useCustomers (React Query)
│   ├── services/           # fetch + validação Zod
│   ├── types/              # schemas e tipos
│   └── utils/              # formatação, ordenação, paginação
└── shared/
    ├── components/         # QueryProvider, SkipLink
    └── hooks/              # useFocusTrap
```


## Deploy

Publicado em [joaorpereira.github.io/astro7](https://joaorpereira.github.io/astro7/) via GitHub Actions (push na `main`).

Para habilitar: **Settings → Pages → Source: GitHub Actions**.

## Como funciona

A API devolve `users` e `carts` separados. O adapter faz o join por `userId`, soma quantidades e totais, e a UI consome um `CustomerSummary` já pronto — sem DTO cru nos componentes.

Busca e paginação rodam no servidor (`/users` e `/users/search`). A ordenação por valor total é client-side, só na página atual — preferi não re-buscar a API só para sort.

## Trade-offs

- **Static export no GitHub Pages** — simples de hospedar, mas sem SSR. Os dados vêm do client via React Query.
- **Um fetch de carts por usuário da página** — paralelo e previsível; com 10 itens por página, funciona bem. Com centenas por página, precisaria de endpoint batch.
- **Ordenação local** — rápida para o usuário, mas não reordena o dataset inteiro. Aceitável para o escopo do exercício.

## Estrutura

```
src/features/customers/   # domínio (services, adapter, hooks, UI)
src/shared/               # providers e utilitários compartilhados
```

Testes unitários cobrem adapter, utils e services (Vitest).
