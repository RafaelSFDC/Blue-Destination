import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Map, Calendar, CreditCard, Compass, Plane } from "lucide-react"

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Ferramentas de Viagem</h1>
          <p className="mt-2 text-muted-foreground">
            Ferramentas úteis para ajudar no planejamento da sua próxima viagem
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Calculadora de Orçamento</CardTitle>
              <CardDescription>
                Calcule quanto você vai gastar na sua próxima viagem com base nos seus planos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Inclui estimativas para voos, hospedagem, alimentação, transporte local, atrações e mais.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tools/budget-calculator">Acessar Calculadora</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mapa de Destinos</CardTitle>
              <CardDescription>
                Explore destinos em um mapa interativo e descubra novos lugares para visitar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize todos os nossos destinos em um mapa interativo, com informações detalhadas sobre cada local.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/destinations/map">Explorar Mapa</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Planejador de Itinerário</CardTitle>
              <CardDescription>Crie um itinerário detalhado para sua viagem, dia a dia.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organize suas atividades, reservas e compromissos em um cronograma fácil de seguir.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tools/itinerary-planner">Acessar Planejador</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Simulador de Financiamento</CardTitle>
              <CardDescription>Simule as parcelas e juros para financiar sua viagem.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compare diferentes opções de pagamento e encontre a melhor forma de financiar sua viagem.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tools/financing-simulator">Acessar Simulador</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Recomendador de Destinos</CardTitle>
              <CardDescription>Descubra destinos que combinam com seu perfil e preferências.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Responda algumas perguntas e receba recomendações personalizadas de destinos que você vai adorar.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tools/destination-recommender">Acessar Recomendador</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Checklist de Viagem</CardTitle>
              <CardDescription>Lista completa do que levar em sua viagem.</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tools/travel-checklist">Acessar Checklist</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
