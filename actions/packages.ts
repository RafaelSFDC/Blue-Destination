"use server";

import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { packageArraySchema } from "@/lib/schemas/package";

export async function getFeaturedPackages() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.PACKAGES,
    [Query.equal("featured", true)]
  );
  const packages = packageArraySchema.parse(response.documents);
  console.log(packages);
  return packages;
}
