"use server";
import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { testimonialArraySchema } from "@/lib/schemas/testimonial";

export async function getTestimonials() {
  const client = await createSessionClient();

  const testimonials = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TESTIMONIALS
  );

  return testimonials.documents;
}

export async function getRecentTestimonials() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TESTIMONIALS,
    [Query.orderDesc("date"), Query.limit(6)]
  );
  const testimonials = testimonialArraySchema.parse(response.documents);

  return testimonials;
}
