import { formatNumber } from "@/features/customers/utils/customer.utils";
import { interactiveFocus } from "@/shared/styles/interactive";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80">
      <p
        className="text-sm text-zinc-500 dark:text-zinc-400"
        aria-live="polite"
        aria-atomic="true"
      >
        {totalItems === 0 ? (
          "Nenhum resultado"
        ) : (
          <>
            Mostrando{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {startIndex}–{endIndex}
            </span>{" "}
            de{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {formatNumber(totalItems)}
            </span>{" "}
            clientes
          </>
        )}
      </p>

      <nav aria-label="Paginação" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`inline-flex h-9 cursor-pointer items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 ${interactiveFocus}`}
          aria-label="Página anterior"
        >
          Anterior
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-zinc-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={
                  page === currentPage
                    ? `Página ${page}, página atual`
                    : `Ir para página ${page}`
                }
                className={`inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium transition ${interactiveFocus} ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <span
          className="px-2 text-sm text-zinc-500 sm:hidden dark:text-zinc-400"
          aria-current="page"
          aria-label={`Página ${currentPage} de ${totalPages}`}
        >
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`inline-flex h-9 cursor-pointer items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 ${interactiveFocus}`}
          aria-label="Próxima página"
        >
          Próxima
        </button>
      </nav>
    </div>
  );
}
