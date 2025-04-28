import { Client, Account, Databases, Storage } from "appwrite";

export const createSessionClient = async (session?: string) => {
  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "");
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  if (session) {
    client.setSession(session);
  }
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get query() {
      return client.query;
    },
  };
};

// IDs das coleções
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_COLLECTION_USERS!,
  ADDRESSES: process.env.NEXT_PUBLIC_COLLECTION_ADDRESSES!,
  DESTINATIONS: process.env.NEXT_PUBLIC_COLLECTION_DESTINATIONS!,
  PACKAGES: process.env.NEXT_PUBLIC_COLLECTION_PACKAGES!,
  ACTIVITIES: process.env.NEXT_PUBLIC_COLLECTION_ACTIVITIES!,
  TESTIMONIALS: process.env.NEXT_PUBLIC_COLLECTION_TESTIMONIALS!,
  NOTIFICATIONS: process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS!,
  BOOKINGS: process.env.NEXT_PUBLIC_COLLECTION_BOOKINGS!,
  ITINERARY: process.env.NEXT_PUBLIC_COLLECTION_ITINERARY!,
  TAGS: process.env.NEXT_PUBLIC_COLLECTION_TAGS!,
  MEALS: process.env.NEXT_PUBLIC_COLLECTION_MEALS!,
  ACCOMMODATIONS: process.env.NEXT_PUBLIC_COLLECTION_ACCOMMODATIONS!,
  USER_PREFERENCES: process.env.NEXT_PUBLIC_COLLECTION_USER_PREFERENCES!,
  DISCOUNTS: process.env.NEXT_PUBLIC_COLLECTION_DISCOUNTS!,
  INCLUSIONS: process.env.NEXT_PUBLIC_COLLECTION_INCLUSIONS!,
  AVAILABILITY: process.env.NEXT_PUBLIC_COLLECTION_AVAILABILITY!,
  PASSENGERS: process.env.NEXT_PUBLIC_COLLECTION_PASSENGERS!,
  PAYMENTS: process.env.NEXT_PUBLIC_COLLECTION_PAYMENTS!,
  FAVORITES: process.env.NEXT_PUBLIC_COLLECTION_FAVORITES!,
} as const;
