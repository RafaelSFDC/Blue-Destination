import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PackageCard } from "@/components/package-card";
import { formatCurrency } from "@/lib/utils";
import { getDestinationById, getPackagesByDestination } from "@/lib/actions";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const item = await params;
  const destination = await getDestinationById(item.id);

  if (!destination) {
    notFound();
  }

  // Buscar pacotes relacionados a este destino
  const relatedPackages = await getPackagesByDestination(destination.id);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[500px] items-center justify-center bg-gray-900 py-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src={destination.imageUrl || "/placeholder.svg"}
              alt={destination.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {destination.name}
              </h1>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{destination.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={destination.rating} size={20} />
                  <span>({destination.reviewCount} avaliações)</span>
                </div>
              </div>
              <p className="mb-8 text-lg md:text-xl">
                A partir de {formatCurrency(destination.price)} por pessoa
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {destination.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 space-y-6">
              <h2 className="text-3xl font-bold">Sobre {destination.name}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {destination.description}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor. Suspendisse dictum feugiat
                nisl ut dapibus.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="mb-6 text-3xl font-bold">Destaques</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Atrações Imperdíveis
                  </h3>
                  <p className="text-muted-foreground">
                    Descubra as atrações mais famosas e imperdíveis deste
                    destino incrível.
                  </p>
                </div>

                <div className="rounded-lg border p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Experiências Únicas
                  </h3>
                  <p className="text-muted-foreground">
                    Viva experiências únicas e memoráveis que só este destino
                    pode oferecer.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="mb-6 text-3xl font-bold">Galeria</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={`/placeholder.svg?height=400&width=400&text=Imagem+${i}`}
                      alt={`Galeria ${destination.name} ${i}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Packages */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Pacotes para {destination.name}
              </h2>
              <Button variant="outline" asChild>
                <Link href={`/search?destination=${destination.id}`}>
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {relatedPackages.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  Não há pacotes disponíveis para este destino no momento.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Pronto para conhecer {destination.name}?
              </h2>
              <p className="mb-8 text-lg">
                Reserve agora e garanta as melhores condições para sua viagem
                dos sonhos.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/search?destination=${destination.id}`}>
                  Encontrar Pacotes
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
