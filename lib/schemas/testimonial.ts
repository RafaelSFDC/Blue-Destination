import { z } from "zod";
import type { Testimonial } from "@/lib/types";

export const testimonialSchema = z.custom<Testimonial>();

// Ou se preferir uma validação mais específica:
export const testimonialArraySchema = z.array(z.custom<Testimonial>());

