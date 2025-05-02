import { Client, Account, Databases, Storage } from "appwrite";
import { cookies } from "next/headers";
import { userSchema } from "./schemas/user";

export const createSessionClient = async (session?: string) => {
  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "");
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  if (session) {
    client.setSession(session);
  } else if (typeof window === "undefined") {
    try {
      const cookieStore = await cookies();
      console.log("Cookie store:", cookieStore.getAll());
      const sessionCookie = cookieStore.get("auth_token");
      if (sessionCookie) {
        client.setSession(sessionCookie.value);
      }
    } catch (error) {
      // Silenciosamente falha se não conseguir acessar cookies
      console.log("Não foi possível acessar cookies de sessão");
    }
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
  STORAGE: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!,
} as const;

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  const client = await createSessionClient();

  try {
    // Criar novo usuário
    const newUser = await client.account.create(
      "unique()",
      email,
      password,
      name
    );
    // Fazer login automaticamente e obter a sessão
    const session = await client.account.createEmailPasswordSession(
      email,
      password
    );

    // Criar documento no banco de dados com client autenticado
    const userDoc = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      newUser.$id,
      {
        email,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    // Validar e retornar o usuário
    const user = userSchema.parse({
      ...userDoc,
      $id: newUser.$id,
      email,
      name,
      role: "user",
      avatar: null,
    });
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Erro ao fazer login. Tente novamente.");
  }
};
