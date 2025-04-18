import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ToolsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="mb-2 h-12 w-12 rounded-lg" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
