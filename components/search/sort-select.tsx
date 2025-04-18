"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SortOption = {
  value: string
  label: string
}

interface SortSelectProps {
  options: SortOption[]
  defaultValue: string
  onChange: (value: string) => void
}

export function SortSelect({ options, defaultValue, onChange }: SortSelectProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue)
        onChange(newValue)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
