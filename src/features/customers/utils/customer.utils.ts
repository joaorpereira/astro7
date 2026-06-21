import type {
  CustomerSummary,
  SortDirection,
} from "@/features/customers/types/customer.types";

export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export interface CustomerStats {
  totalCustomers: number;
  totalRevenue: number;
  totalProducts: number;
  averageSpent: number;
}

export function filterCustomersByName(
  customers: CustomerSummary[],
  searchQuery: string,
): CustomerSummary[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return customers;
  }

  return customers.filter((customer) =>
    customer.name.toLowerCase().includes(normalizedQuery),
  );
}

export function sortCustomersByTotalSpent(
  customers: CustomerSummary[],
  direction: SortDirection,
): CustomerSummary[] {
  return [...customers].sort((first, second) => {
    const diff = first.totalSpent - second.totalSpent;
    return direction === "asc" ? diff : -diff;
  });
}

export function paginateCustomers<T>(
  items: T[],
  currentPage: number,
  pageSize: number,
): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = clampPage(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    items: items.slice(startIndex, endIndex),
    currentPage: safePage,
    totalPages,
    totalItems,
    startIndex: totalItems === 0 ? 0 : startIndex + 1,
    endIndex,
  };
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), totalPages);
}

export function calculateCustomerStats(
  customers: CustomerSummary[],
): CustomerStats {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );
  const totalProducts = customers.reduce(
    (sum, customer) => sum + customer.totalProducts,
    0,
  );

  return {
    totalCustomers,
    totalRevenue,
    totalProducts,
    averageSpent: totalCustomers > 0 ? totalRevenue / totalCustomers : 0,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-violet-700",
    "bg-blue-700",
    "bg-emerald-700",
    "bg-amber-700",
    "bg-rose-700",
    "bg-cyan-700",
    "bg-indigo-700",
    "bg-teal-700",
  ];

  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
}
