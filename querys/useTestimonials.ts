import { useQuery } from '@tanstack/react-query';
import { 
  getTestimonials, 
  getTestimonialsByPackage, 
  getTestimonialsByDestination,
  getRecentTestimonials 
} from "@/actions/tertimonials";
import { Testimonial } from "@/lib/types";

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const testimonials = await getTestimonials();
      return testimonials;
    },
  });
}

export function useRecentTestimonials(limit?: number) {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'recent', limit],
    queryFn: async () => {
      const testimonials = await getRecentTestimonials();
      return testimonials;
    },
  });
}

export function useTestimonialsByPackage(packageId: string) {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'package', packageId],
    queryFn: async () => {
      const testimonials = await getTestimonialsByPackage(packageId);
      return testimonials;
    },
    enabled: !!packageId,
  });
}

export function useTestimonialsByDestination(destinationId: string) {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'destination', destinationId],
    queryFn: async () => {
      const testimonials = await getTestimonialsByDestination(destinationId);
      return testimonials;
    },
    enabled: !!destinationId,
  });
}

export default useTestimonials;