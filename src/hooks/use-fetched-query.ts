import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useFetchedQuery = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData(queryKey);
};
