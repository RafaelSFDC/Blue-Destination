import { Client, Databases, Account, ID, Query } from "appwrite";
import { COLLECTIONS } from "../appwrite";
import type {
  Destination,
  Package,
  Testimonial,
  SearchFilters,
  User,
  AuthResult,
} from "@/lib/types";

class AppwriteService {
  private client: Client;
  private databases: Databases;
  private account: Account;
  private databaseId: string;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
    this.databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
  }

  // Autenticação
  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      // Tentar login primeiro
      const session = await this.account.createEmailSession(email, password);
      const user = await this.account.get();

      return {
        id: user.$id,
        email: user.email,
        name: name,
        role: "user",
      };
    } catch (error) {
      // Se falhar, criar novo usuário
      try {
        const newUser = await this.account.create(
          ID.unique(),
          email,
          password,
          name
        );
        await this.account.createEmailSession(email, password);

        // Criar documento do usuário no banco de dados
        await this.databases.createDocument(
          this.databaseId,
          COLLECTIONS.USERS,
          newUser.$id,
          {
            email: email,
            name: name,
            role: "user",
          }
        );

        return {
          id: newUser.$id,
          email: newUser.email,
          name: name,
          role: "user",
        };
      } catch (createError) {
        throw createError;
      }
    }
  }

  // Destinos
  async getDestinations(): Promise<Destination[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.DESTINATIONS,
        [Query.limit(100)]
      );

      // Transformar os documentos em objetos Destination
      return response.documents.map((doc) => {
        return {
          id: doc.$id,
          name: doc.name,
          location: doc.location,
          description: doc.description,
          price: doc.price,
          rating: doc.rating,
          reviewCount: doc.reviewCount,
          imageUrl: doc.imageUrl,
          featured: doc.featured,
          region: doc.region,
          // Para tags, precisamos lidar com a relação
          tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
          tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
        };
      });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  }

  async getDestinationById(id: string): Promise<Destination | null> {
    try {
      const doc = await this.databases.getDocument(
        this.databaseId,
        COLLECTIONS.DESTINATIONS,
        id
      );

      return {
        id: doc.$id,
        name: doc.name,
        location: doc.location,
        description: doc.description,
        price: doc.price,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        imageUrl: doc.imageUrl,
        featured: doc.featured,
        region: doc.region,
        // Para tags, precisamos lidar com a relação
        tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
        tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
      };
    } catch (error) {
      console.error("Error fetching destination:", error);
      return null;
    }
  }

  async getFeaturedDestinations(limit = 6): Promise<Destination[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.DESTINATIONS,
        [Query.equal("featured", true), Query.limit(limit)]
      );

      return response.documents.map((doc) => {
        return {
          id: doc.$id,
          name: doc.name,
          location: doc.location,
          description: doc.description,
          price: doc.price,
          rating: doc.rating,
          reviewCount: doc.reviewCount,
          imageUrl: doc.imageUrl,
          featured: doc.featured,
          region: doc.region,
          // Para tags, precisamos lidar com a relação
          tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
          tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
        };
      });
    } catch (error) {
      console.error("Error fetching featured destinations:", error);
      return [];
    }
  }

  // Pacotes
  async getPackages(): Promise<Package[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.PACKAGES,
        [Query.limit(100)]
      );

      // Buscar itinerários para cada pacote
      const packages = await Promise.all(
        response.documents.map(async (doc) => {
          const itineraryResponse = await this.databases.listDocuments(
            this.databaseId,
            COLLECTIONS.ITINERARY,
            [Query.equal("package", doc.$id), Query.orderAsc("day")]
          );

          const itinerary = itineraryResponse.documents.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
          }));

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            // Para destinations, precisamos lidar com a relação
            destinations: doc.destinations
              ? doc.destinations.map((dest: any) => dest.name)
              : [],
            destinationIds: doc.destinations
              ? doc.destinations.map((dest: any) => dest.$id)
              : [],
            duration: doc.duration,
            price: doc.price,
            discount: doc.discount || 0,
            imageUrl: doc.imageUrl,
            featured: doc.featured,
            inclusions: doc.inclusions || [],
            // Para tags, precisamos lidar com a relação
            tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
            tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
            itinerary,
          };
        })
      );

      return packages;
    } catch (error) {
      console.error("Error fetching packages:", error);
      return [];
    }
  }

  async getPackageById(id: string): Promise<Package | null> {
    try {
      const doc = await this.databases.getDocument(
        this.databaseId,
        COLLECTIONS.PACKAGES,
        id
      );

      // Buscar itinerário do pacote
      const itineraryResponse = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.ITINERARY,
        [Query.equal("package", id), Query.orderAsc("day")]
      );

      const itinerary = itineraryResponse.documents.map((item) => ({
        day: item.day,
        title: item.title,
        description: item.description,
      }));

      return {
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        // Para destinations, precisamos lidar com a relação
        destinations: doc.destinations
          ? doc.destinations.map((dest: any) => dest.name)
          : [],
        destinationIds: doc.destinations
          ? doc.destinations.map((dest: any) => dest.$id)
          : [],
        duration: doc.duration,
        price: doc.price,
        discount: doc.discount || 0,
        imageUrl: doc.imageUrl,
        featured: doc.featured,
        inclusions: doc.inclusions || [],
        // Para tags, precisamos lidar com a relação
        tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
        tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
        itinerary,
      };
    } catch (error) {
      console.error("Error fetching package:", error);
      return null;
    }
  }

  async getFeaturedPackages(limit = 6): Promise<Package[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.PACKAGES,
        [Query.equal("featured", true), Query.limit(limit)]
      );

      // Buscar itinerários para cada pacote
      const packages = await Promise.all(
        response.documents.map(async (doc) => {
          const itineraryResponse = await this.databases.listDocuments(
            this.databaseId,
            COLLECTIONS.ITINERARY,
            [Query.equal("package", doc.$id), Query.orderAsc("day")]
          );

          const itinerary = itineraryResponse.documents.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
          }));

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            // Para destinations, precisamos lidar com a relação
            destinations: doc.destinations
              ? doc.destinations.map((dest: any) => dest.name)
              : [],
            destinationIds: doc.destinations
              ? doc.destinations.map((dest: any) => dest.$id)
              : [],
            duration: doc.duration,
            price: doc.price,
            discount: doc.discount || 0,
            imageUrl: doc.imageUrl,
            featured: doc.featured,
            inclusions: doc.inclusions || [],
            // Para tags, precisamos lidar com a relação
            tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
            tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
            itinerary,
          };
        })
      );

      return packages;
    } catch (error) {
      console.error("Error fetching featured packages:", error);
      return [];
    }
  }

  async getPackagesByDestination(destinationId: string): Promise<Package[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.PACKAGES,
        [Query.search("destinations", destinationId)]
      );

      // Buscar itinerários para cada pacote
      const packages = await Promise.all(
        response.documents.map(async (doc) => {
          const itineraryResponse = await this.databases.listDocuments(
            this.databaseId,
            COLLECTIONS.ITINERARY,
            [Query.equal("package", doc.$id), Query.orderAsc("day")]
          );

          const itinerary = itineraryResponse.documents.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
          }));

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            // Para destinations, precisamos lidar com a relação
            destinations: doc.destinations
              ? doc.destinations.map((dest: any) => dest.name)
              : [],
            destinationIds: doc.destinations
              ? doc.destinations.map((dest: any) => dest.$id)
              : [],
            duration: doc.duration,
            price: doc.price,
            discount: doc.discount || 0,
            imageUrl: doc.imageUrl,
            featured: doc.featured,
            inclusions: doc.inclusions || [],
            // Para tags, precisamos lidar com a relação
            tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
            tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
            itinerary,
          };
        })
      );

      return packages;
    } catch (error) {
      console.error("Error fetching packages by destination:", error);
      return [];
    }
  }

  // Busca e filtros
  async searchPackages(filters: SearchFilters): Promise<Package[]> {
    try {
      const queries: any[] = [Query.limit(filters.limit || 20)];

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

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price_asc":
            queries.push(Query.orderAsc("price"));
            break;
          case "price_desc":
            queries.push(Query.orderDesc("price"));
            break;
          case "duration_asc":
            queries.push(Query.orderAsc("duration"));
            break;
          case "duration_desc":
            queries.push(Query.orderDesc("duration"));
            break;
          default:
            queries.push(Query.orderDesc("featured"));
            break;
        }
      }

      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.PACKAGES,
        queries
      );

      // Buscar itinerários para cada pacote
      const packages = await Promise.all(
        response.documents.map(async (doc) => {
          const itineraryResponse = await this.databases.listDocuments(
            this.databaseId,
            COLLECTIONS.ITINERARY,
            [Query.equal("package", doc.$id), Query.orderAsc("day")]
          );

          const itinerary = itineraryResponse.documents.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
          }));

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            // Para destinations, precisamos lidar com a relação
            destinations: doc.destinations
              ? doc.destinations.map((dest: any) => dest.name)
              : [],
            destinationIds: doc.destinations
              ? doc.destinations.map((dest: any) => dest.$id)
              : [],
            duration: doc.duration,
            price: doc.price,
            discount: doc.discount || 0,
            imageUrl: doc.imageUrl,
            featured: doc.featured,
            inclusions: doc.inclusions || [],
            // Para tags, precisamos lidar com a relação
            tags: doc.tags ? doc.tags.map((tag: any) => tag.name) : [],
            tagIds: doc.tags ? doc.tags.map((tag: any) => tag.$id) : [],
            itinerary,
          };
        })
      );

      return packages;
    } catch (error) {
      console.error("Error searching packages:", error);
      return [];
    }
  }

  // Depoimentos
  async createTestimonial(
    testimonial: Omit<Testimonial, "id" | "date">
  ): Promise<Testimonial | null> {
    try {
      const now = new Date();

      const doc = await this.databases.createDocument(
        this.databaseId,
        COLLECTIONS.TESTIMONIALS,
        ID.unique(),
        {
          content: testimonial.content,
          rating: testimonial.rating,
          date: now.toISOString(),
          user: testimonial.userId,
          package: testimonial.packageId,
          destination: testimonial.destinationId || null,
        }
      );

      return {
        id: doc.$id,
        content: doc.content,
        rating: doc.rating,
        date: doc.date,
        userId: doc.user.$id,
        packageId: doc.package.$id,
        destinationId: doc.destination ? doc.destination.$id : null,
      };
    } catch (error) {
      console.error("Error creating testimonial:", error);
      return null;
    }
  }

  async getTestimonialsByPackage(packageId: string): Promise<Testimonial[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.TESTIMONIALS,
        [Query.equal("package", packageId), Query.orderDesc("date")]
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        content: doc.content,
        rating: doc.rating,
        date: doc.date,
        userId: doc.user.$id,
        packageId: doc.package.$id,
        destinationId: doc.destination ? doc.destination.$id : null,
      }));
    } catch (error) {
      console.error("Error fetching testimonials by package:", error);
      return [];
    }
  }

  async getTestimonialsByDestination(
    destinationId: string
  ): Promise<Testimonial[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.TESTIMONIALS,
        [Query.equal("destination", destinationId), Query.orderDesc("date")]
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        content: doc.content,
        rating: doc.rating,
        date: doc.date,
        userId: doc.user.$id,
        packageId: doc.package.$id,
        destinationId: doc.destination ? doc.destination.$id : null,
      }));
    } catch (error) {
      console.error("Error fetching testimonials by destination:", error);
      return [];
    }
  }

  // Tags
  async getTags(): Promise<any[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.TAGS,
        [Query.limit(100)]
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        type: doc.type,
        description: doc.description,
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  }

  // Bookings
  async getUserBookings(userId: string): Promise<any[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.BOOKINGS,
        [Query.equal("user", userId), Query.orderDesc("$createdAt")]
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        userId: doc.user.$id,
        packageId: doc.package.$id,
        startDate: doc.startDate,
        numberOfPeople: doc.numberOfPeople,
        totalPrice: doc.totalPrice,
        status: doc.status,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  }

  async getBookingById(id: string): Promise<any | null> {
    try {
      const doc = await this.databases.getDocument(
        this.databaseId,
        COLLECTIONS.BOOKINGS,
        id
      );

      return {
        id: doc.$id,
        userId: doc.user.$id,
        packageId: doc.package.$id,
        startDate: doc.startDate,
        numberOfPeople: doc.numberOfPeople,
        totalPrice: doc.totalPrice,
        status: doc.status,
        createdAt: doc.$createdAt,
      };
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }

  async getTagsByType(type: string): Promise<any[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        COLLECTIONS.TAGS,
        [Query.equal("type", type)]
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        type: doc.type,
        description: doc.description,
      }));
    } catch (error) {
      console.error(`Error fetching tags by type ${type}:`, error);
      return [];
    }
  }
}

export const appwriteService = new AppwriteService();
