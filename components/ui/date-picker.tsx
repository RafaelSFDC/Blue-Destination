"use client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, setDate, placeholder = "Selecione uma data", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button" // Explicitamente definir como button para evitar submit do formulário
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          onClick={(e) => {
            // Impedir propagação do evento para evitar submit do formulário
            e.stopPropagation()
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()} // Evitar foco automático que pode causar problemas
        onClick={(e) => e.stopPropagation()} // Impedir propagação do clique
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
          }}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
