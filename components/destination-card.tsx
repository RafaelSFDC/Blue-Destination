import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { StarRating } from "@/components/ui/star-rating"
import { FavoriteButton } from "@/components/favorite-button"
import { formatCurrency } from "@/lib/utils"
import type { Destination } from "@/lib/mock-data"

interface DestinationCardProps {
  destination: Destination
  className?: string
}

export function DestinationCard({ destination, className }: DestinationCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md ${className || ""}`}
    >
      <Link href={`/destinations/${destination.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={destination.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {destination.featured && (
            <div className="absolute left-0 top-0 bg-primary px-2 py-1 text-xs font-medium text-white">Destaque</div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{destination.name}</h3>
            <p className="text-sm font-medium text-primary">{formatCurrency(destination.price)}</p>
          </div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{destination.location}</span>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <StarRating rating={destination.rating} />
            <span className="text-sm text-muted-foreground">({destination.reviewCount} avaliações)</span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{destination.description}</p>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton id={destination.id} type="destination" />
      </div>
    </div>
  )
}
