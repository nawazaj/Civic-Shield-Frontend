import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// The exact `cn` helper used across reactnativereusables.com components:
// clsx for conditional class composition, tailwind-merge to dedupe/override
// conflicting Tailwind classes (e.g. "p-2 ... p-4" -> "p-4").
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
