"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageCard } from "@/components/package-card";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Importando os hooks de React Query
import usePackages from "@/querys/usePackages";
import useTags from "@/querys/useTags";

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // Usando os hooks de React Query que criamos
  const {
    data: packages = [],
    isLoading: isLoadingPackages,
    error: packagesError,
  } = usePackages();

  const {
    data: allTags = [],
    isLoading: isLoadingTags,
    error: tagsError,
  } = useTags();

  // Combinando os estados de carregamento
  const isLoading = isLoadingPackages || isLoadingTags;

  // Tratamento de erros
  useEffect(() => {
    if (packagesError) {
      console.error("Erro ao carregar pacotes:", packagesError);
    }
    if (tagsError) {
      console.error("Erro ao carregar tags:", tagsError);
    }
  }, [packagesError, tagsError]);

  // Função para filtrar pacotes com base no termo de busca
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(packages);

  // Função para ordenar pacotes
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "duration-asc":
        return a.duration - b.duration;
      case "duration-desc":
        return b.duration - a.duration;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Pacotes de Viagem</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Descubra nossos pacotes completos com tudo que você precisa para
              uma viagem perfeita.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pacotes..."
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
                  <DropdownMenuItem onClick={() => setSortOption("default")}>
                    Padrão
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price-asc")}>
                    Preço: Menor para Maior
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price-desc")}>
                    Preço: Maior para Menor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("duration-asc")}
                  >
                    Duração: Menor para Maior
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("duration-desc")}
                  >
                    Duração: Maior para Menor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("name-asc")}>
                    Nome: A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("name-desc")}>
                    Nome: Z-A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-8 flex flex-wrap">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="featured">Destaques</TabsTrigger>
                <TabsTrigger value="discounted">Promoções</TabsTrigger>
                {allTags.slice(0, 5).map((tag) => (
                  <TabsTrigger key={tag.$id} value={tag.$id}>
                    {tag.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedPackages.length > 0 ? (
                    sortedPackages.map((pkg) => (
                      <PackageCard key={pkg.$id} package={pkg} />
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-muted-foreground">
                        Nenhum pacote encontrado.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="featured">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedPackages
                    .filter((pkg) => pkg.featured)
                    .map((pkg) => (
                      <PackageCard key={pkg.$id} package={pkg} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="discounted">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedPackages
                    .filter((pkg) => pkg.discounts && pkg.discounts.length > 0)
                    .map((pkg) => (
                      <PackageCard key={pkg.$id} package={pkg} />
                    ))}
                </div>
              </TabsContent>

              {allTags.slice(0, 5).map((tag) => (
                <TabsContent key={tag.$id} value={tag.$id}>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedPackages
                      .filter((pkg) =>
                        pkg.tags.some(
                          (packageTag) => packageTag.$id === tag.$id
                        )
                      )
                      .map((pkg) => (
                        <PackageCard key={pkg.$id} package={pkg} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </section>

        {/* Compare Section */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8 text-center shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Não consegue decidir?</h2>
              <p className="mb-6 text-muted-foreground">
                Use nossa ferramenta de comparação para analisar diferentes
                pacotes lado a lado e escolher o que melhor atende às suas
                necessidades.
              </p>
              <Button asChild>
                <Link href="/compare">Comparar Pacotes</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold">Pacotes Personalizados</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Não encontrou o pacote ideal? Nossa equipe pode criar um roteiro
              personalizado para você.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Solicitar Orçamento</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
