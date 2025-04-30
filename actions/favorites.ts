"use server";

import { ID, Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser } from "./auth";

/**
 * Adiciona um item aos favoritos do usuário
 */
export async function addToFavorites(itemId: string, type: "destination" | "package") {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se o favorito já existe
    const favorites = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.FAVORITES,
      [
        Query.equal("itemId", itemId),
        Query.equal("type", type)
      ]
    );
    
    // Se já existe, não precisamos adicionar novamente
    if (favorites.documents.length > 0) {
      return { success: true, message: "Item já está nos favoritos" };
    }
    
    // Criar novo documento de favorito
    const favorite = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.FAVORITES,
      ID.unique(),
      {
        itemId,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
    
    // Adicionar o favorito ao usuário
    const currentUser = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      user.$id
    );
    
    const userFavorites = currentUser.favorites || [];
    userFavorites.push(favorite.$id);
    
    // Atualizar o usuário com o novo favorito
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      user.$id,
      {
        favorites: userFavorites,
        updatedAt: new Date().toISOString()
      }
    );
    
    return { success: true, message: "Item adicionado aos favoritos" };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error("Erro ao adicionar aos favoritos. Tente novamente.");
  }
}

/**
 * Remove um item dos favoritos do usuário
 */
export async function removeFromFavorites(itemId: string, type: "destination" | "package") {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Buscar o documento de favorito
    const favorites = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.FAVORITES,
      [
        Query.equal("itemId", itemId),
        Query.equal("type", type)
      ]
    );
    
    // Se não existe, não há o que remover
    if (favorites.documents.length === 0) {
      return { success: true, message: "Item não está nos favoritos" };
    }
    
    const favoriteId = favorites.documents[0].$id;
    
    // Remover o favorito do usuário
    const currentUser = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      user.$id
    );
    
    const userFavorites = currentUser.favorites || [];
    const updatedFavorites = userFavorites.filter((id: string) => id !== favoriteId);
    
    // Atualizar o usuário sem o favorito
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      user.$id,
      {
        favorites: updatedFavorites,
        updatedAt: new Date().toISOString()
      }
    );
    
    // Excluir o documento de favorito
    await client.databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.FAVORITES,
      favoriteId
    );
    
    return { success: true, message: "Item removido dos favoritos" };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw new Error("Erro ao remover dos favoritos. Tente novamente.");
  }
}

/**
 * Verifica se um item está nos favoritos do usuário
 */
export async function isFavorite(itemId: string, type: "destination" | "package") {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    // Buscar o documento de favorito
    const favorites = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.FAVORITES,
      [
        Query.equal("itemId", itemId),
        Query.equal("type", type)
      ]
    );
    
    return favorites.documents.length > 0;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
}

/**
 * Alterna o estado de favorito de um item
 */
export async function toggleFavorite(itemId: string, type: "destination" | "package") {
  try {
    const isFav = await isFavorite(itemId, type);
    
    if (isFav) {
      return await removeFromFavorites(itemId, type);
    } else {
      return await addToFavorites(itemId, type);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Erro ao atualizar favoritos. Tente novamente.");
  }
}
