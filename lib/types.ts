//================================================== TYPE DEFINITIONS ==================================================//

// Enums para melhor type-safety
export enum BookingStatus {
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  CONFIRMED = "confirmed",
  PENDING = "pending",
}

export enum MessageStatus {
  ARCHIVED = "archived",
  DELETED = "deleted", // Novo status
  READ = "read",
  UNREAD = "unread",
}

export enum PaymentStatus {
  FAILED = "failed", // Novo status
  PAID = "paid",
  PENDING = "pending",
  REFUNDED = "refunded",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface SearchFilters {
  dateRange?: {
    // Adicionado: filtro por data
    start: string;
    end: string;
  };
  destinationId?: string;
  limit?: number;
  maxDuration?: number;
  maxPrice?: number;
  minDuration?: number;
  minPrice?: number;
  page?: number;
  query?: string;
  ratings?: number[];
  sortBy?: string;
  tagIds?: string[];
  tags?: Tag[];
  travelers?: number;
}

//================================================== COLLECTION MODELS ==================================================//

export interface Accommodation {
  type: string;
  name: string;
  rating?: number;
  createAt: string;
  updatedAt: string;
}

export interface Activity {
  $id: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  featured: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

// Nova interface para endereço
export interface Address {
  $id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  $id: string;
  startDate: string;
  endDate: string;
  slots: number;
  status: "available" | "unavailable";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  $id: string;
  user: User;
  packages: Package;
  status: BookingStatus;
  bookingDate: string;
  travelDate: string;
  travelers: number;
  totalPrice: number;
  payment: Payment;
  Passengers?: Passengers[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  $id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  $id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery?: string[]; // Adicionado: mais imagens
  featured: boolean;
  popular?: boolean;
  tags: Tag[];
  region?: string;
  coordinates?: {
    // Adicionado: para mapas
    latitude: number;
    longitude: number;
  };
  testimonials?: Testimonial[];
  createdAt: string;
  updatedAt: string;
}

export interface Discounts {
  $id: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  $id: string;
  type: "destination" | "package";
  itemId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inclusion {
  $id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  $id: string;
  package: Package;
  day: number;
  title: string;
  description: string;
  activities?: Activity[]; // Adicionado: atividades
  meals?: Meals; // Adicionado: refeições
  accommodation?: Accommodation; // Adicionado: hospedagem
  createdAt: string;
  updatedAt: string;
}

export interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  createAt: string;
  updatedAt: string;
}

export interface Notification {
  $id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  $id: string;
  name: string;
  description: string;
  imageUrl: string;
  gallery?: string[]; // Adicionado: mais imagens
  price: number;
  duration: number;
  destinations: Destination[];
  featured: boolean;
  discounts?: Discounts[];
  tags: Tag[];
  inclusions: Inclusion[];
  maxGuests?: number;
  excluded?: string[];
  itineraries?: Itinerary[];
  testimonials?: Testimonial[];
  bookings?: Booking[];
  availability?: Availability[];
  requirements?: string[]; // Adicionado: requisitos
  createdAt: string;
  updatedAt: string;
}

export interface Passengers {
  $id: string;
  name: string;
  document: string;
  birthDate: string;
  specialNeeds?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  $id: string;
  booking: Booking;
  amount: number;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  $id: string;
  userId: string;
  title: string;
  content: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  type: "destination" | "package";
  itemId: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  $id: string;
  name: string;
  slug: string;
  type: "destination" | "package";
  description?: string;
  color?: string; // Adicionado: para estilização
  icon?: string; // Adicionado: para UI
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  $id: string;
  user: User;
  package?: Package;
  destination?: Destination;
  rating: number;
  comment: string;
  date: string;
  featured?: boolean;
  imageUrl?: string; // Adicionado: imagem do depoimento
  likes?: number; // Adicionado: interações
  helpful?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  phone?: string; // Adicionado: contato
  addresses?: Address[]; // Adicionado: endereço
  favorites?: Favorite[];
  bookings: Booking[];
  notifications?: Notification[];
  testimonials?: Testimonial[];
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences; // Adicionado: preferências
}

// Nova interface para preferências do usuário
export interface UserPreferences {
  $id: string;
  newsletter: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  currency: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}
