"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils"
import { StarRating } from "@/components/ui/star-rating"
import { FavoriteButton } from "@/components/favorite-button"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { getDestinationById, getPackageById } from "@/lib/actions"
import { MapPin, Clock, Calendar, Trash2, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function FavoritesPage() {
  const snap = useSnapshot(state)
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true)

      try {
        // Buscar destinos favoritos
        const destinationPromises = snap.favorites
          .filter((fav) => fav.type === "destination")
          .map((fav) => getDestinationById(fav.id))

        const destinationResults = await Promise.all(destinationPromises)
        setDestinations(destinationResults.filter(Boolean))

        // Buscar pacotes favoritos
        const packagePromises = snap.favorites
          .filter((fav) => fav.type === "package")
          .map((fav) => getPackageById(fav.id))

        const packageResults = await Promise.all(packagePromises)
        setPackages(packageResults.filter(Boolean))
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error)
        toast({
          title: "Erro ao carregar favoritos",
          description: "Ocorreu um erro ao carregar seus itens favoritos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [snap.favorites, toast])

  const handleClearAll = () => {
    actions.clearFavorites()
    toast({
      title: "Favoritos limpos",
      description: "Todos os itens foram removidos da sua lista de favoritos.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Favoritos</h1>

        {snap.favorites.length > 0 && (
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
      ) : snap.favorites.length === 0 ? (
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
            <TabsTrigger value="all">Todos ({snap.favorites.length})</TabsTrigger>
            <TabsTrigger value="destinations">Destinos ({destinations.length})</TabsTrigger>
            <TabsTrigger value="packages">Pacotes ({packages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden">
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
                      <FavoriteButton id={destination.id} type="destination" />
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
                      <Link href={`/destinations/${destination.id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="relative aspect-video">
                      <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                    </div>
                    <div className="absolute right-2 top-2">
                      <FavoriteButton id={pkg.id} type="package" />
                    </div>
                    {pkg.discount && (
                      <Badge className="absolute left-2 top-2 bg-red-500 text-white">{pkg.discount}% OFF</Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>
                    <div className="mb-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{pkg.duration} dias</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{pkg.destinations.length} destinos</span>
                      </div>
                    </div>
                    {pkg.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(calculateDiscountedPrice(pkg.price, pkg.discount))}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">{formatCurrency(pkg.price)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</span>
                    )}
                    <p className="text-xs text-muted-foreground">por pessoa</p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" asChild>
                      <Link href={`/packages/${pkg.id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="destinations" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.length === 0 ? (
                <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">Nenhum destino adicionado aos favoritos.</p>
                </div>
              ) : (
                destinations.map((destination) => (
                  <Card key={destination.id} className="overflow-hidden">
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
                        <FavoriteButton id={destination.id} type="destination" />
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
                        <Link href={`/destinations/${destination.id}`}>Ver Detalhes</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="packages" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.length === 0 ? (
                <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">Nenhum pacote adicionado aos favoritos.</p>
                </div>
              ) : (
                packages.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden">
                    <div className="relative">
                      <div className="relative aspect-video">
                        <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                      </div>
                      <div className="absolute right-2 top-2">
                        <FavoriteButton id={pkg.id} type="package" />
                      </div>
                      {pkg.discount && (
                        <Badge className="absolute left-2 top-2 bg-red-500 text-white">{pkg.discount}% OFF</Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>
                      <div className="mb-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          <span>{pkg.duration} dias</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          <span>{pkg.destinations.length} destinos</span>
                        </div>
                      </div>
                      {pkg.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(calculateDiscountedPrice(pkg.price, pkg.discount))}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(pkg.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</span>
                      )}
                      <p className="text-xs text-muted-foreground">por pessoa</p>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/packages/${pkg.id}`}>Ver Detalhes</Link>
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
