import {
  formatCurrency,
  formatNumber,
  getAvatarColor,
  getInitials,
} from "@/features/customers/utils/customer.utils";
import type { CustomerSummary } from "@/features/customers/types/customer.types";
import { interactiveFocus } from "@/shared/styles/interactive";

interface CustomerRowProps {
  customer: CustomerSummary;
  onViewCartItems: (
    customer: CustomerSummary,
    trigger: HTMLButtonElement,
  ) => void;
}

export function CustomerRow({
  customer,
  onViewCartItems,
}: CustomerRowProps) {
  const initials = getInitials(customer.name);
  const avatarColor = getAvatarColor(customer.name);
  const hasCartItems = customer.carts.some((cart) => cart.products.length > 0);

  return (
    <tr className="group transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm ${avatarColor}`}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {customer.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-300">
          {customer.email}
        </p>
      </td>
      <td className="px-5 py-4 text-right">
        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {formatNumber(customer.totalProducts)}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {formatCurrency(customer.totalSpent)}
        </span>
      </td>
      <td className="px-5 py-4 text-center">
        <button
          type="button"
          onClick={(event) => onViewCartItems(customer, event.currentTarget)}
          disabled={!hasCartItems}
          aria-disabled={!hasCartItems}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-blue-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 ${interactiveFocus}`}
          aria-label={
            hasCartItems
              ? `Ver itens do carrinho de ${customer.name}`
              : `${customer.name} não possui itens no carrinho`
          }
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          Ver itens
        </button>
      </td>
    </tr>
  );
}
