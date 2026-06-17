import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getCreditCost(type: string): number {
  switch (type) {
    case "image_scene":
      return 1;
    case "product_copy":
      return 2;
    case "video_script":
      return 3;
    case "social_post":
      return 1;
    default:
      return 1;
  }
}

export const PLANS = {
  free: { name: "Free", credits: 10, price: 0 },
  starter: { name: "Starter", credits: 100, price: 19 },
  pro: { name: "Pro", credits: 500, price: 49 },
  business: { name: "Business", credits: Infinity, price: 149 },
} as const;
