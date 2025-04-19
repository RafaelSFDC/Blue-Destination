import { ID, Query } from "appwrite";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTIONS,
  STORAGE_BUCKET_ID,
} from "../appwrite";
import type {
  User,
  Package,
  Destination,
  Booking,
  Testimonial,
} from "../types";

export class AppwriteService {
  // Autenticação
  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      const userData = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        {
          email,
          name,
          role: "user",
          isLoggedIn: true,
          avatar: null,
        }
      );
      return userData as unknown as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Destinos
  async getDestinations(): Promise<Destination[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DESTINATIONS
      );
      return response.documents as unknown as Destination[];
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  }

  // Pacotes
  async searchPackages(filters: any): Promise<Package[]> {
    try {
      let queries: string[] = [];

      if (filters.query) {
        queries.push(Query.search("name", filters.query));
      }

      if (filters.destinationId) {
        queries.push(Query.search("destinations", filters.destinationId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PACKAGES,
        queries
      );
      return response.documents as unknown as Package[];
    } catch (error) {
      console.error("Error searching packages:", error);
      throw error;
    }
  }

  // Upload de imagem
  async uploadImage(file: File): Promise<string> {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      return response.$id;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Depoimentos
  async createTestimonial(
    testimonial: Omit<Testimonial, "id" | "date">
  ): Promise<Testimonial> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TESTIMONIALS,
        ID.unique(),
        {
          ...testimonial,
          date: new Date().toISOString(),
        }
      );
      return response as unknown as Testimonial;
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  }

  // Reservas
  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKINGS,
        ID.unique(),
        booking
      );
      return response as unknown as Booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  // Mensagens
  async getMessages(): Promise<any[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

export const appwriteService = new AppwriteService();
