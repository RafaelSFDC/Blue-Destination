"use server";
import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { userArraySchema } from "@/lib/schemas/user";

export async function getUsers() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.USERS
  );
  const users = userArraySchema.parse(response.documents);
  return users;
}
