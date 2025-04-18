import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackageCard } from "@/components/package-card"
import { getPackages, getAllTags } from "@/lib/actions"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

export default async function PackagesPage() {
  const packages = await getPackages()
  const allTags = await getAllTags()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Pacotes de Viagem</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Descubra nossos pacotes completos com tudo que você precisa para uma viagem perfeita.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar pacotes..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/search">
                  <Filter className="mr-2 h-4 w-4" />
                  Busca Avançada
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-8">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="featured">Destaques</TabsTrigger>
              <TabsTrigger value="discounted">Promoções</TabsTrigger>
              {allTags.slice(0, 5).map((tag) => (
                <TabsTrigger key={tag} value={tag} className="capitalize">
                  {tag}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages
                  .filter((pkg) => pkg.featured)
                  .map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="discounted">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages
                  .filter((pkg) => pkg.discount && pkg.discount > 0)
                  .map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
              </div>
            </TabsContent>

            {allTags.slice(0, 5).map((tag) => (
              <TabsContent key={tag} value={tag}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {packages
                    .filter((pkg) => pkg.tags.includes(tag))
                    .map((pkg) => (
                      <PackageCard key={pkg.id} package={pkg} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Compare Section */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8 text-center shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Não consegue decidir?</h2>
              <p className="mb-6 text-muted-foreground">
                Use nossa ferramenta de comparação para analisar diferentes pacotes lado a lado e escolher o que melhor
                atende às suas necessidades.
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
              Não encontrou o pacote ideal? Nossa equipe pode criar um roteiro personalizado para você.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Solicitar Orçamento</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
