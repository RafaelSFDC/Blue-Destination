import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Users, Check, MapPin, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialCard } from "@/components/testimonial-card";
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils";
import {
  getPackageById,
  getDestinationById,
  getTestimonialsByPackage,
  getRelatedPackages,
} from "@/lib/actions";
import { PackageCard } from "@/components/package-card";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const item = await params;
  const packageData = await getPackageById(item.id);

  if (!packageData) {
    notFound();
  }

  // Buscar informações dos destinos
  const destinationsPromises = packageData.destinations.map((id) =>
    getDestinationById(id)
  );
  const destinations = await Promise.all(destinationsPromises);
  const validDestinations = destinations.filter(Boolean);

  // Buscar depoimentos
  const testimonials = await getTestimonialsByPackage(packageData.id);

  // Buscar pacotes relacionados
  const relatedPackages = await getRelatedPackages(packageData.id, 3);

  // Calcular preço com desconto
  const discountedPrice = calculateDiscountedPrice(
    packageData.price,
    packageData.discount
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[400px] items-center justify-center bg-gray-900 py-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src={
                packageData.imageUrl || "/placeholder.svg?height=800&width=1200"
              }
              alt={packageData.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                {packageData.name}
              </h1>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{packageData.duration} dias</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>
                    {validDestinations.map((d) => d?.name).join(", ")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>A partir de 1 pessoa</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                {packageData.discount ? (
                  <>
                    <span className="text-3xl font-bold">
                      {formatCurrency(discountedPrice)}
                    </span>
                    <span className="text-xl text-gray-300 line-through">
                      {formatCurrency(packageData.price)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {packageData.discount}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatCurrency(packageData.price)}
                  </span>
                )}
                <span className="text-sm">por pessoa</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerário</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold">
                      Sobre este pacote
                    </h2>
                    <p className="text-muted-foreground">
                      {packageData.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-bold">Destinos</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {validDestinations.map((destination) => (
                        <div
                          key={destination?.id}
                          className="rounded-lg border p-4"
                        >
                          <h4 className="mb-2 font-medium">
                            {destination?.name}
                          </h4>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {destination?.location}
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={destination?.rating || 0}
                              size={16}
                            />
                            <span className="text-sm text-muted-foreground">
                              ({destination?.reviewCount} avaliações)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-bold">
                      O que está incluído
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {packageData.inclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="mr-2 mt-1 h-4 w-4 text-green-500" />
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-6">
                  <h2 className="mb-4 text-2xl font-bold">Itinerário</h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="rounded-lg border p-6">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">
                              Dia {day.day}
                            </h3>
                            <p className="font-medium">{day.title}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Avaliações</h2>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-medium">
                        {testimonials.length > 0
                          ? (
                              testimonials.reduce(
                                (sum, t) => sum + t.rating,
                                0
                              ) / testimonials.length
                            ).toFixed(1)
                          : "N/A"}
                      </span>
                      <span className="text-muted-foreground">
                        ({testimonials.length}{" "}
                        {testimonials.length === 1 ? "avaliação" : "avaliações"}
                        )
                      </span>
                    </div>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">
                        Ainda não há avaliações para este pacote.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {testimonials.map((testimonial) => (
                        <TestimonialCard
                          key={testimonial.id}
                          testimonial={testimonial}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <div className="sticky top-20 rounded-lg border p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold">Reserve este pacote</h3>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Preço por pessoa</span>
                    <span className="font-medium">
                      {packageData.discount
                        ? formatCurrency(discountedPrice)
                        : formatCurrency(packageData.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="travelers" className="flex-1">
                      Viajantes
                    </label>
                    <input
                      type="number"
                      id="travelers"
                      min="1"
                      defaultValue="2"
                      className="w-16 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="date" className="flex-1">
                      Data de viagem
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="w-40 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="mb-6 border-t border-b py-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(discountedPrice * 2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    *Preço estimado para 2 pessoas
                  </p>
                </div>

                <Button className="w-full" size="lg">
                  Reservar agora
                </Button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Sem compromisso - cancele gratuitamente até 30 dias antes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Packages */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold">Pacotes relacionados</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPackages.length > 0 ? (
                relatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))
              ) : (
                <div className="col-span-3 rounded-lg border bg-white p-6 text-center">
                  <p className="text-muted-foreground">
                    Não há pacotes relacionados disponíveis no momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
