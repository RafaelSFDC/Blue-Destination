"use client";

import { useState, useEffect } from "react";
import type { Package } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils";
import { getPackages } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function ComparePage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "basic",
    "inclusions",
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const allPackages = await getPackages();
        setPackages(allPackages);

        // Pré-selecionar os dois primeiros pacotes para comparação
        if (allPackages.length >= 2) {
          setSelectedPackages([allPackages[0].id, allPackages[1].id]);
        } else if (allPackages.length === 1) {
          setSelectedPackages([allPackages[0].id]);
        }
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddPackage = () => {
    if (selectedPackages.length >= 3) {
      toast({
        title: "Limite atingido",
        description: "Você pode comparar no máximo 3 pacotes simultaneamente.",
        variant: "destructive",
      });
      return;
    }

    const availablePackages = packages.filter(
      (pkg) => !selectedPackages.includes(pkg.id)
    );
    if (availablePackages.length > 0) {
      setSelectedPackages([...selectedPackages, availablePackages[0].id]);
    }
  };

  const handleRemovePackage = (packageId: string | undefined) => {
    if (!packageId) return;
    setSelectedPackages((prev) => prev.filter((id) => id !== packageId));
  };

  const handleChangePackage = (index: number, newPackageId: string) => {
    const newSelectedPackages = [...selectedPackages];
    newSelectedPackages[index] = newPackageId;
    setSelectedPackages(newSelectedPackages);
  };

  const getSelectedPackagesData = () => {
    return selectedPackages.map((id) => packages.find((pkg) => pkg.id === id));
  };

  const selectedPackagesData = getSelectedPackagesData();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="container flex-1 py-12">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-lg font-medium">
                Carregando pacotes para comparação...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/packages">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Comparar Pacotes</h1>
          </div>

          <Button
            onClick={handleAddPackage}
            disabled={
              selectedPackages.length >= 3 ||
              packages.length <= selectedPackages.length
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pacote
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-4">
          {/* Coluna de categorias */}
          <div className="space-y-4">
            <div className="h-[300px]"></div>{" "}
            {/* Espaço para alinhar com os cards */}
            {/* Informações básicas */}
            <div className="rounded-lg border p-4">
              <button
                className="flex w-full items-center justify-between font-medium"
                onClick={() => toggleSection("basic")}
              >
                <span>Informações Básicas</span>
                {expandedSections.includes("basic") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.includes("basic") && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Preço
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duração
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Destinos
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avaliação
                  </p>
                </div>
              )}
            </div>
            {/* Inclusões */}
            <div className="rounded-lg border p-4">
              <button
                className="flex w-full items-center justify-between font-medium"
                onClick={() => toggleSection("inclusions")}
              >
                <span>O que está incluído</span>
                {expandedSections.includes("inclusions") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.includes("inclusions") && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Passagens aéreas
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Hospedagem
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Café da manhã
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Traslados
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Passeios guiados
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Seguro viagem
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assistência 24h
                  </p>
                </div>
              )}
            </div>
            {/* Itinerário */}
            <div className="rounded-lg border p-4">
              <button
                className="flex w-full items-center justify-between font-medium"
                onClick={() => toggleSection("itinerary")}
              >
                <span>Itinerário</span>
                {expandedSections.includes("itinerary") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.includes("itinerary") && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Dias de viagem
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Principais atrações
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tempo livre
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Atividades opcionais
                  </p>
                </div>
              )}
            </div>
            {/* Política de cancelamento */}
            <div className="rounded-lg border p-4">
              <button
                className="flex w-full items-center justify-between font-medium"
                onClick={() => toggleSection("cancellation")}
              >
                <span>Política de Cancelamento</span>
                {expandedSections.includes("cancellation") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.includes("cancellation") && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Cancelamento gratuito
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Reembolso parcial
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sem reembolso
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Colunas de pacotes */}
          {selectedPackagesData.map((packageData, index) => (
            <div key={packageData?.id || index} className="space-y-4">
              <Card className="relative overflow-hidden">
                <div className="absolute right-2 top-2 z-10">
                  {selectedPackages.length > 1 && packageData?.id && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleRemovePackage(packageData.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="relative h-[200px] w-full">
                  {packageData ? (
                    <Image
                      src={packageData.imageUrl || "/placeholder.svg"}
                      alt={packageData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <p className="text-muted-foreground">
                        Selecione um pacote
                      </p>
                    </div>
                  )}

                  {packageData?.featured && (
                    <div className="absolute left-0 top-0 bg-primary px-2 py-1 text-xs font-medium text-white">
                      Destaque
                    </div>
                  )}

                  {packageData?.discount && (
                    <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      {packageData.discount}% OFF
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-4">
                    <Select
                      value={packageData?.id || ""}
                      onValueChange={(value) =>
                        handleChangePackage(index, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um pacote" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem
                            key={pkg.id}
                            value={pkg.id}
                            disabled={
                              selectedPackages.includes(pkg.id) &&
                              pkg.id !== packageData?.id
                            }
                          >
                            {pkg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {packageData && (
                    <>
                      <h3 className="mb-2 text-lg font-bold">
                        {packageData.name}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                        {packageData.description}
                      </p>

                      {packageData.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(
                              calculateDiscountedPrice(
                                packageData.price,
                                packageData.discount
                              )
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(packageData.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(packageData.price)}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground">
                        por pessoa
                      </p>
                    </>
                  )}
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  {packageData && (
                    <Button className="w-full" asChild>
                      <Link href={`/packages/${packageData.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Informações básicas */}
              {expandedSections.includes("basic") && packageData && (
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Preço</p>
                    {packageData.discount ? (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-primary">
                          {formatCurrency(
                            calculateDiscountedPrice(
                              packageData.price,
                              packageData.discount
                            )
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(packageData.price)}
                        </span>
                      </div>
                    ) : (
                      <p className="font-medium">
                        {formatCurrency(packageData.price)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Duração</p>
                    <p>{packageData.duration} dias</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Destinos</p>
                    <p>{packageData.destinations.length} destinos</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Avaliação</p>
                    <div className="flex items-center gap-1">
                      <StarRating rating={4.5} size={16} />
                      <span className="text-sm text-muted-foreground">
                        (87 avaliações)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusões */}
              {expandedSections.includes("inclusions") && packageData && (
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Passagens aéreas</p>
                    {packageData.inclusions.includes("Passagens aéreas") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Hospedagem</p>
                    {packageData.inclusions.some((inc: string) =>
                      inc.includes("Hospedagem")
                    ) ? (
                      <div className="flex items-center gap-1">
                        <Check className="h-5 w-5 text-green-500" />
                        <Badge variant="outline">
                          {packageData.inclusions
                            .find((inc: string) => inc.includes("Hospedagem"))
                            ?.replace("Hospedagem ", "")}
                        </Badge>
                      </div>
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Café da manhã</p>
                    {packageData.inclusions.includes("Café da manhã") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Traslados</p>
                    {packageData.inclusions.includes("Traslados") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Passeios guiados</p>
                    {packageData.inclusions.includes("Passeios guiados") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Seguro viagem</p>
                    {packageData.inclusions.includes("Seguro viagem") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Assistência 24h</p>
                    {packageData.inclusions.includes("Assistência 24h") ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              )}

              {/* Itinerário */}
              {expandedSections.includes("itinerary") && packageData && (
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Dias de viagem</p>
                    <p>{packageData.duration} dias</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Principais atrações</p>
                    <p className="text-sm">
                      {packageData.itinerary
                        .slice(0, 3)
                        .map((day) => day.title)
                        .join(", ")}
                      ...
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Tempo livre</p>
                    <p className="text-sm">
                      {packageData.itinerary.some((day) =>
                        day.title.toLowerCase().includes("livre")
                      ) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Atividades opcionais</p>
                    <p className="text-sm">
                      {packageData.itinerary.some((day) =>
                        day.description.toLowerCase().includes("opcional")
                      ) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Política de cancelamento */}
              {expandedSections.includes("cancellation") && packageData && (
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Cancelamento gratuito</p>
                    <p className="text-sm">Até 30 dias antes</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Reembolso parcial</p>
                    <p className="text-sm">Entre 30 e 7 dias antes</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Sem reembolso</p>
                    <p className="text-sm">Menos de 7 dias antes</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Coluna para adicionar pacote */}
          {selectedPackages.length < 3 &&
            selectedPackages.length < packages.length && (
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  className="h-[300px] w-full border-dashed"
                  onClick={handleAddPackage}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-8 w-8" />
                    <span>Adicionar Pacote</span>
                  </div>
                </Button>
              </div>
            )}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/20 p-6">
          <h2 className="mb-4 text-xl font-bold">
            Precisa de ajuda para decidir?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Nossa equipe de especialistas está pronta para ajudar você a
            escolher o pacote perfeito para suas necessidades. Entre em contato
            conosco para obter assistência personalizada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/contact">Fale Conosco</Link>
            </Button>
            <Button variant="outline">Chat Online</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
