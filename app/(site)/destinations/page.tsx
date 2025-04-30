"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationCard } from "@/components/destination-card";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useDestinations } from "@/querys/useDestinations";
import { useTagsByType } from "@/querys/useTags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const { data: destinations = [], isLoading: isLoadingDestinations } =
    useDestinations();
  const { data: tags = [], isLoading: isLoadingTags } =
    useTagsByType("destination");

  // Filtrar destinos com base no termo de busca
  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para ordenar destinos
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      case "rating-asc":
        return (a.rating || 0) - (b.rating || 0);
      case "popularity-desc":
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      default:
        return 0;
    }
  });

  if (isLoadingDestinations || isLoadingTags) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4">Carregando destinos...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Destinos</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Descubra lugares incríveis ao redor do mundo e comece a planejar
              sua próxima aventura.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar destinos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/search">
                  <Filter className="mr-2 h-4 w-4" />
                  Busca Avançada
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Ordenar
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption("name-asc")}>
                    Nome: A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("name-desc")}>
                    Nome: Z-A
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("rating-desc")}>
                    Melhor Avaliação
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("rating-asc")}>
                    Pior Avaliação
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("popularity-desc")}>
                    Mais Popular
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="featured">Destaques</TabsTrigger>
              {tags.map((tag) => (
                <TabsTrigger key={tag.$id} value={tag.$id}>
                  {tag.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.$id}
                    destination={destination}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedDestinations
                  .filter((destination) => destination.featured)
                  .map((destination) => (
                    <DestinationCard
                      key={destination.$id}
                      destination={destination}
                    />
                  ))}
              </div>
            </TabsContent>

            {tags.map((tag) => (
              <TabsContent key={tag.$id} value={tag.$id}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedDestinations
                    .filter(
                      (destination) =>
                        destination.tags &&
                        destination.tags.some(
                          (destTag) => destTag.$id === tag.$id
                        )
                    )
                    .map((destination) => (
                      <DestinationCard
                        key={destination.$id}
                        destination={destination}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Não encontrou o que procura?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Entre em contato com nossa equipe e criaremos um roteiro
              personalizado para você.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Fale Conosco</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
