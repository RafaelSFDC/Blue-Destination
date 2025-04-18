"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Users } from "lucide-react"
import { formatCurrency, calculateDiscountedPrice } from "@/lib/utils"
import type { Package } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"

interface PackageCardProps {
  package: Package
  className?: string
}

export function PackageCard({ package: pkg, className }: PackageCardProps) {
  const discountedPrice = calculateDiscountedPrice(pkg.price, pkg.discount)

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md ${className || ""}`}
    >
      <Link href={`/packages/${pkg.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={pkg.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={pkg.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {pkg.featured && (
            <div className="absolute left-0 top-0 bg-primary px-2 py-1 text-xs font-medium text-white">Destaque</div>
          )}
          {pkg.discount && (
            <div className="absolute left-0 bottom-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
              {pkg.discount}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{pkg.name}</h3>
          <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{pkg.duration} dias</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>A partir de 1 pessoa</span>
            </div>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{pkg.description}</p>
          <div className="flex items-center justify-between">
            <div>
              {pkg.discount ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{formatCurrency(discountedPrice)}</span>
                  <span className="text-sm text-muted-foreground line-through">{formatCurrency(pkg.price)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</span>
              )}
              <p className="text-xs text-muted-foreground">por pessoa</p>
            </div>
            <Badge variant="outline" className="px-2 py-1">
              Ver detalhes
            </Badge>
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton id={pkg.id} type="package" />
      </div>
    </div>
  )
}
