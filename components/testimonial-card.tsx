import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";
import { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={testimonial.user.avatar || "/placeholder.svg"}
            alt={testimonial.user.avatar || "Avatar"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{testimonial.user.name}</h4>
          <p className="text-sm text-muted-foreground">
            {new Date(testimonial.date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
      <StarRating rating={testimonial.rating} className="mb-3" />
      <p className="text-muted-foreground">{testimonial.comment}</p>
    </div>
  );
}
