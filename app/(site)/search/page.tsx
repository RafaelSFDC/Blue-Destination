import { Suspense } from "react";
import { SearchPage } from "./search-page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getDestinations, getAllTags, getFilterRanges } from "@/lib/actions";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Buscar dados necessários para os filtros
  const destinations = await getDestinations();
  const allTags = await getAllTags();
  const filterRanges = await getFilterRanges();

  const search = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchPage
              initialQuery={(search.q as string) || ""}
              initialDestination={search.destination as string}
              initialMinPrice={
                search.minPrice
                  ? Number.parseInt(search.minPrice as string)
                  : filterRanges.price.min
              }
              initialMaxPrice={
                search.maxPrice
                  ? Number.parseInt(search.maxPrice as string)
                  : filterRanges.price.max
              }
              initialMinDuration={
                search.minDuration
                  ? Number.parseInt(search.minDuration as string)
                  : filterRanges.duration.min
              }
              initialMaxDuration={
                search.maxDuration
                  ? Number.parseInt(search.maxDuration as string)
                  : filterRanges.duration.max
              }
              initialRatings={
                search.ratings
                  ? (search.ratings as string).split(",").map(Number)
                  : []
              }
              initialTags={
                search.tags ? (search.tags as string).split(",") : []
              }
              initialSortBy={(search.sortBy as string) || "price-asc"}
              initialPage={
                search.page ? Number.parseInt(search.page as string) : 1
              }
              initialTravelers={
                search.travelers
                  ? Number.parseInt(search.travelers as string)
                  : 1
              }
              destinations={destinations}
              allTags={allTags}
              filterRanges={filterRanges}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  );
}
