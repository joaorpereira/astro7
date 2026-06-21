interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function EmptyState({ searchQuery, onClearSearch }: EmptyStateProps) {
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <svg
          aria-hidden="true"
          className="h-7 w-7 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {hasSearch ? "Nenhum cliente encontrado" : "Nenhum dado disponível"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {hasSearch
          ? `Não encontramos resultados para "${searchQuery}". Tente outro termo de busca.`
          : "Não há clientes para exibir no momento."}
      </p>
      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 inline-flex cursor-pointer items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          Limpar busca
        </button>
      )}
    </div>
  );
}
