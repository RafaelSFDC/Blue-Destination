"use client";

import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Plus, Eye, Tag, Clock, MapPin, Search, Filter } from "lucide-react";
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
import usePackages from "@/querys/usePackages";
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

// Definição do tipo Package baseado no uso no código
type Package = {
  $id: string;
  name: string;
  imageUrl?: string;
  duration: number;
  destinations: any[];
  price: number;
  discounts?: { value: number }[];
  featured: boolean;
  tags: { $id: string; name: string }[];
};

function PackagesTable({ data }: { data: Package[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtro global por nome
  useEffect(() => {
    if (searchQuery) {
      setColumnFilters(prev => {
        const newFilters = prev.filter(filter => filter.id !== "name");
        return [...newFilters, {
          id: "name",
          value: searchQuery
        }];
      });
    } else {
      setColumnFilters(prev => prev.filter(filter => filter.id !== "name"));
    }
  }, [searchQuery]);

  const columns: ColumnDef<Package>[] = [
    {
      accessorKey: "name",
      header: "Pacote",
      cell: ({ row }) => {
        const pkg = row.original;
        return (
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
              <div className="text-xs text-muted-foreground">ID: {pkg.$id}</div>
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
      accessorKey: "duration",
      header: "Duração",
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{pkg.duration} dias</span>
          </div>
        );
      },
    },
    {
      accessorKey: "destinations",
      header: "Destinos",
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{pkg.destinations.length} destinos</span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Preço",
      cell: ({ row }) => {
        const pkg = row.original;
        return pkg.discounts?.length ? (
          <div>
            <div className="font-medium">
              {formatCurrency(pkg.price * (1 - pkg.discounts[0].value / 100))}
            </div>
            <div className="text-xs text-muted-foreground line-through">
              {formatCurrency(pkg.price)}
            </div>
          </div>
        ) : (
          <div className="font-medium">{formatCurrency(pkg.price)}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex flex-wrap gap-1">
            {pkg.featured && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Destaque
              </Badge>
            )}
            {pkg.discounts?.length ? (
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {pkg.discounts[0].value}% OFF
              </Badge>
            ) : null}
            {pkg.tags.slice(0, 1).map((tag) => (
              <Badge
                key={tag.$id}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {typeof tag === "object" ? tag.name : tag}
              </Badge>
            ))}
            {pkg.tags.length > 1 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                +{pkg.tags.length - 1}
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
        const pkg = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/packages/${pkg.$id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/packages/${pkg.$id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        );
      },
    },
    {
      id: "featured",
      accessorFn: (row) => row.featured,
      enableColumnFilter: true,
      header: "Destaque",
      cell: () => null,
    },
    {
      id: "hasDiscount",
      accessorFn: (row) => Boolean(row.discounts && row.discounts.length > 0),
      enableColumnFilter: true,
      header: "Com Desconto",
      cell: () => null,
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
        hasDiscount: false,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pacotes..."
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
                checked={table.getColumn("featured")?.getFilterValue() as boolean}
                onCheckedChange={(value) => {
                  table.getColumn("featured")?.setFilterValue(value || undefined);
                }}
              >
                Apenas Destaques
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("hasDiscount")?.getFilterValue() as boolean}
                onCheckedChange={(value) => {
                  table.getColumn("hasDiscount")?.setFilterValue(value || undefined);
                }}
              >
                Com Desconto
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
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "flex cursor-pointer items-center gap-1"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp className="h-4 w-4" />,
                        desc: <ChevronDown className="h-4 w-4" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
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
                Nenhum pacote encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} de {data.length} pacotes
        </div>
        
        {(searchQuery || columnFilters.some(filter => filter.id !== "name")) && (
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

export default function AdminPackagesPage() {
  const { data: packages = [], isLoading } = usePackages();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pacotes</h2>
            <p className="text-muted-foreground">
              Carregando informações dos pacotes...
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pacote
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Pacotes</CardTitle>
            <CardDescription>Carregando lista de pacotes...</CardDescription>
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
          <h2 className="text-3xl font-bold tracking-tight">Pacotes</h2>
          <p className="text-muted-foreground">
            Gerencie os pacotes de viagem disponíveis no site.
          </p>
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
            Total de {packages.length} pacote{packages.length !== 1 && "s"}{" "}
            cadastrado{packages.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <PackagesTable data={packages} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pacotes em Destaque</CardTitle>
            <CardDescription>
              Pacotes marcados como destaque no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {packages.filter((pkg) => pkg.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (packages.filter((pkg) => pkg.featured).length /
                  packages.length) *
                  100
              )}
              % do total
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
              {
                packages.filter(
                  (pkg) => pkg.discounts && pkg.discounts.length > 0
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (packages.filter(
                  (pkg) => pkg.discounts && pkg.discounts.length > 0
                ).length /
                  packages.length) *
                  100
              )}
              % do total
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
              {formatCurrency(
                packages.reduce((sum, pkg) => sum + pkg.price, 0) /
                  packages.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Por pessoa</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
