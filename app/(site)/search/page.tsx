import { Suspense } from "react";
import { SearchPage } from "./search-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchPage />
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
