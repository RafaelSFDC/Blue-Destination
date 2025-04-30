import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTestimonials, getPackages, getDestinations } from "@/lib/actions";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const packages = await getPackages();
  const destinations = await getDestinations();

  // Agrupar depoimentos por destino
  const testimonialsByDestination = destinations
    .map((destination) => {
      const packageIds = packages
        .filter((pkg) => pkg.destinations.includes(destination.id))
        .map((pkg) => pkg.id);

      const destinationTestimonials = testimonials.filter((testimonial) =>
        packageIds.includes(testimonial.packageId)
      );

      return {
        destination,
        testimonials: destinationTestimonials,
      };
    })
    .filter((item) => item.testimonials.length > 0);

  // Agrupar depoimentos por pacote
  const testimonialsByPackage = packages
    .map((pkg) => {
      const packageTestimonials = testimonials.filter(
        (testimonial) => testimonial.packageId === pkg.id
      );

      return {
        package: pkg,
        testimonials: packageTestimonials,
      };
    })
    .filter((item) => item.testimonials.length > 0);

  // Calcular média de avaliações
  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  // Contar avaliações por estrela
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = testimonials.filter(
      (t) => Math.floor(t.rating) === stars
    ).length;
    const percentage = (count / testimonials.length) * 100;
    return { stars, count, percentage };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Avaliações e Depoimentos
            </h1>
            <p className="mx-auto max-w-2xl text-lg">
              Descubra o que nossos clientes dizem sobre suas experiências com a
              Blue Destination.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold">
                O que nossos clientes acham
              </h2>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 p-6 text-center">
                  <span className="text-5xl font-bold text-primary">
                    {averageRating.toFixed(1)}
                  </span>
                  <StarRating
                    rating={averageRating}
                    size={24}
                    className="my-2"
                  />
                  <span className="text-sm text-muted-foreground">
                    Baseado em {testimonials.length} avaliações
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  {ratingCounts.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex w-20 items-center">
                        <span className="mr-1 font-medium">{stars}</span>
                        <StarRating rating={stars} size={16} />
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-sm text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Compartilhe sua experiência
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Viajou conosco recentemente? Adoraríamos ouvir sobre sua
                  experiência. Compartilhe sua avaliação e ajude outros
                  viajantes a planejar suas próximas aventuras.
                </p>
                <Button asChild>
                  <Link href="/testimonials/new">Deixar Avaliação</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={`/placeholder.svg?height=300&width=300&text=Viagem+${i}`}
                    alt={`Foto de cliente ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <Tabs defaultValue="all" className="w-full">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Depoimentos de Clientes</h2>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="destinations">Por Destino</TabsTrigger>
                  <TabsTrigger value="packages">Por Pacote</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.date}
                            </p>
                          </div>
                        </div>

                        <StarRating
                          rating={testimonial.rating}
                          className="mb-3"
                        />

                        <p className="mb-3 text-muted-foreground">
                          {testimonial.comment}
                        </p>

                        <div className="mt-4 text-sm">
                          <span className="font-medium">Pacote: </span>
                          <Link
                            href={`/packages/${testimonial.packageId}`}
                            className="text-primary hover:underline"
                          >
                            {
                              packages.find(
                                (p) => p.id === testimonial.packageId
                              )?.name
                            }
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="destinations" className="space-y-8">
                {testimonialsByDestination.map(
                  ({ destination, testimonials }) => (
                    <div key={destination.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">
                          {destination.name}
                        </h3>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/destinations/${destination.id}`}>
                            Ver Destino
                          </Link>
                        </Button>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.slice(0, 3).map((testimonial) => (
                          <Card key={testimonial.id}>
                            <CardContent className="p-6">
                              <div className="mb-4 flex items-center gap-4">
                                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                  <Image
                                    src={
                                      testimonial.avatar || "/placeholder.svg"
                                    }
                                    alt={testimonial.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {testimonial.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {testimonial.date}
                                  </p>
                                </div>
                              </div>

                              <StarRating
                                rating={testimonial.rating}
                                className="mb-3"
                              />

                              <p className="mb-3 text-muted-foreground">
                                {testimonial.comment}
                              </p>

                              <div className="mt-4 text-sm">
                                <span className="font-medium">Pacote: </span>
                                <Link
                                  href={`/packages/${testimonial.packageId}`}
                                  className="text-primary hover:underline"
                                >
                                  {
                                    packages.find(
                                      (p) => p.id === testimonial.packageId
                                    )?.name
                                  }
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {testimonials.length > 3 && (
                        <div className="text-center">
                          <Button variant="outline" asChild>
                            <Link
                              href={`/destinations/${destination.id}#reviews`}
                            >
                              Ver mais avaliações sobre {destination.name}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </TabsContent>

              <TabsContent value="packages" className="space-y-8">
                {testimonialsByPackage.map(({ package: pkg, testimonials }) => (
                  <div key={pkg.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/packages/${pkg.id}`}>Ver Pacote</Link>
                      </Button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {testimonials.slice(0, 3).map((testimonial) => (
                        <Card key={testimonial.id}>
                          <CardContent className="p-6">
                            <div className="mb-4 flex items-center gap-4">
                              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                <Image
                                  src={testimonial.avatar || "/placeholder.svg"}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {testimonial.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.date}
                                </p>
                              </div>
                            </div>

                            <StarRating
                              rating={testimonial.rating}
                              className="mb-3"
                            />

                            <p className="mb-3 text-muted-foreground">
                              {testimonial.comment}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {testimonials.length > 3 && (
                      <div className="text-center">
                        <Button variant="outline" asChild>
                          <Link href={`/packages/${pkg.id}#reviews`}>
                            Ver mais avaliações sobre {pkg.name}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16">
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">
              Pronto para criar suas próprias memórias?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Junte-se aos milhares de clientes satisfeitos e comece a planejar
              sua próxima aventura com a Blue Destination.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/packages">Explorar Pacotes</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
