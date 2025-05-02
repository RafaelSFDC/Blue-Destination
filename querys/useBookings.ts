import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "@/actions/bookings";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const bookings = await getAllBookings();
        return bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    },
  });
}
