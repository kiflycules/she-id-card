import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { AppStatus } from "@/lib/types";

const PAGE_SIZE = 20;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const supabase = createClient();
  const q = (searchParams.q || "").trim();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("applications")
    .select("id, full_name, employee_id, department, status, created_at", { count: "exact" })
    .order("id", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,employee_id.ilike.%${q}%`);
  }

  const { data: rows, count } = await query;

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  const [{ count: pendingCount }, { count: approvedCount }, { count: rejectedCount }] =
    await Promise.all([
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "APPROVED"),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "REJECTED"),
    ]);

  return (
    <div>
      <Topbar title="Dashboard Admin" subtitle="Ringkasan pengajuan ID Card." />

      <div className="space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Total Pengajuan
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold text-navy-800">
                {count || 0}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Status Pengajuan
              </div>
              <div className="mt-2 flex gap-6">
                <Stat label="Menunggu" value={pendingCount || 0} />
                <Stat label="Disetujui" value={approvedCount || 0} />
                <Stat label="Ditolak" value={rejectedCount || 0} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Pengajuan Baru
              </div>
              <Link
                href="/apply"
                target="_blank"
                className="mt-3 inline-block rounded-lg bg-navy-700 px-4 py-2 text-center text-sm font-bold text-white hover:bg-navy-800"
              >
                + Buka Form Publik
              </Link>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-bold text-navy-800">
                Data Pengajuan Terbaru
              </h2>
              <form className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Cari nama atau NRP…"
                  className="rounded-lg border border-navy-100 px-3.5 py-2 text-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/15"
                />
                <button className="rounded-lg bg-navy-700 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800">
                  Cari
                </button>
              </form>
            </div>

            <div className="overflow-x-auto rounded-xl border border-navy-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-50 text-xs font-bold uppercase tracking-wide text-navy-600">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">NRP</th>
                    <th className="px-4 py-3">Departemen</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tanggal Input</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {!rows || rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted">
                        Belum ada data.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={r.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 tnum">{from + i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-navy-800">{r.full_name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{r.employee_id}</td>
                        <td className="px-4 py-3">{r.department}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status as AppStatus} />
                        </td>
                        <td className="px-4 py-3 text-muted">{formatDate(r.created_at)}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/admin/${r.id}/edit`}
                            className="font-semibold text-steel hover:underline"
                          >
                            Edit
                          </Link>
                          <span className="mx-1.5 text-navy-200">·</span>
                          <Link
                            href={`/idcard/${r.id}`}
                            className="font-semibold text-steel hover:underline"
                          >
                            ID Card
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <PageLink q={q} page={page - 1} disabled={page <= 1} label="‹ Sebelumnya" />
              <span className="text-xs text-muted">
                Halaman {page} dari {totalPages}
              </span>
              <PageLink q={q} page={page + 1} disabled={page >= totalPages} label="Selanjutnya ›" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className="font-display text-xl font-extrabold text-navy-800">{value}</div>
    </div>
  );
}

function PageLink({
  q,
  page,
  disabled,
  label,
}: {
  q: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-navy-100 px-3.5 py-2 text-sm font-semibold text-navy-200">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/dashboard/admin?q=${encodeURIComponent(q)}&page=${page}`}
      className="rounded-lg border border-navy-100 px-3.5 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50"
    >
      {label}
    </Link>
  );
}
