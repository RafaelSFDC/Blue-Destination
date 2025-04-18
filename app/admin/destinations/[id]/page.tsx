import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Trash2, MapPin, Star, Tag } from "lucide-react";
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
import { getDestinationById } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { type Destination } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DestinationDetailsPage({ params }: PageProps) {
  const item = await params;
  const destination = await getDestinationById(item.id) as Destination | null;

  if (!destination) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/destinations">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {destination.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/destinations/${destination.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/admin/destinations/${destination.id}/delete`}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Destino</CardTitle>
            <CardDescription>
              Informações detalhadas sobre o destino
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={destination.imageUrl || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover"
              />
              {destination.featured && (
                <Badge className="absolute left-2 top-2 bg-blue-500 text-white">
                  Destaque
                </Badge>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Descrição</h3>
              <p className="text-muted-foreground">{destination.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-muted-foreground">
                    {destination.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Avaliação</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={destination.rating} size={16} />
                    <span className="text-sm text-muted-foreground">
                      ({destination.reviewCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {destination.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {destination.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Região</p>
                    <p className="text-sm text-muted-foreground">
                      {destination.region}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-lg font-medium">Galeria</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Imagem+${i}`}
                      alt={`Galeria ${destination.name} ${i}`}
                      fill
                      className="object-cover"
                    />
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
                <span>Preço base por pessoa</span>
                <span className="font-medium">
                  {formatCurrency(destination.price)}
                </span>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Preço por pessoa
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(destination.price)}
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
                <span className="font-medium">2,456</span>
              </div>

              <div className="flex justify-between">
                <span>Pacotes relacionados</span>
                <span className="font-medium">8</span>
              </div>

              <div className="flex justify-between">
                <span>Reservas</span>
                <span className="font-medium">124</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de conversão</span>
                <span className="font-medium">5.05%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/destinations/${destination.id}`} target="_blank">
                  Visualizar no Site
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/destinations/${destination.id}/edit`}>
                  Editar Destino
                </Link>
              </Button>
              <Button variant="destructive" className="w-full" asChild>
                <Link href={`/admin/destinations/${destination.id}/delete`}>
                  Excluir Destino
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

