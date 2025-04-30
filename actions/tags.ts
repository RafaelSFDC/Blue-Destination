"use server";

import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { tagArraySchema } from "@/lib/schemas/tag";

/**
 * Busca todas as tags disponíveis
 */
export async function getTags() {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS
  );
  console.log(response.documents[0]);
  const tags = tagArraySchema.parse(response.documents);
  return tagArraySchema.parse(tags);
}

/**
 * Busca uma tag específica pelo ID
 */
export async function getTagById(id: string) {
  const client = await createSessionClient();

  const tag = await client.databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    id
  );

  return tag;
}

/**
 * Busca uma tag pelo slug
 */
export async function getTagBySlug(slug: string) {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    [Query.equal("slug", slug)]
  );

  return response.documents[0] || null;
}

/**
 * Busca tags por tipo (destination ou package)
 */
export async function getTagsByType({ type }: { type: string }) {
  const client = await createSessionClient();

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    [Query.equal("type", type)]
  );

  const tags = tagArraySchema.parse(response.documents);
  return tags;
}

/**
 * Busca tags populares (limitado por quantidade)
 */
export async function getPopularTags({ limit }: { limit?: number }) {
  const client = await createSessionClient();

  const queries = [];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  const response = await client.databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    queries
  );

  const tags = tagArraySchema.parse(response.documents);
  return tags;
}

/**
 * Busca tags relacionadas a um destino específico
 */
export async function getTagsByDestination(destinationId: string) {
  const client = await createSessionClient();

  // Primeiro, obtemos o destino para ver suas tags
  const destination = await client.databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.DESTINATIONS,
    destinationId
  );

  if (!destination.tags || destination.tags.length === 0) {
    return [];
  }

  // Extraímos os IDs das tags
  const tagIds = destination.tags.map((tag: any) => tag.$id);

  // Buscamos as tags completas
  const tags = await Promise.all(
    tagIds.map((id: string) =>
      client.databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.TAGS,
        id
      )
    )
  );

  return tags;
}

/**
 * Busca tags relacionadas a um pacote específico
 */
export async function getTagsByPackage(packageId: string) {
  const client = await createSessionClient();

  // Primeiro, obtemos o pacote para ver suas tags
  const pkg = await client.databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.PACKAGES,
    packageId
  );

  if (!pkg.tags || pkg.tags.length === 0) {
    return [];
  }

  // Extraímos os IDs das tags
  const tagIds = pkg.tags.map((tag: any) => tag.$id);

  // Buscamos as tags completas
  const tags = await Promise.all(
    tagIds.map((id: string) =>
      client.databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.TAGS,
        id
      )
    )
  );

  return tags;
}

/**
 * Cria uma nova tag
 */
export async function createTag(tagData: {
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  const client = await createSessionClient();

  // Gerar slug a partir do nome
  const slug = tagData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");

  const tag = await client.databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    "unique()",
    {
      name: tagData.name,
      slug,
      type: tagData.type,
      description:
        tagData.description ||
        `Tag para ${
          tagData.type === "destination" ? "destinos" : "pacotes"
        } do tipo ${tagData.name}`,
      color: tagData.color || "#000000",
      icon: tagData.icon || "tag",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  return tag;
}

/**
 * Atualiza uma tag existente
 */
export async function updateTag(
  id: string,
  tagData: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  const client = await createSessionClient();

  const updateData: any = {
    ...tagData,
    updatedAt: new Date().toISOString(),
  };

  // Se o nome foi alterado, atualizar o slug também
  if (tagData.name) {
    updateData.slug = tagData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  }

  const tag = await client.databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    id,
    updateData
  );

  return tag;
}

/**
 * Exclui uma tag
 */
export async function deleteTag(id: string) {
  const client = await createSessionClient();

  await client.databases.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    COLLECTIONS.TAGS,
    id
  );

  return { success: true };
}
