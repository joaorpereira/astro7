import { describe, expect, it } from "vitest";

import type { CustomerSummary } from "@/features/customers/types/customer.types";
import {
  formatCurrency,
  formatNumber,
  getAvatarColor,
  getInitials,
  sortCustomersByTotalSpent,
} from "@/features/customers/utils/customer.utils";

function createCustomer(
  overrides: Partial<CustomerSummary> & Pick<CustomerSummary, "id" | "name">,
): CustomerSummary {
  return {
    email: `${overrides.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    totalProducts: 0,
    totalSpent: 0,
    carts: [],
    ...overrides,
  };
}

describe("sortCustomersByTotalSpent", () => {
  const customers = [
    createCustomer({ id: 1, name: "Low", totalSpent: 50 }),
    createCustomer({ id: 2, name: "High", totalSpent: 300 }),
    createCustomer({ id: 3, name: "Mid", totalSpent: 150 }),
  ];

  it("sorts in descending order by default direction", () => {
    const sorted = sortCustomersByTotalSpent(customers, "desc");

    expect(sorted.map((customer) => customer.id)).toEqual([2, 3, 1]);
  });

  it("sorts in ascending order", () => {
    const sorted = sortCustomersByTotalSpent(customers, "asc");

    expect(sorted.map((customer) => customer.id)).toEqual([1, 3, 2]);
  });

  it("does not mutate the original array", () => {
    const originalOrder = customers.map((customer) => customer.id);

    sortCustomersByTotalSpent(customers, "desc");

    expect(customers.map((customer) => customer.id)).toEqual(originalOrder);
  });
});

describe("formatCurrency", () => {
  it("formats values using pt-BR locale and USD currency", () => {
    expect(formatCurrency(1234.5)).toBe("US$ 1.234,50");
  });

  it("formats zero values", () => {
    expect(formatCurrency(0)).toBe("US$ 0,00");
  });
});

describe("formatNumber", () => {
  it("formats values using pt-BR grouping", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });

  it("formats zero values", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("getInitials", () => {
  it("returns up to two uppercase initials from the name", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("maria")).toBe("M");
  });

  it("ignores extra whitespace between names", () => {
    expect(getInitials("  Ana   Paula  ")).toBe("AP");
  });

  it("returns an empty string for blank names", () => {
    expect(getInitials("   ")).toBe("");
  });
});

describe("getAvatarColor", () => {
  it("returns a stable color class for a name", () => {
    expect(getAvatarColor("John Doe")).toMatch(/^bg-[a-z]+-700$/);
  });

  it("returns the same color for the same name", () => {
    expect(getAvatarColor("Jane Smith")).toBe(getAvatarColor("Jane Smith"));
  });
});
