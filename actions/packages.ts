"use server";
import { Query, ID } from "appwrite";
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

/**
 * Cria um novo pacote de viagem
 */
export async function createPackage(packageData: {
  name: string;
  description: string;
  imageUrl?: string;
  gallery?: string[];
  price: number;
  duration: number;
  destinations: string[]; // IDs das destinações
  tags: string[]; // IDs das tags
  featured: boolean;
  discount?: string; // ID do desconto (relação com Discounts)
  discounts?: string[]; // IDs dos descontos (relação com múltiplos Discounts)
  inclusions: string[]; // IDs das inclusões
  maxGuests?: number;
  excluded?: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities?: string[]; // IDs das atividades
    meals?: string; // ID da refeição
    accommodation?: string; // ID da acomodação
  }>;
  availability?: Array<{
    startDate: string;
    endDate: string;
    slots: number;
  }>;
  requirements?: string[];
}) {
  const client = await createSessionClient();

  try {
    // Preparar dados para inserção
    const newPackage = {
      ...packageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Gerar slug a partir do nome
      slug: packageData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-"),
    };

    // Criar documento no Appwrite
    const packageResponse = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      ID.unique(),
      newPackage
    );

    // Se houver itinerários, criar documentos de itinerário relacionados
    if (packageData.itinerary && packageData.itinerary.length > 0) {
      await Promise.all(
        packageData.itinerary.map((item) =>
          client.databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            COLLECTIONS.ITINERARY,
            ID.unique(),
            {
              package: packageResponse.$id,
              day: item.day,
              title: item.title,
              description: item.description,
              activities: item.activities || [],
              meals: item.meals || null,
              accommodation: item.accommodation || null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          )
        )
      );
    }

    // Se houver disponibilidade, criar documentos de disponibilidade relacionados
    if (packageData.availability && packageData.availability.length > 0) {
      await Promise.all(
        packageData.availability.map((item) =>
          client.databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            COLLECTIONS.AVAILABILITY,
            ID.unique(),
            {
              package: packageResponse.$id,
              startDate: item.startDate,
              endDate: item.endDate,
              slots: item.slots,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          )
        )
      );
    }

    return packageSchema.parse(packageResponse);
  } catch (error) {
    console.error("Error creating package:", error);
    throw new Error("Falha ao criar pacote. Por favor, tente novamente.");
  }
}
