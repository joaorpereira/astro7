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

## Data Transformation

Os dados de `users` e `carts` são transformados antes de chegar à UI:

1. **Services** (`users.service.ts`, `carts.service.ts`) — fetch + validação Zod
2. **Adapter** (`customer.adapter.ts`) — join por `userId`, soma de `quantity` e `total` de todos os produtos em todos os carrinhos do usuário
3. **View Model** (`CustomerSummary`) — `{ id, name, email, totalProducts, totalSpent, carts }`

Usuários sem carrinho recebem `totalProducts: 0`, `totalSpent: 0` e `carts: []`.

## Features

- Listagem de clientes com e-mail, quantidade total de produtos e valor total das compras
- **Paginação server-side** — 10 clientes por página via `GET /users?limit=10&skip=…`
- **Busca server-side** por nome (debounce de 300ms, contador de resultados e botão limpar)
- Ordenação por valor total (asc/desc) na página atual, com indicadores visuais e `aria-sort`
- Modal de itens do carrinho — produtos agrupados por carrinho (thumbnail, preço, quantidade, total)
- Loading state com skeleton rows
- Error state com botão de retry e feedback de recarregamento
- Empty state com opção de limpar busca
- Avatares com iniciais e cores acessíveis (contraste WCAG AA)

## Accessibility

- Skip link para o conteúdo principal
- Navegação por teclado (Tab, Enter/Espaço, Escape)
- Focus trap e retorno de foco no modal de carrinho
- Landmarks semânticos, captions de tabela e labels ARIA
- Anúncios `aria-live` para busca, paginação e estados de carregamento
- Indicadores `focus-visible` e suporte a `prefers-reduced-motion`

## Tests

Cobertura unitária com Vitest (40 testes):

- **Adapter** — agregação de totais, fallbacks de campos ausentes, mapeamento de carrinhos
- **Utils** — ordenação, formatação, iniciais e cores de avatar
- **Services** — fetch de users/carts, busca e tratamento de erros (com `fetch` mockado)

## Future Improvements

- Server Components / SSR para dados iniciais
- Testes E2E com Playwright
- Observability (Sentry, logging)
- Virtualização para listas grandes
