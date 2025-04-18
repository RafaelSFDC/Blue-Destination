"use client"

import { useState } from "react"
import { StarRating } from "@/components/ui/star-rating"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface RatingFilterProps {
  onChange: (ratings: number[]) => void
}

export function RatingFilter({ onChange }: RatingFilterProps) {
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const handleRatingChange = (rating: number, checked: boolean) => {
    let newRatings: number[]

    if (checked) {
      newRatings = [...selectedRatings, rating]
    } else {
      newRatings = selectedRatings.filter((r) => r !== rating)
    }

    setSelectedRatings(newRatings)
    onChange(newRatings)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Avaliação</h3>

      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <Checkbox
            id={`rating-${rating}`}
            checked={selectedRatings.includes(rating)}
            onCheckedChange={(checked) => handleRatingChange(rating, checked === true)}
          />
          <Label htmlFor={`rating-${rating}`} className="flex items-center gap-2 text-sm font-normal">
            <StarRating rating={rating} size={16} />
            {rating === 1 ? "& acima" : ""}
          </Label>
        </div>
      ))}
    </div>
  )
}
