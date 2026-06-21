import {
  UsersResponseSchema,
  type UserDTO,
} from "@/features/customers/types/customer.types";

const USERS_API_URL = "https://dummyjson.com/users";

export interface GetUsersParams {
  limit: number;
  skip: number;
}

export interface PaginatedUsersResult {
  users: UserDTO[];
  total: number;
}

export interface SearchUsersParams extends GetUsersParams {
  query: string;
}

async function fetchUsers(url: string): Promise<PaginatedUsersResult> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: unknown = await response.json();
  const parsed = UsersResponseSchema.parse(data);

  return {
    users: parsed.users,
    total: parsed.total,
  };
}

export async function getUsers({
  limit,
  skip,
}: GetUsersParams): Promise<PaginatedUsersResult> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: "id,firstName,lastName,email",
  });

  return fetchUsers(`${USERS_API_URL}?${params.toString()}`);
}

export async function searchUsers({
  query,
  limit,
  skip,
}: SearchUsersParams): Promise<PaginatedUsersResult> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    skip: String(skip),
    select: "id,firstName,lastName,email",
  });

  return fetchUsers(`${USERS_API_URL}/search?${params.toString()}`);
}
