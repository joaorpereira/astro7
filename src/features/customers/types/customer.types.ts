import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const CartProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number(),
  total: z.number(),
  thumbnail: z.string().optional(),
});

export const CartSchema = z.object({
  id: z.number(),
  userId: z.number(),
  total: z.number().optional(),
  products: z.array(CartProductSchema),
});

export const CartsResponseSchema = z.object({
  carts: z.array(CartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type UserDTO = z.infer<typeof UserSchema>;
export type CartDTO = z.infer<typeof CartSchema>;
export type CartProductDTO = z.infer<typeof CartProductSchema>;

export type CustomerCartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail?: string;
};

export type CustomerCart = {
  id: number;
  total: number;
  products: CustomerCartProduct[];
};

export type CustomerSummary = {
  id: number;
  name: string;
  email: string;
  totalProducts: number;
  totalSpent: number;
  carts: CustomerCart[];
};

export type SortDirection = "asc" | "desc";
