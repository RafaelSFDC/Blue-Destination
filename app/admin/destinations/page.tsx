"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Tag,
  MapPin,
  Search,
  Filter,
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
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useDestinations } from "@/querys/useDestinations";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StarRating } from "@/components/ui/star-rating";

// Definição do tipo Destination baseado no uso no código
type Destination = {
  $id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  featured: boolean;
  popular?: boolean;
  tags: { $id: string; name: string }[];
  region?: string;
};

function DestinationsTable({ data }: { data: Destination[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtro global por nome
  useEffect(() => {
    if (searchQuery) {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((filter) => filter.id !== "name");
        return [
          ...newFilters,
          {
            id: "name",
            value: searchQuery,
          },
        ];
      });
    } else {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== "name"));
    }
  }, [searchQuery]);

  const columns: ColumnDef<Destination>[] = [
    {
      accessorKey: "name",
      header: "Destino",
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <Image
                src={
                  destination.imageUrl || "/placeholder.svg?height=40&width=64"
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
        );
      },
      filterFn: (row, id, value) => {
        const itemValue = row.getValue(id) as string;
        return itemValue.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Localização
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{destination.location}</span>
            {destination.region && (
              <Badge
                variant="outline"
                className="ml-1 bg-purple-100 text-purple-800"
              >
                {destination.region}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avaliação
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex items-center gap-2">
            <StarRating rating={destination.rating} size={16} />
            <span className="text-sm text-muted-foreground">
              ({destination.reviewCount})
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Preço
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="font-medium">{formatCurrency(destination.price)}</div>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Destaque",
      cell: ({ row }) => {
        const destination = row.original;
        return destination.featured ? (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Destaque
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "popular",
      header: "Popular",
      cell: ({ row }) => {
        const destination = row.original;
        return destination.popular ? (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Popular
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex flex-wrap gap-1">
            {destination.featured && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Destaque
              </Badge>
            )}
            {destination.popular && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Popular
              </Badge>
            )}
            {destination.tags &&
              destination.tags.length > 0 &&
              destination.tags.slice(0, 1).map((tag) => (
                <Badge
                  key={tag.$id}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {typeof tag === "object" ? tag.name : tag}
                </Badge>
              ))}
            {destination.tags && destination.tags.length > 1 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                +{destination.tags.length - 1}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/destinations/${destination.$id}`} target="_blank">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/destinations/${destination.$id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/destinations/${destination.$id}/delete`}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    // Função de filtro personalizada para a coluna "name"
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const itemValue = row.getValue(columnId) as string;
        return itemValue.toLowerCase().includes(value.toLowerCase());
      },
    },
    // Ocultar colunas virtuais
    initialState: {
      columnVisibility: {
        featured: false,
        popular: false,
      },
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar destinos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={
                  table.getColumn("featured")?.getFilterValue() as boolean
                }
                onCheckedChange={(value) =>
                  table.getColumn("featured")?.setFilterValue(value)
                }
              >
                Apenas Destaques
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={
                  table.getColumn("popular")?.getFilterValue() as boolean
                }
                onCheckedChange={(value) =>
                  table.getColumn("popular")?.setFilterValue(value)
                }
              >
                Apenas Populares
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum destino encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} de {data.length}{" "}
          destinos
        </div>

        {(searchQuery ||
          columnFilters.some((filter) => filter.id !== "name")) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setColumnFilters([]);
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}

export default function AdminDestinationsPage() {
  const { data: destinations = [], isLoading } = useDestinations();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Destinos</h2>
            <p className="text-muted-foreground">
              Carregando informações dos destinos...
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Novo Destino
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Destinos</CardTitle>
            <CardDescription>Carregando lista de destinos...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <DestinationsTable data={destinations} />
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
