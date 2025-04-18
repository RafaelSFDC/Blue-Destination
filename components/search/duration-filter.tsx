"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"

interface DurationFilterProps {
  minDuration: number
  maxDuration: number
  defaultValue: [number, number]
  onChange: (value: [number, number]) => void
}

export function DurationFilter({ minDuration, maxDuration, defaultValue, onChange }: DurationFilterProps) {
  const [value, setValue] = useState<[number, number]>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Duração</span>
        <span className="text-sm text-muted-foreground">
          {value[0]} - {value[1]} dias
        </span>
      </div>
      <Slider
        defaultValue={value}
        min={minDuration}
        max={maxDuration}
        step={1}
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
