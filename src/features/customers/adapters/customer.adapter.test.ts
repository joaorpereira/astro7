import { describe, expect, it } from "vitest";

import { mapUsersAndCartsToCustomerSummary } from "@/features/customers/adapters/customer.adapter";
import type {
  CartDTO,
  UserDTO,
} from "@/features/customers/types/customer.types";

const baseUser: UserDTO = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

describe("mapUsersAndCartsToCustomerSummary", () => {
  it("returns an empty array when there are no users", () => {
    expect(mapUsersAndCartsToCustomerSummary([], [])).toEqual([]);
  });

  it("returns zero totals when user has no carts", () => {
    const users: UserDTO[] = [baseUser];
    const carts: CartDTO[] = [];

    const result = mapUsersAndCartsToCustomerSummary(users, carts);

    expect(result).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        totalProducts: 0,
        totalSpent: 0,
        carts: [],
      },
    ]);
  });

  it("aggregates totals across multiple carts for the same user", () => {
    const users: UserDTO[] = [baseUser];
    const carts: CartDTO[] = [
      {
        id: 10,
        userId: 1,
        total: 35,
        products: [
          {
            id: 1,
            title: "Item A",
            price: 10,
            quantity: 2,
            total: 20,
          },
          {
            id: 2,
            title: "Item B",
            price: 15,
            quantity: 1,
            total: 15,
          },
        ],
      },
      {
        id: 11,
        userId: 1,
        total: 30,
        products: [
          {
            id: 3,
            title: "Item C",
            price: 10,
            quantity: 3,
            total: 30,
          },
        ],
      },
    ];

    const result = mapUsersAndCartsToCustomerSummary(users, carts);

    expect(result).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        totalProducts: 6,
        totalSpent: 65,
        carts: [
          {
            id: 10,
            total: 35,
            products: [
              {
                id: 1,
                title: "Item A",
                price: 10,
                quantity: 2,
                total: 20,
              },
              {
                id: 2,
                title: "Item B",
                price: 15,
                quantity: 1,
                total: 15,
              },
            ],
          },
          {
            id: 11,
            total: 30,
            products: [
              {
                id: 3,
                title: "Item C",
                price: 10,
                quantity: 3,
                total: 30,
              },
            ],
          },
        ],
      },
    ]);
  });

  it("maps multiple users and ignores carts from other users", () => {
    const users: UserDTO[] = [
      baseUser,
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
      },
    ];
    const carts: CartDTO[] = [
      {
        id: 20,
        userId: 2,
        total: 40,
        products: [{ quantity: 4, total: 40 }],
      },
    ];

    const result = mapUsersAndCartsToCustomerSummary(users, carts);

    expect(result).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        totalProducts: 0,
        totalSpent: 0,
        carts: [],
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        totalProducts: 4,
        totalSpent: 40,
        carts: [
          {
            id: 20,
            total: 40,
            products: [
              {
                id: 1,
                title: "Produto 1",
                price: 10,
                quantity: 4,
                total: 40,
              },
            ],
          },
        ],
      },
    ]);
  });

  it("derives missing product fields and cart totals from available data", () => {
    const users: UserDTO[] = [baseUser];
    const carts: CartDTO[] = [
      {
        id: 30,
        userId: 1,
        products: [
          {
            quantity: 2,
            total: 50,
            thumbnail: "https://cdn.example.com/item.png",
          },
        ],
      },
    ];

    const result = mapUsersAndCartsToCustomerSummary(users, carts);

    expect(result[0]).toEqual({
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      totalProducts: 2,
      totalSpent: 50,
      carts: [
        {
          id: 30,
          total: 50,
          products: [
            {
              id: 1,
              title: "Produto 1",
              price: 25,
              quantity: 2,
              total: 50,
              thumbnail: "https://cdn.example.com/item.png",
            },
          ],
        },
      ],
    });
  });

  it("preserves user order from the input list", () => {
    const users: UserDTO[] = [
      { id: 3, firstName: "C", lastName: "User", email: "c@example.com" },
      { id: 1, firstName: "A", lastName: "User", email: "a@example.com" },
      { id: 2, firstName: "B", lastName: "User", email: "b@example.com" },
    ];

    const result = mapUsersAndCartsToCustomerSummary(users, []);

    expect(result.map((customer) => customer.id)).toEqual([3, 1, 2]);
  });

  it("handles carts with no products without affecting totals", () => {
    const users: UserDTO[] = [baseUser];
    const carts: CartDTO[] = [
      {
        id: 40,
        userId: 1,
        total: 0,
        products: [],
      },
    ];

    const result = mapUsersAndCartsToCustomerSummary(users, carts);

    expect(result[0]?.totalProducts).toBe(0);
    expect(result[0]?.totalSpent).toBe(0);
    expect(result[0]?.carts).toEqual([
      {
        id: 40,
        total: 0,
        products: [],
      },
    ]);
  });
});
