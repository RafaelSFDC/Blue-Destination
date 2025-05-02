//faça o componente

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/users";

export function useUsers() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await getUsers();
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
  });
}
