// Entidades Base
export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: "destination" | "package"; // para diferenciar tags de destinos e pacotes
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isLoggedIn: boolean;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  featured: boolean;
  popular?: boolean;
  tagIds: string[]; // alterado de tags para tagIds
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
  destinationIds: string[]; // alterado de destinations para destinationIds
  featured: boolean;
  discount?: number;
  tagIds: string[]; // alterado de tags para tagIds
  inclusions: string[];
  maxGuests?: number;
  excluded?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  id: string;
  packageId: string;
  day: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  userId: string; // alterado: agora referencia o User
  packageId: string;
  destinationId?: string;
  rating: number;
  comment: string;
  date: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  userId: string; // alterado: agora referencia o User
  subject: string;
  content: string;
  status: "unread" | "read" | "archived";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  travelDate: string;
  travelers: number;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}

// Interfaces auxiliares
export interface AuthResult {
  success: boolean;
  user: User | null;
  message?: string;
}

export interface SearchFilters {
  query?: string;
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  ratings?: number[];
  tagIds?: string[]; // alterado de tags para tagIds
  tags?: string[]; // mantido para compatibilidade com dados mock
  sortBy?: string;
  page?: number;
  limit?: number;
  travelers?: number;
}
