import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Clock, Users, Check, MapPin, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { TestimonialCard } from "@/components/testimonial-card";
import { BookingForm } from "@/components/booking-form";
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils";
import { Package } from "@/lib/types";
import { RelatedPackages } from "./related-packages";

export function PackageDetails({ packageItem }: { packageItem: Package }) {
  // Calcular o preço com desconto
  const discountedPrice = packageItem.discounts?.length
    ? packageItem.discounts[0].type === "percentage"
      ? calculateDiscountedPrice(
          packageItem.price,
          packageItem.discounts[0].value
        )
      : packageItem.price - packageItem.discounts[0].value
    : packageItem.price;

  // Filtrar destinos válidos
  const validDestinations = packageItem.destinations?.filter((d) => d) || [];

  // Obter testemunhos/avaliações
  const testimonials = packageItem.testimonials || [];
  const packageIds = packageItem.destinations?.map((d) => d.$id) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[400px] items-center justify-center bg-gray-900 py-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              packageItem.imageUrl || "/placeholder.svg?height=800&width=1200"
            }
            alt={packageItem.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              {packageItem.name}
            </h1>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <span>{packageItem.duration} dias</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                <span>
                  {validDestinations.map((d: any) => d?.name).join(", ")}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span>A partir de 1 pessoa</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              {packageItem.discounts?.length ? (
                <>
                  <span className="text-3xl font-bold">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-xl text-gray-300 line-through">
                    {formatCurrency(packageItem.price)}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {packageItem.discounts[0].type === "percentage"
                      ? `${packageItem.discounts[0].value}% OFF`
                      : `${formatCurrency(packageItem.discounts[0].value)} OFF`}
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatCurrency(packageItem.price)}
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
                  <h2 className="mb-4 text-2xl font-bold">Sobre este pacote</h2>
                  <p className="text-muted-foreground">
                    {packageItem.description}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-bold">Destinos</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {validDestinations.map((destination: any) => (
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
                    {packageItem.inclusions?.map(
                      (inclusion: any, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="mr-2 mt-1 h-4 w-4 text-green-500" />
                          <span>
                            {typeof inclusion === "string"
                              ? inclusion
                              : inclusion.name}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                <h2 className="mb-4 text-2xl font-bold">Itinerário</h2>
                <div className="space-y-6">
                  {packageItem.itinerarys?.map((day: any) => (
                    <div key={day.day} className="rounded-lg border p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Dia {day.day}</h3>
                          <p className="font-medium">{day.title}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{day.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <h2 className="mb-4 text-2xl font-bold">Avaliações</h2>
                <div className="space-y-4">
                  {testimonials.length > 0 ? (
                    testimonials.map((testimonial: any) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Ainda não há avaliações para este pacote.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="sticky top-24">
              {/* Importar o componente BookingForm */}
              <BookingForm
                packageId={packageItem.$id}
                packageName={packageItem.name}
                price={discountedPrice}
                minDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 dias a partir de hoje
                maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 ano a partir de hoje
              />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Cancelamento gratuito até 48h antes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      <RelatedPackages packageId={packageItem.$id} tagIds={packageIds} />
    </>
  );
}
