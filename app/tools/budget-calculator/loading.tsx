import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BudgetCalculatorLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-12">
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <Skeleton className="h-1 w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>

                <Skeleton className="h-1 w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-5 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <Skeleton className="h-1 w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <Skeleton className="mx-auto h-4 w-32" />
                  <Skeleton className="mx-auto mt-2 h-8 w-40" />
                  <Skeleton className="mx-auto mt-1 h-4 w-24" />
                </div>

                <div className="space-y-2">
                  <div className="grid w-full grid-cols-2 gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-4 pt-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                  </div>
                </div>

                <Skeleton className="h-10 w-full" />
                <div className="flex w-full gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 rounded-lg border bg-muted/20 p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
