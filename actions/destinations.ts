"use server";
import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { destinationArraySchema } from "@/lib/schemas/destination";

export async function getDestinations() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.DESTINATIONS
  );
  const destinations = destinationArraySchema.parse(response.documents);
  return destinations;
}

export async function getDestinationById(id: string) {
  const client = await createSessionClient();

  const destination = await client.databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.DESTINATIONS,
    id
  );

  return destination;
}

export async function getFeaturedDestinations({ limit }: { limit?: number }) {
  const client = await createSessionClient();

  const queries = [Query.equal("featured", true)];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.DESTINATIONS,
    queries
  );
  const destinations = destinationArraySchema.parse(response.documents);

  return destinations;
}
