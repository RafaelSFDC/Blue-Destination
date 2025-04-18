"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagFilterProps {
  tags: string[]
  onChange: (selectedTags: string[]) => void
  defaultValue?: string[]
}

export function TagFilter({ tags, onChange, defaultValue = [] }: TagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValue)

  useEffect(() => {
    setSelectedTags(defaultValue)
  }, [defaultValue])

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newSelectedTags)
    onChange(newSelectedTags)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Categorias</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn(
              "cursor-pointer capitalize hover:bg-primary/10",
              selectedTags.includes(tag) && "bg-primary/10 border-primary/50",
            )}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
