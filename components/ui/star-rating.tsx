import { Star } from "lucide-react"
import { generateStars } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  size?: number
  className?: string
}

export function StarRating({ rating, size = 16, className = "" }: StarRatingProps) {
  const { filled, half, empty } = generateStars(rating)

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(filled)].map((_, i) => (
        <Star key={`star-filled-${i}`} className="text-yellow-400 fill-yellow-400" size={size} />
      ))}

      {half && (
        <div className="relative">
          <Star className="text-yellow-400" size={size} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="text-yellow-400 fill-yellow-400" size={size} />
          </div>
        </div>
      )}

      {[...Array(empty)].map((_, i) => (
        <Star key={`star-empty-${i}`} className="text-yellow-400" size={size} />
      ))}
    </div>
  )
}
