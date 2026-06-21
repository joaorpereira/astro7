"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { mapUsersAndCartsToCustomerSummary } from "@/features/customers/adapters/customer.adapter";
import { getCartsForUsers } from "@/features/customers/services/carts.service";
import {
  getUsers,
  searchUsers,
} from "@/features/customers/services/users.service";
import type { CustomerSummary } from "@/features/customers/types/customer.types";

interface UseCustomersParams {
  page: number;
  pageSize: number;
  search: string;
}

interface UseCustomersResult {
  data: CustomerSummary[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCustomers({
  page,
  pageSize,
  search,
}: UseCustomersParams): UseCustomersResult {
  const skip = (page - 1) * pageSize;
  const normalizedSearch = search.trim();

  const usersQuery = useQuery({
    queryKey: ["users", page, pageSize, normalizedSearch],
    queryFn: () =>
      normalizedSearch
        ? searchUsers({
            query: normalizedSearch,
            limit: pageSize,
            skip,
          })
        : getUsers({ limit: pageSize, skip }),
  });

  const userIds = useMemo(
    () => usersQuery.data?.users.map((user) => user.id) ?? [],
    [usersQuery.data?.users],
  );

  const cartsQuery = useQuery({
    queryKey: ["carts", userIds],
    queryFn: () => getCartsForUsers(userIds),
    enabled: usersQuery.isSuccess && userIds.length > 0,
  });

  const data = useMemo(() => {
    if (!usersQuery.data) {
      return [];
    }

    return mapUsersAndCartsToCustomerSummary(
      usersQuery.data.users,
      cartsQuery.data ?? [],
    );
  }, [usersQuery.data, cartsQuery.data]);

  const error =
    usersQuery.error instanceof Error
      ? usersQuery.error
      : cartsQuery.error instanceof Error
        ? cartsQuery.error
        : null;

  const isLoading =
    usersQuery.isLoading || (userIds.length > 0 && cartsQuery.isLoading);

  const isFetching = usersQuery.isFetching || cartsQuery.isFetching;

  const handleRefetch = () => {
    void usersQuery.refetch();
    void cartsQuery.refetch();
  };

  return {
    data,
    totalItems: usersQuery.data?.total ?? 0,
    isLoading,
    isFetching,
    error,
    refetch: handleRefetch,
  };
}
