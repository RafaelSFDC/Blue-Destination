import { z } from "zod";
import type { Package } from "@/lib/types";

export const packageSchema = z.custom<Package>();
export const packageArraySchema = z.array(packageSchema);