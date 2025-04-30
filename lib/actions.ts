"use server";

import { appwriteService } from "./services";
import type {
  Destination,
  Package,
  Testimonial,
  SearchFilters,
  Booking,
  User,
  AuthResult,
} from "@/lib/types";

// Função para buscar todos os destinos
export async function getDestinations(): Promise<Destination[]> {
  return appwriteService.getDestinations();
}

// Função para buscar um destino pelo ID
export async function getDestinationById(
  id: string
): Promise<Destination | null> {
  return appwriteService.getDestinationById(id);
}

// Função para buscar destinos em destaque
export async function getFeaturedDestinations(
  limit = 6
): Promise<Destination[]> {
  return appwriteService.getFeaturedDestinations(limit);
}

// Função para buscar destinos populares
export async function getPopularDestinations(
  limit = 6
): Promise<Destination[]> {
  // Obter todos os destinos e ordenar por reviewCount
  const destinations = await appwriteService.getDestinations();
  return [...destinations]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

// Função para buscar todos os pacotes
export async function getPackages(): Promise<Package[]> {
  return appwriteService.getPackages();
}

// Função para buscar um pacote pelo ID
export async function getPackageById(id: string): Promise<Package | null> {
  return appwriteService.getPackageById(id);
}

// Função para buscar pacotes em destaque
export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  return appwriteService.getFeaturedPackages(limit);
}

// Função para buscar pacotes com desconto
export async function getDiscountedPackages(limit = 6): Promise<Package[]> {
  // Obter todos os pacotes e filtrar os que têm desconto
  const packages = await appwriteService.getPackages();
  return packages
    .filter((pkg) => pkg.discount && pkg.discount > 0)
    .slice(0, limit);
}

// Função para buscar pacotes relacionados a um pacote específico
export async function getRelatedPackages(
  packageId: string,
  limit = 3
): Promise<Package[]> {
  // Obter o pacote pelo ID
  const pkg = await appwriteService.getPackageById(packageId);
  if (!pkg) return [];

  // Obter todos os pacotes
  const allPackages = await appwriteService.getPackages();

  // Encontrar pacotes com destinos semelhantes
  const relatedPackages = allPackages
    .filter(
      (p) =>
        p.id !== packageId &&
        p.destinationIds.some((destId) => pkg.destinationIds.includes(destId))
    )
    .slice(0, limit);

  return relatedPackages;
}

// Função para buscar depoimentos por destino
export async function getTestimonialsByDestination(
  destinationId: string
): Promise<Testimonial[]> {
  return appwriteService.getTestimonialsByDestination(destinationId);
}

// Função para buscar depoimentos por pacote
export async function getTestimonialsByPackage(
  packageId: string
): Promise<Testimonial[]> {
  return appwriteService.getTestimonialsByPackage(packageId);
}

// Função para buscar depoimentos em destaque
export async function getFeaturedTestimonials(
  limit = 6
): Promise<Testimonial[]> {
  // Obter todos os depoimentos e filtrar os destacados
  // Como não temos um campo 'featured' no Appwrite, vamos pegar os com maior rating
  const testimonials = await Promise.all([
    appwriteService.getTestimonialsByDestination(""),
    appwriteService.getTestimonialsByPackage(""),
  ]).then(([destTestimonials, pkgTestimonials]) => {
    return [...destTestimonials, ...pkgTestimonials];
  });

  return testimonials.sort((a, b) => b.rating - a.rating).slice(0, limit);
}

// Função para buscar todas as tags disponíveis
export async function getAllTags(): Promise<string[]> {
  const tags = await appwriteService.getTags();
  return tags.map((tag) => tag.name).sort();
}

// Função para obter os intervalos de filtros (preço, duração)
export async function getFilterRanges() {
  // Obter todos os pacotes
  const packages = await appwriteService.getPackages();

  const prices = packages.map((pkg) => pkg.price);
  const durations = packages.map((pkg) => pkg.duration);

  return {
    price: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    duration: {
      min: Math.min(...durations),
      max: Math.max(...durations),
    },
  };
}

// Função para buscar pacotes com filtros
export async function searchPackages(filters: SearchFilters) {
  const packages = await appwriteService.searchPackages(filters);

  // Aplicar paginação manual se necessário
  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Aplicar ordenação manual se necessário
  let sortedPackages = [...packages];
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        sortedPackages.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedPackages.sort((a, b) => b.price - a.price);
        break;
      case "duration-asc":
        sortedPackages.sort((a, b) => a.duration - b.duration);
        break;
      case "duration-desc":
        sortedPackages.sort((a, b) => b.duration - a.duration);
        break;
      case "name-asc":
        sortedPackages.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedPackages.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Manter a ordem padrão
        break;
    }
  }

  // Aplicar paginação
  const paginatedPackages = sortedPackages.slice(startIndex, endIndex);

  return paginatedPackages;
}

// Função para criar um novo depoimento
export async function createTestimonial(
  testimonial: Omit<Testimonial, "id" | "date">
) {
  return appwriteService.createTestimonial(testimonial);
}

// Função para buscar pacotes por destino
export async function getPackagesByDestination(
  destinationId: string
): Promise<Package[]> {
  return appwriteService.getPackagesByDestination(destinationId);
}

// Função para buscar destinos por região
export async function getDestinationsByRegion(
  region: string
): Promise<Destination[]> {
  // Obter todos os destinos e filtrar por região
  const destinations = await appwriteService.getDestinations();
  return destinations.filter((destination) => destination.region === region);
}

// Função para buscar regiões disponíveis
export async function getAvailableRegions(): Promise<string[]> {
  // Obter todos os destinos e extrair as regiões únicas
  const destinations = await appwriteService.getDestinations();

  const regions = new Set<string>();
  destinations.forEach((destination) => {
    if (destination.region) {
      regions.add(destination.region);
    }
  });

  return Array.from(regions).sort();
}

// Função para autenticar usuário
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const user = await appwriteService.createUser(
      email,
      password,
      email.split("@")[0]
    );
    return { success: true, user };
  } catch (error) {
    return { success: false, user: null, message: "Credenciais inválidas" };
  }
}

// Função para buscar reservas de um usuário
export async function getUserBookings(userId: string): Promise<Booking[]> {
  return appwriteService.getUserBookings(userId);
}

// Função para buscar uma reserva pelo ID
export async function getBookingById(id: string): Promise<Booking | null> {
  return appwriteService.getBookingById(id);
}
