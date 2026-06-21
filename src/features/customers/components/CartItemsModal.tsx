"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type RefObject } from "react";

import {
  formatCurrency,
  formatNumber,
} from "@/features/customers/utils/customer.utils";
import type { CustomerSummary } from "@/features/customers/types/customer.types";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { interactiveFocus } from "@/shared/styles/interactive";

interface CartItemsModalProps {
  customer: CustomerSummary;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}

export function CartItemsModal({
  customer,
  onClose,
  returnFocusRef,
}: CartItemsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const hasItems = customer.carts.some((cart) => cart.products.length > 0);

  useFocusTrap(dialogRef, true);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const triggerElement = returnFocusRef?.current ?? null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerElement?.focus();
    };
  }, [onClose, returnFocusRef]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 cursor-pointer bg-zinc-900/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={() => undefined}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-6 py-5 dark:border-zinc-800/80">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Itens do carrinho
            </h2>
            <p
              id={descriptionId}
              className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
            >
              {customer.name} · {customer.email}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-offset-zinc-900 ${interactiveFocus}`}
            aria-label="Fechar modal de itens do carrinho"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {!hasItems ? (
            <p
              role="status"
              className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
            >
              Este cliente não possui itens no carrinho.
            </p>
          ) : (
            <div className="space-y-6">
              {customer.carts.map((cart) =>
                cart.products.length === 0 ? null : (
                  <section
                    key={cart.id}
                    aria-labelledby={`cart-${cart.id}-heading`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3
                        id={`cart-${cart.id}-heading`}
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                      >
                        Carrinho #{cart.id}
                      </h3>
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        Subtotal: {formatCurrency(cart.total)}
                      </span>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                      <table className="min-w-full">
                        <caption className="sr-only">
                          Produtos do carrinho {cart.id} de {customer.name}
                        </caption>
                        <thead>
                          <tr className="border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/60">
                            <th
                              scope="col"
                              className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                              Produto
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                              Preço un.
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                              Qtd.
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                          {cart.products.map((product, productIndex) => (
                            <tr key={`${cart.id}-${productIndex}-${product.id}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {product.thumbnail ? (
                                    <Image
                                      src={product.thumbnail}
                                      alt=""
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 object-cover dark:border-zinc-700"
                                    />
                                  ) : (
                                    <div
                                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800"
                                      aria-hidden="true"
                                    >
                                      —
                                    </div>
                                  )}
                                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                                    {product.title}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
                                {formatCurrency(product.price)}
                              </td>
                              <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
                                {formatNumber(product.quantity)}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                                {formatCurrency(product.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ),
              )}
            </div>
          )}
        </div>

        {hasItems && (
          <div className="flex items-center justify-between border-t border-zinc-200/80 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Total geral
            </span>
            <span className="text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatCurrency(customer.totalSpent)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
