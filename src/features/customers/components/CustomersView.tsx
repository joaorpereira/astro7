"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CartItemsModal } from "@/features/customers/components/CartItemsModal";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { ErrorState } from "@/features/customers/components/ErrorState";
import { LoadingState } from "@/features/customers/components/LoadingState";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type {
  CustomerSummary,
  SortDirection,
} from "@/features/customers/types/customer.types";
import {
  DEFAULT_PAGE_SIZE,
  sortCustomersByTotalSpent,
} from "@/features/customers/utils/customer.utils";
import { SkipLink } from "@/shared/components/SkipLink";

const SEARCH_DEBOUNCE_MS = 300;

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [cartModalCustomer, setCartModalCustomer] =
    useState<CustomerSummary | null>(null);
  const cartModalTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const { data, totalItems, isLoading, isFetching, error, refetch } =
    useCustomers({
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      search: debouncedSearchQuery,
    });

  const sortedCustomers = useMemo(
    () => sortCustomersByTotalSpent(data, sortDirection),
    [data, sortDirection],
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / DEFAULT_PAGE_SIZE));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * DEFAULT_PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * DEFAULT_PAGE_SIZE, totalItems);

  const pagination = useMemo(
    () => ({
      items: sortedCustomers,
      currentPage,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
    }),
    [sortedCustomers, currentPage, totalPages, totalItems, startIndex, endIndex],
  );

  const handleSortByTotalSpent = () => {
    setSortDirection((currentDirection) =>
      currentDirection === "asc" ? "desc" : "asc",
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleViewCartItems = (
    customer: CustomerSummary,
    trigger: HTMLButtonElement,
  ) => {
    cartModalTriggerRef.current = trigger;
    setCartModalCustomer(customer);
  };

  const handleCloseCartModal = () => {
    setCartModalCustomer(null);
  };

  return (
    <div className="relative min-h-full">
      <SkipLink href="#main-content" label="Ir para o conteúdo principal" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-100/60 via-transparent to-transparent dark:from-violet-950/30"
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 focus:outline-none"
      >
        <header>
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Clientes
          </h1>
        </header>

        {isLoading && <LoadingState />}

        {!isLoading && error && (
          <ErrorState onRetry={refetch} isRetrying={isFetching} />
        )}

        {!isLoading && !error && (
          <div className="relative">
            {isFetching && (
              <div
                role="status"
                className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-violet-600 shadow-sm backdrop-blur dark:bg-zinc-900/90 dark:text-violet-400"
                aria-live="polite"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Atualizando...
              </div>
            )}

            <CustomerTable
              customers={sortedCustomers}
              pagination={pagination}
              sortDirection={sortDirection}
              searchQuery={debouncedSearchQuery}
              searchValue={searchQuery}
              resultCount={totalItems}
              onSearchChange={setSearchQuery}
              onClearSearch={handleClearSearch}
              onSortByTotalSpent={handleSortByTotalSpent}
              onPageChange={handlePageChange}
              onViewCartItems={handleViewCartItems}
            />
          </div>
        )}

        {cartModalCustomer && (
          <CartItemsModal
            customer={cartModalCustomer}
            onClose={handleCloseCartModal}
            returnFocusRef={cartModalTriggerRef}
          />
        )}
      </main>
    </div>
  );
}
