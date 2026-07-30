import { cn } from "@/lib/utils";

/**
 * The signature mark: a lanyard-clip ID badge silhouette.
 * Used small in the navbar, large in the hero, and echoed by the
 * printable ID card's own notched top edge.
 */
export function BadgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      className={cn("h-8 w-auto", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H26C27.1046 2 28 2.89543 28 4V8H12V4C12 2.89543 12.8954 2 14 2Z"
        className="fill-amber"
      />
      <rect x="2" y="8" width="36" height="38" rx="6" className="fill-navy-700" />
      <circle cx="20" cy="20" r="6" className="fill-white" fillOpacity="0.92" />
      <path d="M11 37c1.8-5.2 6-7.5 9-7.5s7.2 2.3 9 7.5" stroke="white" strokeOpacity="0.92" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
