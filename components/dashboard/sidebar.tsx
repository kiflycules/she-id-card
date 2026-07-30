import Link from "next/link";
import { BadgeMark } from "@/components/ui/badge-mark";
import { LayoutGrid, ClipboardList, LogOut } from "lucide-react";

export function Sidebar({ role, name }: { role: "admin" | "approver"; name: string }) {
  const links =
    role === "admin"
      ? [{ href: "/dashboard/admin", label: "Data Pengajuan", icon: LayoutGrid }]
      : [{ href: "/dashboard/approver", label: "Approvals", icon: ClipboardList }];

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-navy-100 bg-white">
      <div className="flex items-center gap-2.5 border-b border-navy-100 px-5 py-5">
        <BadgeMark className="h-7" />
        <div>
          <div className="font-display text-[13px] font-bold uppercase tracking-wide text-navy-700">
            SHE ID Card
          </div>
          <div className="text-[11px] text-muted">PT Sumbawa Jutaraya</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-navy-100 px-4 py-4">
        <div className="mb-3 text-xs text-muted">
          Masuk sebagai <span className="font-semibold text-navy-700">{name}</span>
          <br />
          <span className="uppercase tracking-wide">{role}</span>
        </div>
        <a
          href="/logout"
          className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </a>
      </div>
    </aside>
  );
}
