"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils";
import { Clock, MapPin } from "lucide-react";
import { usePackages } from "@/querys/usePackages";
import { useDestinations } from "@/querys/useDestinations";
import { Package } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

// Componente de esqueleto para carregamento
function PromotionsSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="relative flex min-h-[400px] items-center justify-center bg-gray-900 py-12">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <Skeleton className="mx-auto mb-4 h-12 w-3/4" />
              <Skeleton className="mx-auto h-6 w-2/3" />
            </div>
          </div>
        </section>

        {/* Featured Promotions Skeleton */}
        <section className="container py-16">
          <Skeleton className="mb-8 h-10 w-64" />
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border shadow-sm">
                <div className="grid md:grid-cols-2">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="mb-2 h-8 w-3/4" />
                    <Skeleton className="mb-4 h-20 w-full" />
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-40 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discounted Packages Skeleton */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <Skeleton className="mb-8 h-10 w-64" />
            <Skeleton className="mb-8 h-12 w-full" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function PromotionsPage() {
  const { data: allPackages, isLoading: isLoadingPackages } = usePackages();
  const { data: allDestinations, isLoading: isLoadingDestinations } =
    useDestinations();

  // Se estiver carregando, mostrar esqueleto
  if (isLoadingPackages || isLoadingDestinations) {
    return <PromotionsSkeleton />;
  }

  // Filtrar pacotes com desconto
  const packagesWithDiscount =
    allPackages?.filter((pkg) => pkg.discounts && pkg.discounts.length > 0) ||
    [];

  // Agrupar pacotes por tipo de desconto
  const packagesByDiscountType = packagesWithDiscount.reduce(
    (acc, pkg) => {
      if (pkg.discounts && pkg.discounts.length > 0) {
        const discount = pkg.discounts[0];
        if (discount.type === "percentage") {
          acc.percentage.push(pkg);
        } else {
          acc.fixed.push(pkg);
        }
      }
      return acc;
    },
    { percentage: [] as Package[], fixed: [] as Package[] }
  );

  // Agrupar por porcentagem de desconto (para os descontos percentuais)
  const groupedByPercentage = packagesByDiscountType.percentage.reduce(
    (acc, pkg) => {
      if (pkg.discounts && pkg.discounts.length > 0) {
        const discountValue = pkg.discounts[0].value;
        if (!acc[discountValue]) {
          acc[discountValue] = [];
        }
        acc[discountValue].push(pkg);
      }
      return acc;
    },
    {} as Record<number, Package[]>
  );

  // Ordenar por desconto (maior para menor)
  const discountGroups = Object.entries(groupedByPercentage)
    .map(([discount, packages]) => ({
      discount: Number(discount),
      packages,
    }))
    .sort((a, b) => b.discount - a.discount);

  // Filtrar destinos em promoção
  const promotionalDestinations =
    allDestinations
      ?.filter((dest) => {
        return packagesWithDiscount.some(
          (pkg) =>
            pkg.destinations && pkg.destinations.some((d) => d.$id === dest.$id)
        );
      })
      .slice(0, 4) || [];

  // Função auxiliar para calcular o preço com desconto
  const getDiscountedPrice = (pkg: Package) => {
    if (!pkg.discounts || pkg.discounts.length === 0) return pkg.price;

    const discount = pkg.discounts[0];
    if (discount.type === "percentage") {
      return calculateDiscountedPrice(pkg.price, discount.value);
    } else {
      return pkg.price - discount.value;
    }
  };

  // Criar promoções fictícias
  const promotions = [
    {
      id: "promo-1",
      title: "Férias de Verão",
      description:
        "Aproveite o verão com descontos especiais em pacotes para destinos paradisíacos.",
      imageUrl: "/placeholder.svg?height=400&width=800&text=Férias+de+Verão",
      discount: "Até 30% OFF",
      validUntil: "31/01/2024",
      packages: packagesWithDiscount
        .filter(
          (pkg) =>
            pkg.destinations &&
            pkg.destinations.some((d) =>
              ["dest-001", "dest-007"].includes(d.$id)
            )
        )
        .slice(0, 3),
    },
    {
      id: "promo-2",
      title: "Destinos Exóticos",
      description:
        "Conheça lugares incríveis com preços imperdíveis. Pacotes exclusivos com tudo incluso.",
      imageUrl: "/placeholder.svg?height=400&width=800&text=Destinos+Exóticos",
      discount: "Até 20% OFF",
      validUntil: "28/02/2024",
      packages: packagesWithDiscount
        .filter(
          (pkg) =>
            pkg.destinations &&
            pkg.destinations.some((d) =>
              ["dest-002", "dest-005"].includes(d.$id)
            )
        )
        .slice(0, 3),
    },
    {
      id: "promo-3",
      title: "Viagens Românticas",
      description:
        "Pacotes especiais para casais. Momentos inesquecíveis em destinos românticos.",
      imageUrl: "/placeholder.svg?height=400&width=800&text=Viagens+Românticas",
      discount: "Até 15% OFF",
      validUntil: "14/02/2024",
      packages: packagesWithDiscount
        .filter(
          (pkg) =>
            pkg.destinations &&
            pkg.destinations.some((d) =>
              ["dest-003", "dest-006"].includes(d.$id)
            )
        )
        .slice(0, 3),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[400px] items-center justify-center bg-gray-900 py-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=800&width=1920&text=Promoções"
              alt="Promoções"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                Promoções e Ofertas Especiais
              </h1>
              <p className="text-lg md:text-xl">
                Aproveite nossas ofertas exclusivas e economize em sua próxima
                aventura.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Promotions */}
        <section className="container py-16">
          <h2 className="mb-8 text-3xl font-bold">Promoções em Destaque</h2>

          <div className="space-y-12">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="rounded-lg border shadow-sm">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={promotion.imageUrl || "/placeholder.svg"}
                      alt={promotion.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                      {promotion.discount}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-2xl font-bold">
                      {promotion.title}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      {promotion.description}
                    </p>

                    <div className="mb-6 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        Oferta por tempo limitado
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Válido até {promotion.validUntil}
                      </span>
                    </div>

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {promotion.packages.map((pkg) => (
                        <Card key={pkg.$id} className="overflow-hidden">
                          <div className="relative h-32">
                            <Image
                              src={pkg.imageUrl || "/placeholder.svg"}
                              alt={pkg.name}
                              fill
                              className="object-cover"
                            />
                            {pkg.discounts && pkg.discounts.length > 0 && (
                              <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                {pkg.discounts[0].type === "percentage"
                                  ? `${pkg.discounts[0].value}% OFF`
                                  : `${formatCurrency(
                                      pkg.discounts[0].value
                                    )} OFF`}
                              </div>
                            )}
                          </div>

                          <CardContent className="p-3">
                            <h4 className="mb-1 font-medium line-clamp-1">
                              {pkg.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-primary">
                                {formatCurrency(getDiscountedPrice(pkg))}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(pkg.price)}
                              </span>
                            </div>
                          </CardContent>

                          <CardFooter className="p-3 pt-0">
                            <Button size="sm" className="w-full" asChild>
                              <Link href={`/packages/${pkg.$id}`}>
                                Ver Detalhes
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    <Button asChild>
                      <Link href={`/promotions/${promotion.id}`}>
                        Ver Todos os Pacotes
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Destinos em Promoção */}
        <section className="container py-16">
          <h2 className="mb-8 text-3xl font-bold">Destinos em Promoção</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {promotionalDestinations.map((destination) => (
              <Card key={destination.$id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={destination.imageUrl || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    Promoção
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-bold">{destination.name}</h3>
                  <div className="mb-3 flex items-center text-sm text-muted-foreground">
                    <MapPin size={16} className="mr-1" />
                    <span>{destination.location}</span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {destination.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(destination.price)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" asChild>
                    <Link href={`/destinations/${destination.$id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* All Discounted Packages */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="mb-8 text-3xl font-bold">
              Todos os Pacotes com Desconto
            </h2>

            <Tabs defaultValue="all">
              <TabsList className="mb-8">
                <TabsTrigger value="all">Todos os Descontos</TabsTrigger>
                {discountGroups.map((group) => (
                  <TabsTrigger
                    key={group.discount}
                    value={`discount-${group.discount}`}
                  >
                    {group.discount}% OFF
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {packagesWithDiscount.map((pkg) => (
                    <Card key={pkg.$id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={pkg.imageUrl || "/placeholder.svg"}
                          alt={pkg.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
                          {pkg.discounts &&
                            pkg.discounts.length > 0 &&
                            (pkg.discounts[0].type === "percentage"
                              ? `${pkg.discounts[0].value}% OFF`
                              : `${formatCurrency(
                                  pkg.discounts[0].value
                                )} OFF`)}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>

                        <div className="mb-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            <span>{pkg.duration} dias</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            <span>
                              {pkg.destinations?.length || 0} destinos
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(getDiscountedPrice(pkg))}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(pkg.price)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          por pessoa
                        </p>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" asChild>
                          <Link href={`/packages/${pkg.$id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {discountGroups.map((group) => (
                <TabsContent
                  key={group.discount}
                  value={`discount-${group.discount}`}
                >
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.packages.map((pkg) => (
                      <Card key={pkg.$id} className="overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={pkg.imageUrl || "/placeholder.svg"}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
                            {pkg.discounts &&
                              pkg.discounts.length > 0 &&
                              (pkg.discounts[0].type === "percentage"
                                ? `${pkg.discounts[0].value}% OFF`
                                : `${formatCurrency(
                                    pkg.discounts[0].value
                                  )} OFF`)}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="mb-2 text-lg font-bold">{pkg.name}</h3>

                          <div className="mb-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span>{pkg.duration} dias</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1" />
                              <span>
                                {pkg.destinations?.length || 0} destinos
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(getDiscountedPrice(pkg))}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(pkg.price)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            por pessoa
                          </p>
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full" asChild>
                            <Link href={`/packages/${pkg.$id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Newsletter */}
        <section className="container py-16">
          <div className="rounded-lg bg-primary p-8 text-center text-white">
            <h2 className="mb-4 text-2xl font-bold">
              Receba Ofertas Exclusivas
            </h2>
            <p className="mx-auto mb-6 max-w-2xl">
              Inscreva-se em nossa newsletter e seja o primeiro a receber nossas
              promoções exclusivas, ofertas relâmpago e dicas de viagem.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                required
              />
              <Button variant="secondary">Inscrever-se</Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-16">
          <h2 className="mb-8 text-3xl font-bold">Perguntas Frequentes</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "Como funcionam os descontos?",
                answer:
                  "Nossos descontos são aplicados diretamente no preço final do pacote. O valor com desconto já inclui todas as taxas e impostos.",
              },
              {
                question: "Por quanto tempo as promoções são válidas?",
                answer:
                  "Cada promoção tem sua própria data de validade, que está claramente indicada na descrição da oferta. Algumas promoções podem ser encerradas antes do prazo, dependendo da disponibilidade.",
              },
              {
                question: "Posso combinar diferentes promoções?",
                answer:
                  "Não, as promoções não são cumulativas. Apenas um desconto pode ser aplicado por reserva.",
              },
              {
                question: "As promoções incluem passagens aéreas?",
                answer:
                  "Sim, a maioria de nossas promoções inclui passagens aéreas, hospedagem e outros serviços conforme detalhado na descrição do pacote.",
              },
              {
                question: "Como saber quando surgem novas promoções?",
                answer:
                  "A melhor maneira de ficar por dentro das nossas promoções é se inscrever em nossa newsletter. Assim, você receberá todas as ofertas diretamente em seu e-mail.",
              },
              {
                question:
                  "Qual é a política de cancelamento para pacotes promocionais?",
                answer:
                  "A política de cancelamento para pacotes promocionais segue as mesmas regras dos pacotes regulares, com reembolso total até 30 dias antes da viagem. Consulte os termos específicos de cada pacote para mais detalhes.",
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border p-6">
                <h3 className="mb-2 text-lg font-medium">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
