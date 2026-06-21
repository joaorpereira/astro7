import { CustomerRow } from "@/features/customers/components/CustomerRow";
import { EmptyState } from "@/features/customers/components/EmptyState";
import { Pagination } from "@/features/customers/components/Pagination";
import { SearchBar } from "@/features/customers/components/SearchBar";
import type {
  CustomerSummary,
  SortDirection,
} from "@/features/customers/types/customer.types";
import type { PaginationResult } from "@/features/customers/utils/customer.utils";

interface CustomerTableProps {
  customers: CustomerSummary[];
  pagination: PaginationResult<CustomerSummary>;
  sortDirection: SortDirection;
  searchQuery: string;
  searchValue: string;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSortByTotalSpent: () => void;
  onPageChange: (page: number) => void;
  onViewCartItems: (
    customer: CustomerSummary,
    trigger: HTMLButtonElement,
  ) => void;
}

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <span className="ml-1.5 inline-flex flex-col gap-0.5" aria-hidden="true">
      <svg
        className={`h-2.5 w-2.5 ${direction === "asc" ? "text-violet-600 dark:text-violet-400" : "text-zinc-300 dark:text-zinc-600"}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg
        className={`h-2.5 w-2.5 ${direction === "desc" ? "text-violet-600 dark:text-violet-400" : "text-zinc-300 dark:text-zinc-600"}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
  );
}

export function CustomerTable({
  customers,
  pagination,
  sortDirection,
  searchQuery,
  searchValue,
  resultCount,
  onSearchChange,
  onClearSearch,
  onSortByTotalSpent,
  onPageChange,
  onViewCartItems,
}: CustomerTableProps) {
  const isEmpty = customers.length === 0;

  return (
    <section
      aria-labelledby="customers-table-title"
      className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200/80 px-5 py-4 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800/80">
        <div>
          <h2
            id="customers-table-title"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Lista de clientes
          </h2>
          <p id="customers-table-description" className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Use Tab para navegar. Pressione Enter ou Espaço em &quot;Valor Total&quot; para ordenar a página atual.
          </p>
        </div>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onClearSearch}
          resultCount={resultCount}
        />
      </div>

      {isEmpty ? (
        <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full" aria-describedby="customers-table-description">
              <caption className="sr-only">
                Tabela de clientes com e-mail, quantidade de produtos, valor total e acesso ao carrinho
              </caption>
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/60">
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    E-mail
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Qtd. Produtos
                  </th>
                  <th
                    scope="col"
                    aria-sort={
                      sortDirection === "asc" ? "ascending" : "descending"
                    }
                    className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    <button
                      type="button"
                      onClick={onSortByTotalSpent}
                      className="ml-auto inline-flex cursor-pointer items-center rounded-lg px-2 py-1 transition hover:bg-violet-100 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:hover:bg-violet-950/50 dark:hover:text-violet-300 dark:focus-visible:ring-offset-zinc-950"
                      aria-label={`Ordenar por valor total das compras, ordem ${sortDirection === "asc" ? "crescente" : "decrescente"}`}
                    >
                      <span
                        className={
                          sortDirection
                            ? "text-violet-700 dark:text-violet-300"
                            : undefined
                        }
                      >
                        Valor Total
                      </span>
                      <SortIcon direction={sortDirection} />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Carrinho
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {pagination.items.map((customer, index) => {
                  const globalRank =
                    sortDirection === "desc"
                      ? pagination.startIndex + index
                      : undefined;

                  return (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      rank={globalRank}
                      onViewCartItems={onViewCartItems}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}
