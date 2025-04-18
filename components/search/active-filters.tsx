"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Destination } from "@/lib/mock-data"

interface ActiveFiltersProps {
  priceRange?: [number, number] | null
  durationRange?: [number, number] | null
  ratings?: number[] | null
  tags?: string[] | null
  destination?: Destination | null
  onClearFilter: (filterType: string, value?: any) => void
  onClearAll: () => void
}

export function ActiveFilters({
  priceRange,
  durationRange,
  ratings,
  tags,
  destination,
  onClearFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    (priceRange && (priceRange[0] > 0 || priceRange[1] < 10000)) ||
    (durationRange && (durationRange[0] > 1 || durationRange[1] < 30)) ||
    (ratings && ratings.length > 0) ||
    (tags && tags.length > 0) ||
    destination

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Filtros ativos:</span>

        <div className="flex flex-wrap gap-2">
          {priceRange && (priceRange[0] > 0 || priceRange[1] < 10000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Preço: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onClearFilter("priceRange")} />
            </Badge>
          )}

          {durationRange && (durationRange[0] > 1 || durationRange[1] < 30) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Duração: {durationRange[0]} - {durationRange[1]} dias
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onClearFilter("durationRange")} />
            </Badge>
          )}

          {ratings && ratings.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {ratings.length === 1 ? `${ratings[0]} estrelas & acima` : `${ratings.length} avaliações selecionadas`}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onClearFilter("ratings")} />
            </Badge>
          )}

          {destination && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Destino: {destination.name}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onClearFilter("destination")} />
            </Badge>
          )}

          {tags &&
            tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 capitalize">
                {tag}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onClearFilter("tag", tag)} />
              </Badge>
            ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs font-normal text-muted-foreground"
          onClick={onClearAll}
        >
          Limpar todos
        </Button>
      </div>
    </div>
  )
}
