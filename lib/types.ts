export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  isLoggedIn: boolean
  avatar: string | null
}

export interface AuthResult {
  success: boolean
  user: User | null
  message?: string
}

export interface Package {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  duration: number
  destinations: string[]
  featured: boolean
  discount?: number
  tags: string[]
  inclusions: string[]
  maxGuests?: number
  excluded?: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
  }>
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  packageId: string
  destinationId?: string
  date: string
  featured?: boolean
}

export interface Destination {
  id: string
  name: string
  location: string
  description: string
  price: number
  rating: number
  reviewCount: number
  imageUrl: string
  featured: boolean
  popular?: boolean
  tags: string[]
  region?: string
}

export interface SearchFilters {
  query?: string
  destinationId?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  ratings?: number[]
  tags?: string[]
  sortBy?: string
  page?: number
  limit?: number
  travelers?: number
}

export interface Booking {
  id: string
  userId: string
  packageId: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  bookingDate: string
  travelDate: string
  travelers: number
  totalPrice: number
  paymentStatus: "pending" | "paid" | "refunded"
}

