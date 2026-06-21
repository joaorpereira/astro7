# Customer Dashboard

Aplicação em **Next.js + React + TypeScript** que consome as APIs de Users e Carts do [DummyJSON](https://dummyjson.com) e exibe uma tabela de clientes com dados agregados de compras.

## Run

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # servidor de produção
npm run lint       # ESLint
npm run test       # testes unitários (Vitest)
```

## Technical Decisions

- **Next.js App Router** — estrutura moderna com Server/Client Components
- **TanStack Query** — cache, loading/error states, retry e refetch simplificados
- **Feature-based architecture** — código organizado por domínio (`features/customers`)
- **DTO + Adapter pattern** — a UI nunca consome dados raw da API
- **Zod** — validação de respostas externas na camada de serviço
- **Tailwind CSS** — estilização utilitária com suporte a dark mode
- **Vitest** — testes unitários para a camada de domínio (adapters)

## Data Transformation

Os dados de `users` e `carts` são transformados antes de chegar à UI:

1. **Services** (`users.service.ts`, `carts.service.ts`) — fetch + validação Zod
2. **Adapter** (`customer.adapter.ts`) — join por `userId`, soma de `quantity` e `total` de todos os produtos em todos os carrinhos do usuário
3. **View Model** (`CustomerSummary`) — `{ id, name, email, totalProducts, totalSpent }`

Usuários sem carrinho recebem `totalProducts: 0` e `totalSpent: 0`.

## Features

- Listagem de clientes com e-mail, quantidade total de produtos e valor total das compras
- Cards de resumo: total de clientes, receita, produtos vendidos e ticket médio
- Busca por nome (com debounce de 300ms, contador de resultados e botão limpar)
- Ordenação por valor total (asc/desc) com indicadores visuais e `aria-sort`
- Paginação client-side (10 clientes por página)
- Loading state com skeleton rows
- Error state com botão de retry e feedback de recarregamento
- Badge "Top 3" para maiores compradores (ordenação decrescente)
- Avatares com iniciais e scroll suave ao trocar de página

## Future Improvements

- Server Components / SSR para dados iniciais
- Paginação client-side ou backend
- Testes E2E com Playwright
- Observability (Sentry, logging)
- Virtualização para listas grandes
