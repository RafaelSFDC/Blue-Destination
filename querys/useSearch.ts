import { useQuery } from '@tanstack/react-query';
import { searchPackages, getFilterRanges } from "@/actions/search";
import type { SearchFilters } from "@/lib/types";

export function useSearchPackages(filters: SearchFilters) {
  return useQuery({
    queryKey: ['packages', 'search', filters],
    queryFn: async () => {
      const packages = await searchPackages(filters);
      return {
        results: packages,
        totalResults: packages.length,
        hasMore: false // Implementação simplificada, pode ser melhorada no futuro
      };
    },
  });
}

export function useFilterRanges() {
  return useQuery({
    queryKey: ['filterRanges'],
    queryFn: async () => {
      const ranges = await getFilterRanges();
      return ranges;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export default useSearchPackages;
