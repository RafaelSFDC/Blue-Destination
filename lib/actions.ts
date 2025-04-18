"use server"

import { mockDestinations, mockPackages, mockTestimonials, mockUsers, mockBookings } from "./mock-data"
import type { Destination, Package, Testimonial, SearchFilters, Booking, User, AuthResult } from "@/lib/types"

// Função para buscar todos os destinos
export async function getDestinations(): Promise<Destination[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDestinations
}

// Função para buscar um destino pelo ID
export async function getDestinationById(id: string): Promise<Destination | null> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockDestinations.find((destination) => destination.id === id) || null
}

// Função para buscar destinos em destaque
export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockDestinations.filter((destination) => destination.featured).slice(0, limit)
}

// Função para buscar destinos populares
export async function getPopularDestinations(limit = 6): Promise<Destination[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 700))
  return [...mockDestinations].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit)
}

// Função para buscar todos os pacotes
export async function getPackages(): Promise<Package[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockPackages
}

// Função para buscar um pacote pelo ID
export async function getPackageById(id: string): Promise<Package | null> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPackages.find((pkg) => pkg.id === id) || null
}

// Função para buscar pacotes em destaque
export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockPackages.filter((pkg) => pkg.featured).slice(0, limit)
}

// Função para buscar pacotes com desconto
export async function getDiscountedPackages(limit = 6): Promise<Package[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 700))
  return mockPackages.filter((pkg) => pkg.discount && pkg.discount > 0).slice(0, limit)
}

// Função para buscar pacotes relacionados a um pacote específico
export async function getRelatedPackages(packageId: string, limit = 3): Promise<Package[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  const pkg = mockPackages.find((p) => p.id === packageId)
  if (!pkg) return []

  // Encontrar pacotes com destinos semelhantes
  const relatedPackages = mockPackages
    .filter((p) => p.id !== packageId && p.destinations.some((dest) => pkg.destinations.includes(dest)))
    .slice(0, limit)

  return relatedPackages
}

// Função para buscar todos os depoimentos
export async function getTestimonials(): Promise<Testimonial[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockTestimonials
}

// Função para buscar depoimentos em destaque
export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 700))
  return mockTestimonials.filter((testimonial) => testimonial.featured).slice(0, limit)
}

// Função para buscar depoimentos por destino
export async function getTestimonialsByDestination(destinationId: string): Promise<Testimonial[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockTestimonials.filter((testimonial) => testimonial.destinationId === destinationId)
}

// Função para buscar depoimentos por pacote
export async function getTestimonialsByPackage(packageId: string): Promise<Testimonial[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockTestimonials.filter((testimonial) => testimonial.packageId === packageId)
}

// Função para buscar todas as tags disponíveis
export async function getAllTags(): Promise<string[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  const allTags = new Set<string>()
  mockPackages.forEach((pkg) => {
    pkg.tags.forEach((tag) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}

// Função para obter os intervalos de filtros (preço, duração)
export async function getFilterRanges() {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 200))

  const prices = mockPackages.map((pkg) => pkg.price)
  const durations = mockPackages.map((pkg) => pkg.duration)

  return {
    price: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    duration: {
      min: Math.min(...durations),
      max: Math.max(...durations),
    },
  }
}

// Função para buscar pacotes com filtros
export async function searchPackages(filters: SearchFilters) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  let results = [...mockPackages]

  // Filtrar por query (nome ou descrição)
  if (filters.query) {
    const query = filters.query.toLowerCase()
    results = results.filter(
      (pkg) => pkg.name.toLowerCase().includes(query) || pkg.description.toLowerCase().includes(query),
    )
  }

  // Filtrar por destino
  if (filters.destinationId) {
    results = results.filter((pkg) => pkg.destinations.includes(filters.destinationId!))
  }

  // Filtrar por preço
  if (filters.minPrice !== undefined) {
    results = results.filter((pkg) => {
      const effectivePrice = pkg.discount ? pkg.price * (1 - pkg.discount / 100) : pkg.price
      return effectivePrice >= filters.minPrice!
    })
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((pkg) => {
      const effectivePrice = pkg.discount ? pkg.price * (1 - pkg.discount / 100) : pkg.price
      return effectivePrice <= filters.maxPrice!
    })
  }

  // Filtrar por duração
  if (filters.minDuration !== undefined) {
    results = results.filter((pkg) => pkg.duration >= filters.minDuration!)
  }

  if (filters.maxDuration !== undefined) {
    results = results.filter((pkg) => pkg.duration <= filters.maxDuration!)
  }

  // Filtrar por avaliações
  if (filters.ratings && filters.ratings.length > 0) {
    results = results.filter((pkg) => {
      // Calcular a média das avaliações dos destinos do pacote
      const destinations = pkg.destinations.map((id) => mockDestinations.find((d) => d.id === id)).filter(Boolean)
      if (destinations.length === 0) return false

      const avgRating = destinations.reduce((sum, d) => sum + (d?.rating || 0), 0) / destinations.length
      return filters.ratings!.includes(Math.floor(avgRating))
    })
  }

  // Filtrar por tags
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((pkg) => filters.tags!.some((tag) => pkg.tags.includes(tag)))
  }

  // Ordenar resultados
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        results.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceA - priceB
        })
        break
      case "price-desc":
        results.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceB - priceA
        })
        break
      case "duration-asc":
        results.sort((a, b) => a.duration - b.duration)
        break
      case "duration-desc":
        results.sort((a, b) => b.duration - a.duration)
        break
      case "name-asc":
        results.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        results.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
  }

  // Paginação
  const page = filters.page || 1
  const limit = filters.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResults = results.slice(startIndex, endIndex)

  return {
    results: paginatedResults,
    totalResults: results.length,
    hasMore: endIndex < results.length,
  }
}

// Função para criar um novo depoimento
export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "date">) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Na vida real, aqui seria feita a inserção no banco de dados
  // Para este exemplo, apenas retornamos um ID fictício
  return {
    id: `testimonial-${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toISOString().split("T")[0],
  }
}

// Função para buscar pacotes por destino
export async function getPackagesByDestination(destinationId: string): Promise<Package[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockPackages.filter((pkg) => pkg.destinations.includes(destinationId))
}

// Função para buscar destinos por região
export async function getDestinationsByRegion(region: string): Promise<Destination[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockDestinations.filter((destination) => destination.region === region)
}

// Função para buscar regiões disponíveis
export async function getAvailableRegions(): Promise<string[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  const regions = new Set<string>()
  mockDestinations.forEach((destination) => {
    if (destination.region) {
      regions.add(destination.region)
    }
  })

  return Array.from(regions).sort()
}

// Função para autenticar usuário
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Simulação simples - em produção usaria bcrypt para comparar senhas
  const user = mockUsers.find((user) => user.email === email)
  
  if (user) {
    const authenticatedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "user" | "admin",
      isLoggedIn: true,
      avatar: user.avatar || null
    }
    return { success: true, user: authenticatedUser }
  }
  
  return { success: false, user: null, message: "Credenciais inválidas" }
}

// Função para buscar reservas de um usuário
export async function getUserBookings(userId: string): Promise<Booking[]> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockBookings.filter((booking) => booking.userId === userId)
}

// Função para buscar uma reserva pelo ID
export async function getBookingById(id: string): Promise<Booking | null> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockBookings.find((booking) => booking.id === id) || null
}





