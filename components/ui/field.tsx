import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-[13px] font-semibold text-navy-700", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70",
        "focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/15",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-ink",
        "focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/15",
        className
      )}
      {...props}
    />
  );
}
