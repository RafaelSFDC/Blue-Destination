import { Client, Account, Databases, Storage, Functions } from "appwrite";

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

// IDs das coleções (você precisará criar estas coleções no console do Appwrite)
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_USERS!,
  DESTINATIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_DESTINATIONS!,
  PACKAGES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PACKAGES!,
  BOOKINGS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_BOOKINGS!,
  TESTIMONIALS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TESTIMONIALS!,
  MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_MESSAGES!,
  TAGS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TAGS!,
  ITINERARY: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_ITINERARY!,
  STORAGE: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
} as const;
