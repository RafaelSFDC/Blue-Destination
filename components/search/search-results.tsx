"use client";
import { PackageCard } from "@/components/package-card";
import { DestinationCard } from "@/components/destination-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Package, Destination } from "@/app/(site)/search/search-page";

interface SearchResultsProps {
  results: (Package | Destination)[];
  resultType: "packages" | "destinations";
  isLoading?: boolean;
  totalResults?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function SearchResults({
  results,
  resultType,
  isLoading = false,
  totalResults = 0,
  hasMore = false,
  onLoadMore,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente ajustar seus filtros para encontrar o que está procurando.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        {totalResults}{" "}
        {totalResults === 1 ? "resultado encontrado" : "resultados encontrados"}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resultType === "packages" &&
          results.map((item) => {
            const pkg = item as Package;
            return <PackageCard key={pkg.id || pkg.$id} package={pkg} />;
          })}

        {resultType === "destinations" &&
          results.map((item) => {
            const destination = item as Destination;
            return (
              <DestinationCard
                key={destination.id || destination.$id}
                destination={destination}
              />
            );
          })}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Carregar mais"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
