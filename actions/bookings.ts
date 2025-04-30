"use server";

import { ID, Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser } from "./auth";
import { getPackageById } from "./packages";

/**
 * Cria uma nova reserva para um pacote
 */
export async function createBooking({
  packageId,
  travelDate,
  travelers,
}: {
  packageId: string;
  travelDate: string;
  travelers: number;
}) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Obter informações do pacote
    const packageData = await getPackageById(packageId);
    if (!packageData) {
      throw new Error("Pacote não encontrado");
    }
    
    // Calcular preço total
    const totalPrice = packageData.price * travelers;
    
    // Criar nova reserva
    const booking = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      ID.unique(),
      {
        user: user.$id,
        packages: packageId,
        status: "pending",
        bookingDate: new Date().toISOString(),
        travelDate: travelDate,
        travelers: travelers,
        totalPrice: totalPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
    
    return { success: true, bookingId: booking.$id };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Erro ao criar reserva. Tente novamente.");
  }
}

/**
 * Obtém as reservas do usuário atual
 */
export async function getUserBookings() {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const bookings = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      [
        Query.equal("user", user.$id),
        Query.orderDesc("createdAt")
      ]
    );
    
    return bookings.documents;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error("Erro ao buscar reservas. Tente novamente.");
  }
}

/**
 * Obtém uma reserva pelo ID
 */
export async function getBookingById(bookingId: string) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const booking = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      bookingId
    );
    
    // Verificar se a reserva pertence ao usuário atual
    if (booking.user.$id !== user.$id) {
      throw new Error("Acesso não autorizado");
    }
    
    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw new Error("Erro ao buscar reserva. Tente novamente.");
  }
}

/**
 * Cancela uma reserva
 */
export async function cancelBooking(bookingId: string) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se a reserva pertence ao usuário atual
    const booking = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      bookingId
    );
    
    if (booking.user.$id !== user.$id) {
      throw new Error("Acesso não autorizado");
    }
    
    // Atualizar status da reserva
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      bookingId,
      {
        status: "cancelled",
        updatedAt: new Date().toISOString()
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new Error("Erro ao cancelar reserva. Tente novamente.");
  }
}
