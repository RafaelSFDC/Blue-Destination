"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StarRating } from "@/components/ui/star-rating"
import { formatCurrency } from "@/lib/utils"
import { getDestinations } from "@/lib/actions"
import { MapPin, Search, ArrowLeft, X } from "lucide-react"

export default function DestinationsMapPage() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const allDestinations = await getDestinations()
        setDestinations(allDestinations)
        setFilteredDestinations(allDestinations)
      } catch (error) {
        console.error("Erro ao buscar destinos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDestinations(destinations)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = destinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.location.toLowerCase().includes(query) ||
          dest.tags.some((tag: string) => tag.toLowerCase().includes(query)),
      )
      setFilteredDestinations(filtered)
    }
  }, [searchQuery, destinations])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // A filtragem já é feita pelo useEffect
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination)
  }

  const handleCloseDestinationDetails = () => {
    setSelectedDestination(null)
  }

  // Função para gerar posições aleatórias para os destinos no mapa
  const getRandomPosition = (index: number) => {
    // Usando o índice para gerar posições determinísticas mas distribuídas
    const row = Math.floor(index / 4)
    const col = index % 4

    // Adicionar um pouco de aleatoriedade para não ficar em grade perfeita
    const randomX = Math.sin(index * 7) * 5
    const randomY = Math.cos(index * 13) * 5

    return {
      left: `${15 + col * 25 + randomX}%`,
      top: `${15 + row * 25 + randomY}%`,
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/destinations">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Voltar</span>
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Mapa de Destinos</h1>
            </div>

            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar destinos..."
                className="pl-9 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Limpar busca</span>
                </Button>
              )}
            </form>
          </div>

          <div className="relative h-[600px] rounded-lg border bg-muted/20">
            {/* Mapa de fundo */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=600&width=1200&text=Mapa+Mundi"
                alt="Mapa Mundi"
                fill
                className="object-cover"
              />
            </div>

            {/* Marcadores de destinos */}
            {!isLoading &&
              filteredDestinations.map((destination, index) => (
                <button
                  key={destination.id}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                  style={getRandomPosition(index)}
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="flex flex-col items-center">
                    <MapPin
                      className="h-8 w-8 text-primary drop-shadow-md"
                      fill={selectedDestination?.id === destination.id ? "currentColor" : "transparent"}
                    />
                    <span className="mt-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium shadow-sm">
                      {destination.name}
                    </span>
                  </div>
                </button>
              ))}

            {/* Painel de detalhes do destino selecionado */}
            {selectedDestination && (
              <div className="absolute bottom-4 right-4 w-80 z-20">
                <Card className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={selectedDestination.imageUrl || "/placeholder.svg"}
                      alt={selectedDestination.name}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={handleCloseDestinationDetails}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {selectedDestination.featured && (
                      <Badge className="absolute left-2 top-2 bg-primary text-white">Destaque</Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-bold">{selectedDestination.name}</h3>
                    <div className="mb-2 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{selectedDestination.location}</span>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                      <StarRating rating={selectedDestination.rating} size={16} />
                      <span className="text-sm text-muted-foreground">
                        ({selectedDestination.reviewCount} avaliações)
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{selectedDestination.description}</p>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {selectedDestination.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(selectedDestination.price)}
                        <span className="text-xs text-muted-foreground"> / pessoa</span>
                      </div>

                      <Button size="sm" asChild>
                        <Link href={`/destinations/${selectedDestination.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Indicador de carregamento */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            )}

            {/* Mensagem de nenhum resultado */}
            {!isLoading && filteredDestinations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="rounded-lg bg-background p-6 text-center shadow-lg">
                  <h3 className="mb-2 text-lg font-medium">Nenhum destino encontrado</h3>
                  <p className="mb-4 text-muted-foreground">Não encontramos destinos que correspondam à sua busca.</p>
                  <Button onClick={handleClearSearch}>Limpar Busca</Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.slice(0, 4).map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={destination.imageUrl || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="mb-1 font-bold">{destination.name}</h3>
                  <div className="mb-2 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{destination.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-primary">{formatCurrency(destination.price)}</div>

                    <Button size="sm" variant="outline" onClick={() => handleDestinationClick(destination)}>
                      Ver no Mapa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
