import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
