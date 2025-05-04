import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Plus, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getDestinations } from "@/actions/destinations";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Destinos</h2>
          <p className="text-muted-foreground">
            Gerencie os destinos disponíveis no site.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Destino
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Destinos</CardTitle>
          <CardDescription>
            Total de {destinations.length} destino
            {destinations.length !== 1 && "s"} cadastrado
            {destinations.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destino</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.$id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 overflow-hidden rounded">
                          <Image
                            src={
                              destination.imageUrl ||
                              "/placeholder.svg?height=40&width=64"
                            }
                            alt={destination.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{destination.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {destination.$id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{destination.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StarRating rating={destination.rating} size={16} />
                        <span className="text-sm text-muted-foreground">
                          ({destination.reviewCount})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(destination.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {destination.featured && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800"
                          >
                            Destaque
                          </Badge>
                        )}
                        {destination.popular && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800"
                          >
                            Popular
                          </Badge>
                        )}
                        {destination.region && (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800"
                          >
                            {destination.region}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/destinations/${destination.$id}`}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/destinations/${destination.$id}/edit`}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/destinations/${destination.$id}/delete`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Destinos em Destaque</CardTitle>
            <CardDescription>
              Destinos marcados como destaque no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {destinations.filter((dest) => dest.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {destinations.length > 0
                ? Math.round(
                    (destinations.filter((dest) => dest.featured).length /
                      destinations.length) *
                      100
                  )
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avaliação Média</CardTitle>
            <CardDescription>Média de avaliações dos destinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {destinations.length > 0
                  ? (
                      destinations.reduce((sum, dest) => sum + dest.rating, 0) /
                      destinations.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">
              De {destinations.reduce((sum, dest) => sum + dest.reviewCount, 0)}{" "}
              avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Preço Médio</CardTitle>
            <CardDescription>Valor médio dos destinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {destinations.length > 0
                ? formatCurrency(
                    destinations.reduce((sum, dest) => sum + dest.price, 0) /
                      destinations.length
                  )
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">Por pessoa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Regiões</CardTitle>
            <CardDescription>Quantidade de regiões disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                new Set(destinations.map((dest) => dest.region).filter(Boolean))
                  .size
              }
            </div>
            <p className="text-xs text-muted-foreground">Regiões diferentes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
