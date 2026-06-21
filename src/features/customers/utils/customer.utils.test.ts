import { describe, expect, it } from "vitest";

import {
  calculateCustomerStats,
  clampPage,
  paginateCustomers,
} from "@/features/customers/utils/customer.utils";
import type { CustomerSummary } from "@/features/customers/types/customer.types";

const mockCustomers: CustomerSummary[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  totalProducts: i,
  totalSpent: (i + 1) * 10,
}));

describe("paginateCustomers", () => {
  it("returns the first page of items", () => {
    const result = paginateCustomers(mockCustomers, 1, 10);

    expect(result.items).toHaveLength(10);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.totalItems).toBe(25);
    expect(result.startIndex).toBe(1);
    expect(result.endIndex).toBe(10);
  });

  it("returns the last partial page", () => {
    const result = paginateCustomers(mockCustomers, 3, 10);

    expect(result.items).toHaveLength(5);
    expect(result.startIndex).toBe(21);
    expect(result.endIndex).toBe(25);
  });

  it("handles empty list", () => {
    const result = paginateCustomers([], 1, 10);

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(1);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(0);
  });
});

describe("clampPage", () => {
  it("clamps page below minimum to 1", () => {
    expect(clampPage(0, 5)).toBe(1);
  });

  it("clamps page above maximum to totalPages", () => {
    expect(clampPage(10, 5)).toBe(5);
  });
});

describe("calculateCustomerStats", () => {
  it("calculates totals and average correctly", () => {
    const customers: CustomerSummary[] = [
      {
        id: 1,
        name: "A",
        email: "a@test.com",
        totalProducts: 3,
        totalSpent: 100,
      },
      {
        id: 2,
        name: "B",
        email: "b@test.com",
        totalProducts: 5,
        totalSpent: 200,
      },
    ];

    expect(calculateCustomerStats(customers)).toEqual({
      totalCustomers: 2,
      totalRevenue: 300,
      totalProducts: 8,
      averageSpent: 150,
    });
  });
});
