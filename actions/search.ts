"use server";

import { Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { packageArraySchema } from "@/lib/schemas/package";
import { getPackages } from "./packages";
import type { SearchFilters } from "@/lib/types";

/**
 * Busca pacotes com filtros
 */
export async function searchPackages(filters: SearchFilters) {
  const client = await createSessionClient();
  const queries: any[] = [];

  // Adicionar filtros à query
  if (filters.query) {
    queries.push(Query.search("name", filters.query));
  }

  if (filters.destinationId) {
    queries.push(Query.search("destinations", filters.destinationId));
  }

  if (filters.minPrice !== undefined) {
    queries.push(Query.greaterThanEqual("price", filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    queries.push(Query.lessThanEqual("price", filters.maxPrice));
  }

  if (filters.minDuration !== undefined) {
    queries.push(Query.greaterThanEqual("duration", filters.minDuration));
  }

  if (filters.maxDuration !== undefined) {
    queries.push(Query.lessThanEqual("duration", filters.maxDuration));
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    // Para cada tag, adicionamos uma condição de busca
    filters.tagIds.forEach((tagId) => {
      queries.push(Query.search("tags", tagId));
    });
  }

  // Adicionar ordenação
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        queries.push(Query.orderAsc("price"));
        break;
      case "price-desc":
        queries.push(Query.orderDesc("price"));
        break;
      case "duration-asc":
        queries.push(Query.orderAsc("duration"));
        break;
      case "duration-desc":
        queries.push(Query.orderDesc("duration"));
        break;
      case "name-asc":
        queries.push(Query.orderAsc("name"));
        break;
      case "name-desc":
        queries.push(Query.orderDesc("name"));
        break;
      default:
        queries.push(Query.orderDesc("featured"));
        break;
    }
  }

  // Adicionar limite e paginação
  const limit = filters.limit || 9;
  queries.push(Query.limit(limit));
  
  if (filters.page && filters.page > 1) {
    queries.push(Query.offset((filters.page - 1) * limit));
  }

  try {
    const response = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PACKAGES,
      queries
    );

    const packages = packageArraySchema.parse(response.documents);
    return packages;
  } catch (error) {
    console.error("Error searching packages:", error);
    return [];
  }
}

/**
 * Obtém os intervalos de filtros (preço, duração)
 */
export async function getFilterRanges() {
  // Obter todos os pacotes
  const packages = await getPackages();

  const prices = packages.map((pkg) => pkg.price);
  const durations = packages.map((pkg) => pkg.duration);

  return {
    price: {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 10000),
    },
    duration: {
      min: Math.min(...durations, 1),
      max: Math.max(...durations, 30),
    },
  };
}
