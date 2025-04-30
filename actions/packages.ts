"use server";
import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { packageArraySchema, packageSchema } from "@/lib/schemas/package";

export async function getPackages() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.PACKAGES
  );
  const packages = packageArraySchema.parse(response.documents);
  return packages;
}

export async function getFeaturedPackages({ limit }: { limit?: number }) {
  const client = await createSessionClient();

  const queries = [Query.equal("featured", true)];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.PACKAGES,
    queries
  );
  const packages = packageArraySchema.parse(response.documents);
  return packages;
}

export async function getPackageById(id: string) {
  const client = await createSessionClient();

  const response = await client.databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.PACKAGES,
    id
  );

  const packageItem = packageSchema.parse(response);
  return packageItem;
}
