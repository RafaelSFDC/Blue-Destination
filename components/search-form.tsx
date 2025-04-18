"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"

export function SearchForm() {
  const router = useRouter()
  const snap = useSnapshot(state)
  const [destination, setDestination] = useState(snap.searchFilters.destination || "")
  const [travelers, setTravelers] = useState(snap.searchFilters.travelers || 1)
  const [checkIn, setCheckIn] = useState<Date | undefined>(snap.searchFilters.dates.start || undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(snap.searchFilters.dates.end || undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Atualizar o estado global
    actions.updateSearchFilters({
      destination,
      travelers,
      dates: {
        start: checkIn || null,
        end: checkOut || null,
      },
    })

    // Construir a URL de pesquisa
    const params = new URLSearchParams()
    if (destination) params.set("q", destination)
    if (travelers > 1) params.set("travelers", travelers.toString())

    // Navegar para a página de pesquisa
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-4 shadow-lg md:p-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="destination" className="font-medium">
            Destino
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="destination"
              placeholder="Para onde você quer ir?"
              className="pl-9"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-in" className="font-medium">
            Check-in
          </Label>
          <DatePicker date={checkIn} setDate={setCheckIn} placeholder="Data de ida" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-out" className="font-medium">
            Check-out
          </Label>
          <DatePicker date={checkOut} setDate={setCheckOut} placeholder="Data de volta" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers" className="font-medium">
            Viajantes
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="travelers"
              type="number"
              min="1"
              className="pl-9"
              value={travelers}
              onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="mt-4 w-full">
        <Search className="mr-2 h-4 w-4" />
        Buscar
      </Button>
    </form>
  )
}
