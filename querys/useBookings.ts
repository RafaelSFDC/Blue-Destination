import { useQuery } from "@tanstack/react-query";
import { getUserBookings } from "@/actions/bookings";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const bookings = await getUserBookings();
        return bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    },
  });
}
