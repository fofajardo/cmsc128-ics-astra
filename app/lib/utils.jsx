import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMonthYear(input) {
  const date = (typeof input === "string") ? new Date(input) : input;
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid date input";
  }
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
}
