import type { SortDirection } from "@/features/customers/types/customer.types";

export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export function sortCustomersByTotalSpent<T extends { totalSpent: number }>(
  customers: T[],
  direction: SortDirection,
): T[] {
  return [...customers].sort((first, second) => {
    const diff = first.totalSpent - second.totalSpent;
    return direction === "asc" ? diff : -diff;
  });
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

const AVATAR_COLORS = [
  "bg-violet-700",
  "bg-blue-700",
  "bg-emerald-700",
  "bg-amber-700",
  "bg-rose-700",
  "bg-cyan-700",
  "bg-indigo-700",
  "bg-teal-700",
] as const;

export function getAvatarColor(name: string): string {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
