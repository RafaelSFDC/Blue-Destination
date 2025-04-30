import { useQuery } from '@tanstack/react-query';
import { 
  getDestinationById, 
  getFeaturedDestinations,
  getPopularDestinations 
} from "@/lib/actions";
import { Destination } from "@/lib/types";
import { getDestinations } from '@/actions/destinations';

export function useDestinations() {
  return useQuery<Destination[]>({
    queryKey: ['destinations'],
    queryFn: async () => {
      const destinations = await getDestinations();
      return destinations;
    },
  });
}

export function useDestinationById(id: string) {
  return useQuery<Destination | null>({
    queryKey: ['destination', id],
    queryFn: async () => {
      const destination = await getDestinationById(id);
      return destination;
    },
    enabled: !!id,
  });
}

export function useFeaturedDestinations(limit?: number) {
  return useQuery<Destination[]>({
    queryKey: ['destinations', 'featured', limit],
    queryFn: async () => {
      const destinations = await getFeaturedDestinations(limit);
      return destinations;
    },
  });
}

export function usePopularDestinations(limit?: number) {
  return useQuery<Destination[]>({
    queryKey: ['destinations', 'popular', limit],
    queryFn: async () => {
      const destinations = await getPopularDestinations(limit);
      return destinations;
    },
  });
}

export default useDestinations;