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
  };
};

// IDs das coleções
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_COLLECTION_USERS!,
  DESTINATIONS: process.env.NEXT_PUBLIC_COLLECTION_DESTINATIONS!,
  PACKAGES: process.env.NEXT_PUBLIC_COLLECTION_PACKAGES!,
  BOOKINGS: process.env.NEXT_PUBLIC_COLLECTION_BOOKINGS!,
  TESTIMONIALS: process.env.NEXT_PUBLIC_COLLECTION_TESTIMONIALS!,
  MESSAGES: process.env.NEXT_PUBLIC_COLLECTION_MESSAGES!,
  TAGS: process.env.NEXT_PUBLIC_COLLECTION_TAGS!,
  ITINERARY: process.env.NEXT_PUBLIC_COLLECTION_ITINERARY!,
  STORAGE: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
} as const;
