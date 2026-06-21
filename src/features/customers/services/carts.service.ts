import {
  CartsResponseSchema,
  type CartDTO,
} from "@/features/customers/types/customer.types";

const CARTS_API_URL = "https://dummyjson.com/carts";

export async function getCartsByUserId(userId: number): Promise<CartDTO[]> {
  const response = await fetch(`${CARTS_API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch carts for user ${userId}`);
  }

  const data: unknown = await response.json();
  const parsed = CartsResponseSchema.parse(data);

  return parsed.carts;
}

export async function getCartsForUsers(userIds: number[]): Promise<CartDTO[]> {
  if (userIds.length === 0) {
    return [];
  }

  const cartsByUser = await Promise.all(
    userIds.map((userId) => getCartsByUserId(userId)),
  );

  return cartsByUser.flat();
}
