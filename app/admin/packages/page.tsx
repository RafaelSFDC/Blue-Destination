import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus, Eye, Tag, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getPackages } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

export default async function AdminPackagesPage() {
  const packages = await getPackages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pacotes</h2>
          <p className="text-muted-foreground">Gerencie os pacotes de viagem disponíveis no site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pacote
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Pacotes</CardTitle>
          <CardDescription>
            Total de {packages.length} pacote{packages.length !== 1 && "s"} cadastrado{packages.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Destinos</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 overflow-hidden rounded">
                          <Image
                            src={pkg.imageUrl || "/placeholder.svg?height=40&width=64"}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{pkg.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {pkg.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{pkg.duration} dias</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{pkg.destinations.length} destinos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pkg.discount ? (
                        <div>
                          <div className="font-medium">{formatCurrency(pkg.price * (1 - pkg.discount / 100))}</div>
                          <div className="text-xs text-muted-foreground line-through">{formatCurrency(pkg.price)}</div>
                        </div>
                      ) : (
                        <div className="font-medium">{formatCurrency(pkg.price)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pkg.featured && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Destaque
                          </Badge>
                        )}
                        {pkg.discount && (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            {pkg.discount}% OFF
                          </Badge>
                        )}
                        {pkg.tags.slice(0, 1).map((tag) => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                        {pkg.tags.length > 1 && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            +{pkg.tags.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/packages/${pkg.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/packages/${pkg.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pacotes em Destaque</CardTitle>
            <CardDescription>Pacotes marcados como destaque no site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{packages.filter((pkg) => pkg.featured).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((packages.filter((pkg) => pkg.featured).length / packages.length) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pacotes com Desconto</CardTitle>
            <CardDescription>Pacotes com promoções ativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {packages.filter((pkg) => pkg.discount && pkg.discount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((packages.filter((pkg) => pkg.discount && pkg.discount > 0).length / packages.length) * 100)}%
              do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Preço Médio</CardTitle>
            <CardDescription>Valor médio dos pacotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length)}
            </div>
            <p className="text-xs text-muted-foreground">Por pessoa</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
