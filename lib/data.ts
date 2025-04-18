import type { Destination } from "@/lib/types"

export const mockDestinations: Destination[] = [
  {
    id: "dest-001",
    name: "Maldivas",
    description: "Paraíso tropical com águas cristalinas",
    location: "Oceano Índico",
    imageUrl: "/destinations/maldivas.jpg",
    price: 12000,
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    popular: true,
    region: "Ásia",
    tags: ["praia", "luxo", "romântico"]
  },
  // ... other destinations
]
