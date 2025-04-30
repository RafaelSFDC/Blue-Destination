import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Award, Users, Globe, Heart, Clock, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[400px] items-center justify-center bg-gray-900 py-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=800&width=1920"
              alt="Sobre Nós"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                Sobre a Blue Destination
              </h1>
              <p className="text-lg md:text-xl">
                Criando experiências de viagem inesquecíveis desde 2010
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container py-16">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Nossa História</h2>
              <div className="space-y-4">
                <p>
                  A Blue Destination nasceu da paixão por viagens e da vontade
                  de proporcionar experiências únicas e memoráveis para nossos
                  clientes. Fundada em 2010 por um grupo de entusiastas de
                  viagens, nossa empresa começou como uma pequena agência em São
                  Paulo e hoje atende clientes em todo o Brasil.
                </p>
                <p>
                  Ao longo dos anos, construímos relacionamentos sólidos com
                  parceiros em todo o mundo, o que nos permite oferecer pacotes
                  exclusivos e personalizados para os mais diversos destinos.
                  Nossa equipe é formada por profissionais apaixonados por
                  viagens, que conhecem de perto os destinos que oferecemos.
                </p>
                <p>
                  Acreditamos que viajar é muito mais do que conhecer novos
                  lugares - é vivenciar novas culturas, criar memórias e
                  transformar vidas. Por isso, nos dedicamos a criar roteiros
                  cuidadosamente planejados, que proporcionam experiências
                  autênticas e enriquecedoras.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Nossa História"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                Missão, Visão e Valores
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Os princípios que guiam nosso trabalho e nosso compromisso com
                nossos clientes
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Missão</h3>
                <p className="text-muted-foreground">
                  Proporcionar experiências de viagem inesquecíveis, conectando
                  pessoas a destinos extraordinários e criando memórias que
                  durarão para sempre.
                </p>
              </div>

              <div className="rounded-lg border bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Visão</h3>
                <p className="text-muted-foreground">
                  Ser reconhecida como a agência de viagens mais confiável e
                  inovadora do Brasil, expandindo horizontes e transformando a
                  forma como as pessoas exploram o mundo.
                </p>
              </div>

              <div className="rounded-lg border bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Valores</h3>
                <p className="text-muted-foreground">
                  Excelência, autenticidade, responsabilidade, inovação e paixão
                  por viagens. Estes são os valores que norteiam todas as nossas
                  ações e decisões.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="container py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Nossa Equipe</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Conheça os profissionais apaixonados por viagens que fazem parte
              da Blue Destination
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: "Ana Silva",
                role: "CEO & Fundadora",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Apaixonada por viagens desde criança, Ana fundou a Blue Destination com o objetivo de compartilhar sua paixão com o mundo.",
              },
              {
                name: "Carlos Oliveira",
                role: "Diretor de Operações",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Com mais de 15 anos de experiência no setor de turismo, Carlos garante que todas as nossas operações funcionem perfeitamente.",
              },
              {
                name: "Mariana Costa",
                role: "Especialista em Destinos Internacionais",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Mariana já visitou mais de 50 países e usa seu conhecimento para criar roteiros exclusivos e autênticos.",
              },
              {
                name: "Roberto Santos",
                role: "Gerente de Atendimento ao Cliente",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Roberto lidera nossa equipe de atendimento, garantindo que cada cliente receba um serviço personalizado e de excelência.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                Por que escolher a Blue Destination?
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Descubra o que nos diferencia e por que somos a escolha ideal
                para sua próxima aventura
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Experiência Comprovada
                  </h3>
                  <p className="text-muted-foreground">
                    Com mais de 10 anos no mercado, temos a experiência
                    necessária para criar viagens perfeitas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Atendimento Personalizado
                  </h3>
                  <p className="text-muted-foreground">
                    Cada cliente é único, e por isso oferecemos um atendimento
                    totalmente personalizado.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Destinos Exclusivos
                  </h3>
                  <p className="text-muted-foreground">
                    Oferecemos destinos cuidadosamente selecionados e roteiros
                    exclusivos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Suporte 24/7</h3>
                  <p className="text-muted-foreground">
                    Nossa equipe está disponível 24 horas por dia, 7 dias por
                    semana para ajudar durante sua viagem.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Segurança e Confiabilidade
                  </h3>
                  <p className="text-muted-foreground">
                    Trabalhamos apenas com parceiros confiáveis para garantir
                    sua segurança e tranquilidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Paixão pelo que Fazemos
                  </h3>
                  <p className="text-muted-foreground">
                    Nossa paixão por viagens se reflete em cada detalhe dos
                    pacotes que oferecemos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Pronto para começar sua próxima aventura?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Entre em contato conosco hoje mesmo e descubra como podemos tornar
              sua próxima viagem inesquecível.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary">
                Ver Pacotes
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white hover:text-primary"
              >
                Fale Conosco
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
