import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PermitType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Same rule as the original PHP app (submit_apply.php):
 *   Work Permit  -> +2 months
 *   Mine Permit / Kimper -> +1 year
 * Computed server-side so it can't be tampered with from the client.
 */
export function computeExpiryDate(permitType: PermitType, from: Date = new Date()): string {
  const d = new Date(from);
  if (permitType === "Work Permit") {
    d.setMonth(d.getMonth() + 2);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d.toISOString().slice(0, 10);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function fv(value: string | null | undefined, fallback = "-"): string {
  return value && value !== "" ? value : fallback;
}
