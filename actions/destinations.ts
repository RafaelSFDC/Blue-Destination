"use server";
import { ID, Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { destinationArraySchema } from "@/lib/schemas/destination";
import { DestinationFormValues } from "@/lib/schemas/destination-form";

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

  try {
    const destination = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.DESTINATIONS,
      id
    );

    return destination;
  } catch (error) {
    console.error("Error fetching destination:", error);
    return null;
  }
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

/**
 * Cria um novo destino
 */
export async function createDestination(
  destinationData: DestinationFormValues
) {
  const client = await createSessionClient();

  try {
    // Preparar dados para inserção
    const newDestination = {
      ...destinationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Criar documento no Appwrite
    const destinationResponse = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.DESTINATIONS,
      ID.unique(),
      newDestination
    );

    return destinationResponse;
  } catch (error) {
    console.error("Error creating destination:", error);
    throw new Error("Falha ao criar destino. Por favor, tente novamente.");
  }
}

/**
 * Atualiza um destino existente
 */
export async function updateDestination(
  id: string,
  destinationData: Partial<DestinationFormValues>
) {
  const client = await createSessionClient();

  try {
    // Preparar dados para atualização
    const updateData = {
      ...destinationData,
      updatedAt: new Date().toISOString(),
    };

    // Atualizar documento no Appwrite
    const destinationResponse = await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.DESTINATIONS,
      id,
      updateData
    );

    return destinationResponse;
  } catch (error) {
    console.error("Error updating destination:", error);
    throw new Error("Falha ao atualizar destino. Por favor, tente novamente.");
  }
}

/**
 * Exclui um destino existente
 */
export async function deleteDestination(id: string) {
  const client = await createSessionClient();

  try {
    // Verificar se há pacotes associados a este destino
    const packages = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      [Query.search("destinations", id)]
    );

    if (packages.documents.length > 0) {
      throw new Error(
        "Este destino não pode ser excluído porque está associado a pacotes."
      );
    }

    // Excluir o destino
    await client.databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.DESTINATIONS,
      id
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting destination:", error);
    throw error;
  }
}
