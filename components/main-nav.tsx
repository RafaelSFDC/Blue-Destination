import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Início
      </Link>
      <Link
        href="/destinations"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Destinos
      </Link>
      <Link href="/packages" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Pacotes
      </Link>
      <Link
        href="/promotions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Promoções
      </Link>
      <Link
        href="/testimonials"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Depoimentos
      </Link>
      <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Sobre
      </Link>
      <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Contato
      </Link>
      <Link href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        FAQ
      </Link>
    </nav>
  )
}
