"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PriceFilter } from "@/components/search/price-filter";
import { DurationFilter } from "@/components/search/duration-filter";
import { RatingFilter } from "@/components/search/rating-filter";
import { TagFilter } from "@/components/search/tag-filter";
import { DestinationFilter } from "@/components/search/destination-filter";
import { SortSelect, type SortOption } from "@/components/search/sort-select";
import { SearchResults } from "@/components/search/search-results";
import { MobileFilters } from "@/components/search/mobile-filters";
import { ActiveFilters } from "@/components/search/active-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSearchPackages, useFilterRanges } from "@/querys/useSearch";
import { useDestinations } from "@/querys/useDestinations";
import { useTags } from "@/querys/useTags";
import type { SearchFilters } from "@/lib/types";

// Tipo unificado para Destination
export type Destination = {
  id?: string;
  $id?: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  featured: boolean;
  popular?: boolean;
  tags: string[] | any[];
  tagIds?: string[];
  region?: string;
};

// Tipo unificado para Package
export type Package = {
  id?: string;
  $id?: string;
  name: string;
  description: string;
  destinations: string[] | any[];
  destinationIds?: string[];
  duration: number;
  price: number;
  discount?: number;
  imageUrl: string;
  featured: boolean;
  inclusions: string[];
  tags: string[] | any[];
  tagIds?: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
};

const sortOptions: SortOption[] = [
  { value: "price-asc", label: "Preço: menor para maior" },
  { value: "price-desc", label: "Preço: maior para menor" },
  { value: "duration-asc", label: "Duração: menor para maior" },
  { value: "duration-desc", label: "Duração: maior para menor" },
  { value: "name-asc", label: "Nome: A-Z" },
  { value: "name-desc", label: "Nome: Z-A" },
];

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialRender = useRef(true);

  // Obter parâmetros da URL
  const queryParam = searchParams.get("q") || "";
  const destinationParam = searchParams.get("destination") || null;
  const minPriceParam = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPriceParam = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const minDurationParam = searchParams.get("minDuration")
    ? Number(searchParams.get("minDuration"))
    : undefined;
  const maxDurationParam = searchParams.get("maxDuration")
    ? Number(searchParams.get("maxDuration"))
    : undefined;
  const ratingsParam = searchParams.get("ratings")
    ? searchParams.get("ratings")!.split(",").map(Number)
    : [];
  const tagsParam = searchParams.get("tags")
    ? searchParams.get("tags")!.split(",")
    : [];
  const sortByParam = searchParams.get("sortBy") || "price-asc";
  const pageParam = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const travelersParam = searchParams.get("travelers")
    ? Number(searchParams.get("travelers"))
    : 1;

  // Buscar dados usando as queries
  const {
    data: filterRanges = {
      price: { min: 0, max: 10000 },
      duration: { min: 1, max: 30 },
    },
    isLoading: isLoadingRanges,
  } = useFilterRanges();
  const { data: destinations = [], isLoading: isLoadingDestinations } =
    useDestinations();
  const { data: tagsData = [], isLoading: isLoadingTags } = useTags();
  const allTags = tagsData.map((tag) => tag.name);

  // Estados para os filtros
  const [query, setQuery] = useState(queryParam);
  const [destinationId, setDestinationId] = useState<string | null>(
    destinationParam
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam || filterRanges.price.min,
    maxPriceParam || filterRanges.price.max,
  ]);
  const [durationRange, setDurationRange] = useState<[number, number]>([
    minDurationParam || filterRanges.duration.min,
    maxDurationParam || filterRanges.duration.max,
  ]);
  const [ratings, setRatings] = useState<number[]>(ratingsParam);
  const [tags, setTags] = useState<string[]>(tagsParam);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [page, setPage] = useState(pageParam);
  const travelers = travelersParam;
  const resultType = "packages";

  // Estado para os filtros temporários (usado no mobile)
  const [tempFilters, setTempFilters] = useState({
    destinationId,
    priceRange,
    durationRange,
    ratings,
    tags,
  });

  // Atualizar estados quando os dados são carregados
  useEffect(() => {
    if (!isLoadingRanges) {
      setPriceRange([
        minPriceParam || filterRanges.price.min,
        maxPriceParam || filterRanges.price.max,
      ]);
      setDurationRange([
        minDurationParam || filterRanges.duration.min,
        maxDurationParam || filterRanges.duration.max,
      ]);

      // Atualizar também os filtros temporários
      setTempFilters((prev) => ({
        ...prev,
        priceRange: [
          minPriceParam || filterRanges.price.min,
          maxPriceParam || filterRanges.price.max,
        ],
        durationRange: [
          minDurationParam || filterRanges.duration.min,
          maxDurationParam || filterRanges.duration.max,
        ],
      }));
    }
  }, [
    isLoadingRanges,
    filterRanges,
    minPriceParam,
    maxPriceParam,
    minDurationParam,
    maxDurationParam,
  ]);

  // Encontrar o destino selecionado
  const selectedDestination = destinationId
    ? destinations.find((d) => (d.id || d.$id) === destinationId)
    : null;

  // Função para atualizar a URL com os filtros
  const updateUrl = useCallback(() => {
    if (isInitialRender.current) return;

    const paramsUrl = new URLSearchParams();

    if (query) paramsUrl.set("q", query);
    if (destinationId) paramsUrl.set("destination", destinationId);

    if (priceRange[0] > filterRanges.price.min) {
      paramsUrl.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < filterRanges.price.max) {
      paramsUrl.set("maxPrice", priceRange[1].toString());
    }

    if (durationRange[0] > filterRanges.duration.min) {
      paramsUrl.set("minDuration", durationRange[0].toString());
    }

    if (durationRange[1] < filterRanges.duration.max) {
      paramsUrl.set("maxDuration", durationRange[1].toString());
    }

    if (ratings.length > 0) {
      paramsUrl.set("ratings", ratings.join(","));
    }

    if (tags.length > 0) {
      paramsUrl.set("tags", tags.join(","));
    }

    if (sortBy !== "price-asc") {
      paramsUrl.set("sortBy", sortBy);
    }

    if (page > 1) {
      paramsUrl.set("page", page.toString());
    }

    if (travelers > 1) {
      paramsUrl.set("travelers", travelers.toString());
    }

    const newUrl = `/search?${paramsUrl.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [
    query,
    destinationId,
    priceRange,
    durationRange,
    ratings,
    tags,
    sortBy,
    page,
    travelers,
    filterRanges,
    router,
    isInitialRender,
  ]);

  // Criar os filtros para a busca
  const filters: SearchFilters = {
    query,
    destinationId: destinationId || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minDuration: durationRange[0],
    maxDuration: durationRange[1],
    ratings: ratings.length > 0 ? ratings : undefined,
    tagIds: tags.length > 0 ? tags : undefined,
    sortBy,
    page,
    limit: 9,
    travelers,
  };

  // Buscar resultados usando a query
  const {
    data: searchResults = { results: [], totalResults: 0, hasMore: false },
    isLoading: isLoadingResults,
    isFetching: isFetchingResults,
  } = useSearchPackages(filters);

  // Efeito para atualizar a URL quando os filtros mudam
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      updateUrl();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    query,
    destinationId,
    priceRange,
    durationRange,
    ratings,
    tags,
    sortBy,
    page,
    travelers,
    updateUrl,
  ]);

  // Função para carregar mais resultados
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Função para limpar um filtro específico
  const handleClearFilter = (filterType: string, value?: any) => {
    switch (filterType) {
      case "query":
        setQuery("");
        break;
      case "destination":
        setDestinationId(null);
        break;
      case "priceRange":
        setPriceRange([filterRanges.price.min, filterRanges.price.max]);
        break;
      case "durationRange":
        setDurationRange([
          filterRanges.duration.min,
          filterRanges.duration.max,
        ]);
        break;
      case "ratings":
        setRatings([]);
        break;
      case "tag":
        setTags((prev) => prev.filter((t) => t !== value));
        break;
      default:
        break;
    }

    // Resetar para a primeira página
    setPage(1);
  };

  // Função para limpar todos os filtros
  const handleClearAll = () => {
    setQuery("");
    setDestinationId(null);
    setPriceRange([filterRanges.price.min, filterRanges.price.max]);
    setDurationRange([filterRanges.duration.min, filterRanges.duration.max]);
    setRatings([]);
    setTags([]);
    setPage(1);

    // Também atualizar os filtros temporários
    setTempFilters({
      destinationId: null,
      priceRange: [filterRanges.price.min, filterRanges.price.max],
      durationRange: [filterRanges.duration.min, filterRanges.duration.max],
      ratings: [],
      tags: [],
    });
  };

  // Funções para o filtro mobile
  const handleApplyMobileFilters = () => {
    setDestinationId(tempFilters.destinationId);
    setPriceRange(tempFilters.priceRange);
    setDurationRange(tempFilters.durationRange);
    setRatings(tempFilters.ratings);
    setTags(tempFilters.tags);
    setPage(1);
  };

  const handleResetMobileFilters = () => {
    setTempFilters({
      destinationId: null,
      priceRange: [filterRanges.price.min, filterRanges.price.max],
      durationRange: [filterRanges.duration.min, filterRanges.duration.max],
      ratings: [],
      tags: [],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buscar Pacotes</h1>
        <p className="mt-2 text-muted-foreground">
          Encontre o pacote perfeito para sua próxima aventura
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <MobileFilters
            onApply={handleApplyMobileFilters}
            onReset={handleResetMobileFilters}
          >
            <DestinationFilter
              destinations={destinations}
              onChange={(value) =>
                setTempFilters((prev) => ({ ...prev, destinationId: value }))
              }
              defaultValue={tempFilters.destinationId}
            />
            <Separator />
            <PriceFilter
              minPrice={filterRanges.price.min}
              maxPrice={filterRanges.price.max}
              defaultValue={tempFilters.priceRange}
              onChange={(value) =>
                setTempFilters((prev) => ({ ...prev, priceRange: value }))
              }
            />
            <Separator />
            <DurationFilter
              minDuration={filterRanges.duration.min}
              maxDuration={filterRanges.duration.max}
              defaultValue={tempFilters.durationRange}
              onChange={(value) =>
                setTempFilters((prev) => ({ ...prev, durationRange: value }))
              }
            />
            <Separator />
            <RatingFilter
              onChange={(value) =>
                setTempFilters((prev) => ({ ...prev, ratings: value }))
              }
            />
            <Separator />
            <TagFilter
              tags={allTags}
              onChange={(value) =>
                setTempFilters((prev) => ({ ...prev, tags: value }))
              }
              defaultValue={tempFilters.tags}
            />
          </MobileFilters>

          <SortSelect
            options={sortOptions}
            defaultValue={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      <ActiveFilters
        priceRange={priceRange}
        durationRange={durationRange}
        ratings={ratings.length > 0 ? ratings : null}
        tags={tags.length > 0 ? tags : null}
        destination={selectedDestination}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAll}
      />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filtros Desktop */}
        <div className="hidden space-y-6 lg:block">
          <div>
            <h3 className="mb-4 text-lg font-medium">Filtros</h3>
            <div className="space-y-6">
              <DestinationFilter
                destinations={destinations}
                onChange={setDestinationId}
                defaultValue={destinationId}
              />

              <Separator />

              <PriceFilter
                minPrice={filterRanges.price.min}
                maxPrice={filterRanges.price.max}
                defaultValue={priceRange}
                onChange={setPriceRange}
              />

              <Separator />

              <DurationFilter
                minDuration={filterRanges.duration.min}
                maxDuration={filterRanges.duration.max}
                defaultValue={durationRange}
                onChange={setDurationRange}
              />

              <Separator />

              <RatingFilter onChange={setRatings} />

              <Separator />

              <TagFilter
                tags={allTags}
                onChange={setTags}
                defaultValue={tags}
              />

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearAll}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-3">
          <SearchResults
            results={
              searchResults.results as unknown as (Package | Destination)[]
            }
            resultType={resultType}
            isLoading={
              isLoadingResults ||
              isLoadingDestinations ||
              isLoadingTags ||
              isLoadingRanges
            }
            totalResults={searchResults.totalResults}
            hasMore={searchResults.hasMore}
            onLoadMore={handleLoadMore}
          />

          {isFetchingResults && page > 1 && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
