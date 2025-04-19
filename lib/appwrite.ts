import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

// Configuração do cliente Appwrite
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Seu endpoint Appwrite
  .setProject("seu-project-id"); // Seu Project ID

// Exportando serviços
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// IDs das coleções (você precisará criar estas coleções no console do Appwrite)
export const COLLECTIONS = {
  USERS: "users",
  DESTINATIONS: "destinations",
  PACKAGES: "packages",
  BOOKINGS: "bookings",
  TESTIMONIALS: "testimonials",
  MESSAGES: "messages",
  TAGS: "tags",
  ITINERARY: "itinerary",
} as const;

// ID do banco de dados
export const DATABASE_ID = "seu-database-id";

// ID do bucket de storage para imagens
export const STORAGE_BUCKET_ID = "seu-bucket-id";
