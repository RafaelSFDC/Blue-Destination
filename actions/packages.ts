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

  try {
    const response = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      id
    );

    const packageItem = packageSchema.parse(response);
    return packageItem;
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
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
  discounts?: any[]; // Array de objetos de desconto
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
    // Separar o itinerário dos dados do pacote
    const { itinerary, ...packageDataWithoutItinerary } = packageData;

    // Preparar dados para inserção
    const newPackage = {
      ...packageDataWithoutItinerary,
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
    if (itinerary && itinerary.length > 0) {
      await Promise.all(
        itinerary.map((item) =>
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

/**
 * Atualiza um pacote existente
 */
export async function updatePackage(
  id: string,
  packageData: {
    name?: string;
    description?: string;
    imageUrl?: string;
    gallery?: string[];
    price?: number;
    duration?: number;
    destinations?: string[]; // IDs das destinações
    tags?: string[]; // IDs das tags
    featured?: boolean;
    discount?: string; // ID do desconto (relação com Discounts)
    discounts?: any[]; // Array de objetos de desconto
    inclusions?: string[]; // IDs das inclusões
    maxGuests?: number;
    excluded?: string[];
    itinerary?: Array<{
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
  }
) {
  const client = await createSessionClient();

  try {
    // Preparar dados para atualização - removendo campos que não existem diretamente no documento
    const { itinerary, ...dataToUpdate } = packageData;

    // Criar uma cópia para não modificar o objeto original
    const updateData: any = {
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    };

    // Se o nome foi alterado, atualizar o slug também
    if (packageData.name) {
      updateData.slug = packageData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");
    }

    // Atualizar documento no Appwrite
    const packageResponse = await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      id,
      updateData
    );

    // Se houver itinerários, atualizar documentos de itinerário relacionados
    if (itinerary) {
      try {
        // Primeiro, excluir itinerários existentes
        const existingItineraries = await client.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          COLLECTIONS.ITINERARY,
          [Query.equal("package", id)]
        );

        await Promise.all(
          existingItineraries.documents.map((item) =>
            client.databases.deleteDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              COLLECTIONS.ITINERARY,
              item.$id
            )
          )
        );

        // Criar novos itinerários
        await Promise.all(
          itinerary.map((item) =>
            client.databases.createDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              COLLECTIONS.ITINERARY,
              ID.unique(),
              {
                package: id,
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
      } catch (error) {
        console.error("Error updating itineraries:", error);
        // Continuar mesmo se houver erro na atualização dos itinerários
      }
    }

    // Se houver disponibilidade, atualizar documentos de disponibilidade relacionados
    if (packageData.availability) {
      try {
        // Primeiro, excluir disponibilidades existentes
        const existingAvailability = await client.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          COLLECTIONS.AVAILABILITY,
          [Query.equal("package", id)]
        );

        await Promise.all(
          existingAvailability.documents.map((item) =>
            client.databases.deleteDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              COLLECTIONS.AVAILABILITY,
              item.$id
            )
          )
        );

        // Criar novas disponibilidades
        await Promise.all(
          packageData.availability.map((item) =>
            client.databases.createDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              COLLECTIONS.AVAILABILITY,
              ID.unique(),
              {
                package: id,
                startDate: item.startDate,
                endDate: item.endDate,
                slots: item.slots,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            )
          )
        );
      } catch (error) {
        console.error("Error updating availability:", error);
        // Continuar mesmo se houver erro na atualização da disponibilidade
      }
    }

    return packageSchema.parse(packageResponse);
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Falha ao atualizar pacote. Por favor, tente novamente.");
  }
}

/**
 * Exclui um pacote existente
 */
export async function deletePackage(id: string) {
  const client = await createSessionClient();

  try {
    // Primeiro, excluir documentos relacionados (itinerários)
    try {
      const itineraries = await client.databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.ITINERARY,
        [Query.equal("package", id)]
      );

      await Promise.all(
        itineraries.documents.map((item) =>
          client.databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            COLLECTIONS.ITINERARY,
            item.$id
          )
        )
      );
    } catch (error) {
      console.error("Error deleting related itineraries:", error);
      // Continuar mesmo se houver erro na exclusão dos itinerários
    }

    // Excluir documentos relacionados (disponibilidade)
    try {
      const availability = await client.databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.AVAILABILITY,
        [Query.equal("package", id)]
      );

      await Promise.all(
        availability.documents.map((item) =>
          client.databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            COLLECTIONS.AVAILABILITY,
            item.$id
          )
        )
      );
    } catch (error) {
      console.error("Error deleting related availability:", error);
      // Continuar mesmo se houver erro na exclusão da disponibilidade
    }

    // Excluir o pacote
    await client.databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      id
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting package:", error);
    throw new Error("Falha ao excluir pacote. Por favor, tente novamente.");
  }
}
