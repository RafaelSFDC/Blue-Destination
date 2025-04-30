import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationCard } from "@/components/destination-card";
import { getDestinations, getAvailableRegions } from "@/lib/actions";
import { Search, MapPin, Globe } from "lucide-react";

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const regions = await getAvailableRegions();

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
              <Input placeholder="Buscar destinos..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/destinations/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Ver no Mapa
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Filtrar por Região
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-8">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="featured">Destaques</TabsTrigger>
              {regions.map((region) => (
                <TabsTrigger key={region} value={region}>
                  {region}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {destinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {destinations
                  .filter((destination) => destination.featured)
                  .map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
              </div>
            </TabsContent>

            {regions.map((region) => (
              <TabsContent key={region} value={region}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {destinations
                    .filter((destination) => destination.region === region)
                    .map((destination) => (
                      <DestinationCard
                        key={destination.id}
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
