import { useQuery } from '@tanstack/react-query';
import { getTags, getTagsByType } from "@/actions/tags";
import { Tag } from "@/lib/schemas/tag";

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const tags = await getTags();
      return tags;
    },
  });
}

export function useTagsByType(type: string) {
  return useQuery<Tag[]>({
    queryKey: ['tags', 'type', type],
    queryFn: async () => {
      const tags = await getTagsByType({ type });
      return tags;
    },
    enabled: !!type, // Só executa a query se o tipo for fornecido
  });
}

export default useTags;