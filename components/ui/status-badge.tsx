import { cn } from "@/lib/utils";
import type { AppStatus } from "@/lib/types";

const styles: Record<AppStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-600/20",
  APPROVED: "bg-ok-50 text-ok ring-1 ring-inset ring-ok/25",
  REJECTED: "bg-danger-50 text-danger ring-1 ring-inset ring-danger/25",
};

const labels: Record<AppStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export function StatusBadge({ status }: { status: AppStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
