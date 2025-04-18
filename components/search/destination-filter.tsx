"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Destination } from "@/lib/mock-data"

interface DestinationFilterProps {
  destinations: Destination[]
  onChange: (destinationId: string | null) => void
  defaultValue?: string | null
}

export function DestinationFilter({ destinations, onChange, defaultValue = null }: DestinationFilterProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Destino</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {value ? destinations.find((destination) => destination.id === value)?.name : "Selecione um destino"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar destino..." />
            <CommandList>
              <CommandEmpty>Nenhum destino encontrado.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {destinations.map((destination) => (
                  <CommandItem
                    key={destination.id}
                    value={destination.id}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? null : currentValue
                      setValue(newValue)
                      onChange(newValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === destination.id ? "opacity-100" : "opacity-0")} />
                    {destination.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
