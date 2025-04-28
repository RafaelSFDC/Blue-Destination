import { z } from "zod";
import type { Destination } from "@/lib/types";

export const destinationSchema = z.custom<Destination>();
export const destinationArraySchema = z.array(destinationSchema);