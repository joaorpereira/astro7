import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getUsers,
  searchUsers,
} from "@/features/customers/services/users.service";

describe("getUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches paginated users with the expected query params", async () => {
    const mockResponse = {
      users: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
      ],
      total: 208,
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

    await expect(getUsers({ limit: 10, skip: 0 })).resolves.toEqual({
      users: mockResponse.users,
      total: 208,
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/users?limit=10&skip=0&select=id%2CfirstName%2ClastName%2Cemail",
    );
  });

  it("throws when the API response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(getUsers({ limit: 10, skip: 0 })).rejects.toThrow(
      "Failed to fetch users",
    );
  });
});

describe("searchUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("searches users with the expected query params", async () => {
    const mockResponse = {
      users: [
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
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

    await expect(
      searchUsers({ query: "jane", limit: 10, skip: 0 }),
    ).resolves.toEqual({
      users: mockResponse.users,
      total: 1,
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/users/search?q=jane&limit=10&skip=0&select=id%2CfirstName%2ClastName%2Cemail",
    );
  });
});
