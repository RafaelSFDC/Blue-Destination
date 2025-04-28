"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/testimonial-card";
import Autoplay from "embla-carousel-autoplay";
import { Testimonial } from "@/lib/types";

function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000, // 3 segundos por slide
            stopOnInteraction: false, // não para ao interagir
            stopOnMouseEnter: true, // para quando o mouse está em cima
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.$id + testimonial.user.$id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex justify-end gap-2 mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}

export default TestimonialsCarousel;
