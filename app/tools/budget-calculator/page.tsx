"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft, Calculator, Plane, Hotel, Utensils, Bus, Ticket, ShoppingBag, CreditCard, Download, Share2,
} from "lucide-react"

type DestinationType = "nacional" | "internacional"
type FlightClassType = "economy" | "premium" | "business" | "first"
type HotelCategoryType = "1" | "2" | "3" | "4" | "5"
type MealBudgetType = "low" | "medium" | "high"

export default function BudgetCalculatorPage() {
  const { toast } = useToast()
  
  const [destination, setDestination] = useState<DestinationType>("internacional")
  const [travelers, setTravelers] = useState(2)
  const [duration, setDuration] = useState(7)
  const [flightClass, setFlightClass] = useState<FlightClassType>("economy")
  const [hotelCategory, setHotelCategory] = useState<HotelCategoryType>("3")
  const [mealBudget, setMealBudget] = useState<MealBudgetType>("medium")
  const [includeTransportation, setIncludeTransportation] = useState(true)
  const [includeAttractions, setIncludeAttractions] = useState(true)
  const [includeShopping, setIncludeShopping] = useState(true)
  const [includeInsurance, setIncludeInsurance] = useState(true)

  // Handler functions for Select components
  const handleDestinationChange = (value: string) => {
    setDestination(value as DestinationType)
  }

  const handleFlightClassChange = (value: string) => {
    setFlightClass(value as FlightClassType)
  }

  const handleHotelCategoryChange = (value: string) => {
    setHotelCategory(value as HotelCategoryType)
  }

  const handleMealBudgetChange = (value: string) => {
    setMealBudget(value as MealBudgetType)
  }

  // Valores base para cálculos
  const baseFlightCosts = {
    nacional: {
      economy: 500,
      premium: 900,
      business: 1500,
      first: 3000,
    },
    internacional: {
      economy: 2500,
      premium: 4000,
      business: 8000,
      first: 15000,
    },
  } as const

  const baseHotelCosts = {
    nacional: {
      "1": 100,
      "2": 200,
      "3": 350,
      "4": 600,
      "5": 1200,
    },
    internacional: {
      "1": 150,
      "2": 300,
      "3": 500,
      "4": 900,
      "5": 1800,
    },
  } as const

  const baseMealCosts = {
    nacional: {
      low: 50,
      medium: 100,
      high: 200,
    },
    internacional: {
      low: 80,
      medium: 150,
      high: 300,
    },
  } as const

  const baseTransportationCosts = {
    nacional: 30,
    internacional: 50,
  } as const

  const baseAttractionsCosts = {
    nacional: 50,
    internacional: 80,
  } as const

  const baseShoppingCosts = {
    nacional: 100,
    internacional: 200,
  } as const

  const baseInsuranceCosts = {
    nacional: 10,
    internacional: 30,
  } as const

  // Cálculo do orçamento
  const calculateBudget = () => {
    // Custo de voos
    const flightCost = baseFlightCosts[destination][flightClass] * travelers

    // Custo de hospedagem
    const hotelCost = baseHotelCosts[destination][hotelCategory] * duration * Math.ceil(travelers / 2)

    // Custo de alimentação
    const mealCost = baseMealCosts[destination][mealBudget] * duration * travelers

    // Custo de transporte local
    const transportationCost = includeTransportation ? baseTransportationCosts[destination] * duration * travelers : 0

    // Custo de atrações
    const attractionsCost = includeAttractions ? baseAttractionsCosts[destination] * duration * travelers : 0

    // Custo de compras
    const shoppingCost = includeShopping ? baseShoppingCosts[destination] * travelers : 0

    // Custo de seguro viagem
    const insuranceCost = includeInsurance ? baseInsuranceCosts[destination] * duration * travelers : 0

    // Custo total
    const totalCost =
      flightCost + hotelCost + mealCost + transportationCost + attractionsCost + shoppingCost + insuranceCost

    return {
      flightCost,
      hotelCost,
      mealCost,
      transportationCost,
      attractionsCost,
      shoppingCost,
      insuranceCost,
      totalCost,
    }
  }

  const budget = calculateBudget()

  const handleExport = () => {
    toast({
      title: "Orçamento exportado",
      description: "O orçamento foi exportado com sucesso para o seu dispositivo.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Link copiado",
      description: "O link para este orçamento foi copiado para a área de transferência.",
    })
  }

  const handleSimulateFinancing = () => {
    toast({
      title: "Simulação iniciada",
      description: "Redirecionando para a página de simulação de financiamento.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-12">
        <div className="mb-8 flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tools">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Calculadora de Orçamento de Viagem</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Viagem</CardTitle>
                <CardDescription>
                  Preencha os detalhes da sua viagem para calcular um orçamento estimado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Tipo de Destino</Label>
                    <Select value={destination} onValueChange={handleDestinationChange}>
                      <SelectTrigger id="destination">
                        <SelectValue placeholder="Selecione o tipo de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacional">Nacional</SelectItem>
                        <SelectItem value="internacional">Internacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelers">Número de Viajantes</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        type="button"
                      >
                        -
                      </Button>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        value={travelers}
                        onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
                        className="text-center"
                      />
                      <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)} type="button">
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duração da Viagem: {duration} dias</Label>
                  <Slider
                    min={1}
                    max={30}
                    step={1}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Transporte</h3>

                  <div className="space-y-2">
                    <Label htmlFor="flightClass">Classe do Voo</Label>
                    <Select value={flightClass} onValueChange={handleFlightClassChange}>
                      <SelectTrigger id="flightClass">
                        <SelectValue placeholder="Selecione a classe do voo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Econômica</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Executiva</SelectItem>
                        <SelectItem value="first">Primeira Classe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="transportation" className="cursor-pointer">
                      Incluir transporte local (táxi, ônibus, metrô)
                    </Label>
                    <Switch
                      id="transportation"
                      checked={includeTransportation}
                      onCheckedChange={setIncludeTransportation}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Hospedagem e Alimentação</h3>

                  <div className="space-y-2">
                    <Label htmlFor="hotelCategory">Categoria do Hotel</Label>
                    <Select value={hotelCategory} onValueChange={handleHotelCategoryChange}>
                      <SelectTrigger id="hotelCategory">
                        <SelectValue placeholder="Selecione a categoria do hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Estrela / Hostel</SelectItem>
                        <SelectItem value="2">2 Estrelas</SelectItem>
                        <SelectItem value="3">3 Estrelas</SelectItem>
                        <SelectItem value="4">4 Estrelas</SelectItem>
                        <SelectItem value="5">5 Estrelas / Luxo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealBudget">Orçamento para Alimentação</Label>
                    <Select value={mealBudget} onValueChange={handleMealBudgetChange}>
                      <SelectTrigger id="mealBudget">
                        <SelectValue placeholder="Selecione o orçamento para alimentação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Econômico (Fast food, mercados)</SelectItem>
                        <SelectItem value="medium">Moderado (Restaurantes casuais)</SelectItem>
                        <SelectItem value="high">Alto (Restaurantes refinados)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Extras</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="attractions" className="cursor-pointer">
                      Incluir atrações e passeios
                    </Label>
                    <Switch id="attractions" checked={includeAttractions} onCheckedChange={setIncludeAttractions} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="shopping" className="cursor-pointer">
                      Incluir compras e souvenirs
                    </Label>
                    <Switch id="shopping" checked={includeShopping} onCheckedChange={setIncludeShopping} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="insurance" className="cursor-pointer">
                      Incluir seguro viagem
                    </Label>
                    <Switch id="insurance" checked={includeInsurance} onCheckedChange={setIncludeInsurance} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Orçamento Estimado</CardTitle>
                <CardDescription>
                  Baseado nos detalhes fornecidos para {travelers} {travelers === 1 ? "pessoa" : "pessoas"} por{" "}
                  {duration} {duration === 1 ? "dia" : "dias"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Estimado</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(budget.totalCost)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(budget.totalCost / travelers)} por pessoa
                  </p>
                </div>

                <Tabs defaultValue="breakdown">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="breakdown">Detalhamento</TabsTrigger>
                    <TabsTrigger value="chart">Gráfico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="breakdown" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-muted-foreground" />
                        <span>Voos</span>
                      </div>
                      <span className="font-medium">{formatCurrency(budget.flightCost)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-muted-foreground" />
                        <span>Hospedagem</span>
                      </div>
                      <span className="font-medium">{formatCurrency(budget.hotelCost)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span>Alimentação</span>
                      </div>
                      <span className="font-medium">{formatCurrency(budget.mealCost)}</span>
                    </div>

                    {includeTransportation && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4 text-muted-foreground" />
                          <span>Transporte Local</span>
                        </div>
                        <span className="font-medium">{formatCurrency(budget.transportationCost)}</span>
                      </div>
                    )}

                    {includeAttractions && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          <span>Atrações</span>
                        </div>
                        <span className="font-medium">{formatCurrency(budget.attractionsCost)}</span>
                      </div>
                    )}

                    {includeShopping && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span>Compras</span>
                        </div>
                        <span className="font-medium">{formatCurrency(budget.shoppingCost)}</span>
                      </div>
                    )}

                    {includeInsurance && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>Seguro Viagem</span>
                        </div>
                        <span className="font-medium">{formatCurrency(budget.insuranceCost)}</span>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="chart" className="pt-4">
                    <div className="h-[200px] rounded-lg border p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Gráfico de distribuição de gastos</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleSimulateFinancing}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Simular Financiamento
                </Button>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mt-12 rounded-lg border bg-muted/20 p-6">
          <h2 className="mb-4 text-xl font-bold">Dicas para Economizar</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Reserve com Antecedência</h3>
              <p className="text-sm text-muted-foreground">
                Passagens aéreas e hospedagens costumam ser mais baratas quando reservadas com antecedência.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Viaje na Baixa Temporada</h3>
              <p className="text-sm text-muted-foreground">
                Os preços são significativamente mais baixos fora dos períodos de alta temporada.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Use Transporte Público</h3>
              <p className="text-sm text-muted-foreground">
                Transporte público é geralmente mais barato que táxis ou carros alugados.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Cozinhe Algumas Refeições</h3>
              <p className="text-sm text-muted-foreground">
                Considere hospedagens com cozinha e prepare algumas refeições para economizar.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Pesquise Passes Turísticos</h3>
              <p className="text-sm text-muted-foreground">
                Muitas cidades oferecem passes que incluem várias atrações por um preço fixo.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Compare Preços</h3>
              <p className="text-sm text-muted-foreground">
                Use sites de comparação para encontrar as melhores ofertas em voos e hotéis.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}


