const SKELETON_ROWS = 8;

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800/80">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-36 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="ml-auto h-6 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="mx-auto h-8 w-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </td>
    </tr>
  );
}

export function LoadingState() {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40"
      aria-busy="true"
      aria-live="polite"
      role="status"
      aria-label="Carregando clientes"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200/80 px-5 py-4 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800/80">
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-3 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 sm:max-w-xs dark:bg-zinc-800" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Cliente
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                E-mail
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Qtd. Produtos
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Valor Total
              </th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Carrinho
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
