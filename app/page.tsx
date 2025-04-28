import Image from "next/image";
import Link from "next/link";
import { Compass, Map, Award, Clock, CreditCard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/search-form";
import { DestinationCard } from "@/components/destination-card";
import { PackageCard } from "@/components/package-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getFeaturedDestinations } from "@/lib/actions";
import { getRecentTestimonials } from "@/actions/tertimonials";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import { getFeaturedPackages } from "@/actions/packages";
import { Package } from "@/lib/types";

export default async function Home() {
  const featuredDestinations = await getFeaturedDestinations();
  const featuredPackages = await getFeaturedPackages();
  const testimonials = await getRecentTestimonials();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center bg-gray-900 py-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Hero Background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Descubra o Mundo com a Blue Destination
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Viagens personalizadas para destinos incríveis. Crie memórias que
              durarão para sempre.
            </p>
            <div className="mx-auto max-w-4xl">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Por que escolher a Blue Destination?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Oferecemos experiências de viagem únicas e personalizadas para
              tornar sua jornada inesquecível.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Destinos Exclusivos
              </h3>
              <p className="text-muted-foreground">
                Oferecemos destinos cuidadosamente selecionados para
                proporcionar experiências únicas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Roteiros Personalizados
              </h3>
              <p className="text-muted-foreground">
                Cada viagem é planejada de acordo com seus interesses e
                preferências.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Qualidade Garantida
              </h3>
              <p className="text-muted-foreground">
                Trabalhamos apenas com os melhores parceiros para garantir sua
                satisfação.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Suporte 24/7</h3>
              <p className="text-muted-foreground">
                Nossa equipe está disponível a qualquer momento para ajudar
                durante sua viagem.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Pagamento Flexível</h3>
              <p className="text-muted-foreground">
                Oferecemos diversas opções de pagamento e parcelamento para sua
                conveniência.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Experiências Memoráveis
              </h3>
              <p className="text-muted-foreground">
                Criamos momentos especiais que ficarão para sempre em sua
                memória.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Destinos em Destaque
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explore nossos destinos mais populares e comece a planejar sua
              próxima aventura.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.$id} destination={destination} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/destinations">Ver Todos os Destinos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Pacotes Recomendados
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Pacotes completos com tudo que você precisa para uma viagem
              perfeita.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg : Package) => (
              <PackageCard key={pkg.$id} package={pkg} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/packages">Ver Todos os Pacotes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              O que nossos clientes dizem
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Veja as experiências de quem já viajou conosco.
            </p>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="CTA Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Pronto para sua próxima aventura?
            </h2>
            <p className="mb-8 text-lg">
              Comece a planejar sua viagem dos sonhos hoje mesmo. Nossa equipe
              está pronta para ajudar a criar a experiência perfeita para você.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="/packages">Explorar Pacotes</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link href="/contact">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-lg bg-gray-100 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">
              Inscreva-se em nossa newsletter
            </h2>
            <p className="mb-6 text-muted-foreground">
              Receba ofertas exclusivas e dicas de viagem diretamente em seu
              e-mail.
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button type="submit">Inscrever-se</Button>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
