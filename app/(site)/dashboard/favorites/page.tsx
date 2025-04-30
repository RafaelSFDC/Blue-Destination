"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils"
import { StarRating } from "@/components/ui/star-rating"
import { FavoriteButton } from "@/components/favorite-button"
import { MapPin, Clock, Calendar, Trash2, Heart } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/querys/useUser"
import { usePackages } from "@/querys/usePackages"
import { useDestinations } from "@/querys/useDestinations"
import { Favorite, Destination, Package } from "@/lib/types"

export default function FavoritesPage() {
  const { data: user, isLoading: isLoadingUser } = useUser()
  const { data: allPackages = [], isLoading: isLoadingPackages } = usePackages()
  const { data: allDestinations = [], isLoading: isLoadingDestinations } = useDestinations()
  
  // Obter favoritos do usuário
  const favorites = user?.favorites || []
  
  // Filtrar destinos favoritos
  const destinationFavorites = favorites.filter(fav => fav.type === "destination")
  const favoriteDestinationIds = destinationFavorites.map(fav => fav.itemId)
  const favoriteDestinations = allDestinations.filter(dest => 
    favoriteDestinationIds.includes(dest.$id)
  )
  
  // Filtrar pacotes favoritos
  const packageFavorites = favorites.filter(fav => fav.type === "package")
  const favoritePackageIds = packageFavorites.map(fav => fav.itemId)
  const favoritePackages = allPackages.filter(pkg => 
    favoritePackageIds.includes(pkg.$id)
  )
  
  const isLoading = isLoadingUser || isLoadingPackages || isLoadingDestinations

  const handleClearAll = async () => {
    try {
      // Aqui você implementaria a lógica para limpar todos os favoritos
      // Por exemplo, chamando uma API para remover todos os favoritos do usuário
      
      toast.success("Favoritos limpos", {
        description: "Todos os itens foram removidos da sua lista de favoritos."
      })
    } catch (error) {
      toast.error("Erro ao limpar favoritos", {
        description: "Não foi possível remover os itens da sua lista de favoritos."
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Favoritos</h1>

        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Todos
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Sua lista de favoritos está vazia</h3>
          <p className="mb-4 max-w-md text-muted-foreground">
            Adicione destinos e pacotes aos seus favoritos para encontrá-los facilmente mais tarde.
          </p>
          <Button asChild>
            <Link href="/destinations">Explorar Destinos</Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({favorites.length})</TabsTrigger>
            <TabsTrigger value="destinations">Destinos ({favoriteDestinations.length})</TabsTrigger>
            <TabsTrigger value="packages">Pacotes ({favoritePackages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteDestinations.map((destination) => (
                <Card key={destination.$id} className="overflow-hidden">
                  <div className="relative">
                    <div className="relative aspect-video">
                      <Image
                        src={destination.imageUrl || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute right-2 top-2">
                      <FavoriteButton id={destination.$id} type="destination" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-bold">{destination.name}</h3>
                    <div className="mb-2 flex items-center text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      <span>{destination.location}</span>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <StarRating rating={destination.rating} size={16} />
                      <span className="text-sm text-muted-foreground">({destination.reviewCount} avaliações)</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(destination.price)}
                      <span className="text-xs text-muted-foreground"> / pessoa</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" asChild>
                      <Link href={`/destinations/${destination.$id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {favoritePackages.map((pkg) => (
                <Card key={pkg.$id} className="overflow-hidden">
                  <div className="relative">
                    <div className="relative aspect-video">
                      <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                    </div>
                    <div className="absolute right-2 top-2">
                      <FavoriteButton id={pkg.$id} type="package" />
                    </div>
                    {pkg.discounts && pkg.discounts.length > 0 && (
                      <Badge className="absolute left-2 top-2 bg-primary">
                        {pkg.discounts[0].value}% OFF
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>
                    <div className="mb-2 flex items-center text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      <span>{pkg.destinations[0]?.name || "Múltiplos destinos"}</span>
                    </div>
                    <div className="mb-2 flex items-center text-sm text-muted-foreground">
                      <Clock size={16} className="mr-1" />
                      <span>{pkg.duration} dias</span>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <StarRating rating={(pkg.testimonials || []).reduce((acc, t) => acc + t.rating, 0) / (pkg.testimonials?.length || 1) || 0} size={16} />
                      <span className="text-sm text-muted-foreground">({pkg.testimonials?.length || 0} avaliações)</span>
                    </div>
                    {pkg.discounts && pkg.discounts.length > 0 ? (
                      <div>
                        <span className="text-sm line-through text-muted-foreground">
                          {formatCurrency(pkg.price)}
                        </span>
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(calculateDiscountedPrice(pkg.price, pkg.discounts[0].value))}
                          <span className="text-xs text-muted-foreground"> / pessoa</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(pkg.price)}
                        <span className="text-xs text-muted-foreground"> / pessoa</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" asChild>
                      <Link href={`/packages/${pkg.$id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="destinations" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteDestinations.length === 0 ? (
                <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">Nenhum destino favorito encontrado</p>
                </div>
              ) : (
                favoriteDestinations.map((destination) => (
                  <Card key={destination.$id} className="overflow-hidden">
                    <div className="relative">
                      <div className="relative aspect-video">
                        <Image
                          src={destination.imageUrl || "/placeholder.svg"}
                          alt={destination.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute right-2 top-2">
                        <FavoriteButton id={destination.$id} type="destination" />
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-bold">{destination.name}</h3>
                      <div className="mb-2 flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="mr-1" />
                        <span>{destination.location}</span>
                      </div>
                      <div className="mb-3 flex items-center gap-2">
                        <StarRating rating={destination.rating} size={16} />
                        <span className="text-sm text-muted-foreground">({destination.reviewCount} avaliações)</span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(destination.price)}
                        <span className="text-xs text-muted-foreground"> / pessoa</span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/destinations/${destination.$id}`}>Ver Detalhes</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="packages" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoritePackages.length === 0 ? (
                <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">Nenhum pacote favorito encontrado</p>
                </div>
              ) : (
                favoritePackages.map((pkg) => (
                  <Card key={pkg.$id} className="overflow-hidden">
                    <div className="relative">
                      <div className="relative aspect-video">
                        <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                      </div>
                      <div className="absolute right-2 top-2">
                        <FavoriteButton id={pkg.$id} type="package" />
                      </div>
                      {pkg.discounts && pkg.discounts.length > 0 && (
                        <Badge className="absolute left-2 top-2 bg-primary">
                          {pkg.discounts[0].value}% OFF
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>
                      <div className="mb-2 flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="mr-1" />
                        <span>{pkg.destinations[0]?.name || "Múltiplos destinos"}</span>
                      </div>
                      <div className="mb-2 flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-1" />
                        <span>{pkg.duration} dias</span>
                      </div>
                      <div className="mb-3 flex items-center gap-2">
                        <StarRating rating={(pkg.testimonials || []).reduce((acc, t) => acc + t.rating, 0) / (pkg.testimonials?.length || 1) || 0} size={16} />
                        <span className="text-sm text-muted-foreground">({pkg.testimonials?.length || 0} avaliações)</span>
                      </div>
                      {pkg.discounts && pkg.discounts.length > 0 ? (
                        <div>
                          <span className="text-sm line-through text-muted-foreground">
                            {formatCurrency(pkg.price)}
                          </span>
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(calculateDiscountedPrice(pkg.price, pkg.discounts[0].value))}
                            <span className="text-xs text-muted-foreground"> / pessoa</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(pkg.price)}
                          <span className="text-xs text-muted-foreground"> / pessoa</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/packages/${pkg.$id}`}>Ver Detalhes</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
