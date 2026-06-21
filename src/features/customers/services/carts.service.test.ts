import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getCartsByUserId,
  getCartsForUsers,
} from "@/features/customers/services/carts.service";

describe("getCartsByUserId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses carts for a user", async () => {
    const mockResponse = {
      carts: [
        {
          id: 1,
          userId: 7,
          total: 100,
          products: [{ id: 1, quantity: 2, total: 100 }],
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      }),
    );

    await expect(getCartsByUserId(7)).resolves.toEqual(mockResponse.carts);
    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/carts/user/7");
  });

  it("throws when the API response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(getCartsByUserId(7)).rejects.toThrow(
      "Failed to fetch carts for user 7",
    );
  });
});

describe("getCartsForUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an empty array when no user ids are provided", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCartsForUsers([])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches carts for all users in parallel and flattens the result", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            carts: [{ id: 1, userId: 1, products: [] }],
            total: 1,
            skip: 0,
            limit: 10,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            carts: [{ id: 2, userId: 2, products: [] }],
            total: 1,
            skip: 0,
            limit: 10,
          }),
        }),
    );

    const result = await getCartsForUsers([1, 2]);

    expect(result).toEqual([
      { id: 1, userId: 1, products: [] },
      { id: 2, userId: 2, products: [] },
    ]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
