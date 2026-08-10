import { clsx } from "https://esm.sh/clsx@1.2.1"
import { twMerge } from "https://esm.sh/tailwind-merge@1.12.0"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export { cva } from "https://esm.sh/class-variance-authority@0.6.0"
