import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Tag,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPackageById, getDestinationById } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { type Package, type Destination } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PackageDetailsPage({ params }: PageProps) {
  const item = await params
  const packageData = await getPackageById(item.id) as Package | null

  if (!packageData) {
    notFound()
  }

  // Buscar informações dos destinos
  const destinationsPromises = packageData.destinations.map((id: string) =>
    getDestinationById(id)
  )
  const destinations = await Promise.all(destinationsPromises)
  const validDestinations = destinations.filter((dest): dest is Destination => dest !== null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {packageData.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/packages/${packageData.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/admin/packages/${packageData.id}/delete`}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Pacote</CardTitle>
            <CardDescription>
              Informações detalhadas sobre o pacote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={packageData.imageUrl || "/placeholder.svg"}
                alt={packageData.name}
                fill
                className="object-cover"
              />
              {packageData.featured && (
                <Badge className="absolute left-2 top-2 bg-blue-500 text-white">
                  Destaque
                </Badge>
              )}
              {packageData.discount && (
                <Badge className="absolute right-2 top-2 bg-red-500 text-white">
                  {packageData.discount}% OFF
                </Badge>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Descrição</h3>
              <p className="text-muted-foreground">{packageData.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duração</p>
                  <p className="text-sm text-muted-foreground">
                    {packageData.duration} dias
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Destinos</p>
                  <p className="text-sm text-muted-foreground">
                    {packageData.destinations.length} destinos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {packageData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Status</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {packageData.featured && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        Destaque
                      </Badge>
                    )}
                    {packageData.discount && (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        {packageData.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-lg font-medium">Destinos Incluídos</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {validDestinations.map((destination) => (
                  <Card key={destination?.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={destination?.imageUrl || "/placeholder.svg"}
                            alt={destination?.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{destination?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {destination?.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-lg font-medium">O que está incluído</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {packageData.inclusions.map((inclusion: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-lg font-medium">Itinerário</h3>
              <div className="space-y-4">
                {packageData.itinerary.map((day) => (
                  <div key={day.day} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Dia {day.day}: {day.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Preço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Preço base</span>
                <span className="font-medium">
                  {formatCurrency(packageData.price)}
                </span>
              </div>

              {packageData.discount && (
                <>
                  <div className="flex justify-between">
                    <span>Desconto</span>
                    <span className="font-medium text-red-500">
                      -{packageData.discount}%
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Preço com desconto</span>
                    <span className="font-medium">
                      {formatCurrency(
                        packageData.price * (1 - packageData.discount / 100)
                      )}
                    </span>
                  </div>
                </>
              )}

              <Separator />

              <div className="rounded-lg bg-muted p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Preço por pessoa
                  </p>
                  <p className="text-2xl font-bold">
                    {packageData.discount
                      ? formatCurrency(
                          packageData.price * (1 - packageData.discount / 100)
                        )
                      : formatCurrency(packageData.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Visualizações</span>
                <span className="font-medium">1,248</span>
              </div>

              <div className="flex justify-between">
                <span>Reservas</span>
                <span className="font-medium">32</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de conversão</span>
                <span className="font-medium">2.56%</span>
              </div>

              <div className="flex justify-between">
                <span>Avaliação média</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/packages/${packageData.id}`} target="_blank">
                  Visualizar no Site
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/packages/${packageData.id}/edit`}>
                  Editar Pacote
                </Link>
              </Button>
              <Button variant="destructive" className="w-full" asChild>
                <Link href={`/admin/packages/${packageData.id}/delete`}>
                  Excluir Pacote
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



