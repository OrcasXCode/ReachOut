import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind classes properly while handling conditional values
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
