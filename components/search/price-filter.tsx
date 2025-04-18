"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

interface PriceFilterProps {
  minPrice: number
  maxPrice: number
  defaultValue: [number, number]
  onChange: (value: [number, number]) => void
}

export function PriceFilter({ minPrice, maxPrice, defaultValue, onChange }: PriceFilterProps) {
  const [value, setValue] = useState<[number, number]>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Preço</span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(value[0])} - {formatCurrency(value[1])}
        </span>
      </div>
      <Slider
        defaultValue={value}
        min={minPrice}
        max={maxPrice}
        step={100}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue as [number, number])
          onChange(newValue as [number, number])
        }}
        className="py-4"
      />
    </div>
  )
}
