"use client"

import type React from "react"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"

interface MobileFiltersProps {
  children: React.ReactNode
  onApply: () => void
  onReset: () => void
}

export function MobileFilters({ children, onApply, onReset }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  const handleApply = () => {
    onApply()
    setOpen(false)
  }

  const handleReset = () => {
    onReset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6 overflow-y-auto pb-16">{children}</div>
        <SheetFooter className="absolute bottom-0 left-0 right-0 flex w-full flex-row gap-2 border-t bg-background p-4">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Limpar
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Aplicar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
