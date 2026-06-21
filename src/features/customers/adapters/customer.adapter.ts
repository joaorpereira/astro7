import type {
  CartDTO,
  CartProductDTO,
  CustomerCart,
  CustomerCartProduct,
  CustomerSummary,
  UserDTO,
} from "@/features/customers/types/customer.types";

function mapCartProduct(
  product: CartProductDTO,
  index: number,
): CustomerCartProduct {
  return {
    id: product.id ?? index + 1,
    title: product.title ?? `Produto ${index + 1}`,
    price: product.price ?? product.total / Math.max(product.quantity, 1),
    quantity: product.quantity,
    total: product.total,
    thumbnail: product.thumbnail,
  };
}

function mapUserCarts(carts: CartDTO[]): CustomerCart[] {
  return carts.map((cart) => ({
    id: cart.id,
    total:
      cart.total ??
      cart.products.reduce((sum, product) => sum + product.total, 0),
    products: cart.products.map(mapCartProduct),
  }));
}

function aggregateCartTotals(carts: CartDTO[]) {
  return carts.reduce(
    (acc, cart) => {
      cart.products.forEach((product) => {
        acc.totalProducts += product.quantity;
        acc.totalSpent += product.total;
      });

      return acc;
    },
    { totalProducts: 0, totalSpent: 0 },
  );
}

export function mapUsersAndCartsToCustomerSummary(
  users: UserDTO[],
  carts: CartDTO[],
): CustomerSummary[] {
  const cartsByUserId = carts.reduce<Map<number, CartDTO[]>>(
    (acc, cart) => {
      const userCarts = acc.get(cart.userId) ?? [];
      userCarts.push(cart);
      acc.set(cart.userId, userCarts);
      return acc;
    },
    new Map(),
  );

  return users.map((user) => {
    const userCarts = cartsByUserId.get(user.id) ?? [];
    const { totalProducts, totalSpent } = aggregateCartTotals(userCarts);

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      totalProducts,
      totalSpent,
      carts: mapUserCarts(userCarts),
    };
  });
}
