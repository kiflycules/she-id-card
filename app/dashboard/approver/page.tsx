import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, fv } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/types";
import type { AppStatus } from "@/lib/types";
import { updateStatusAction } from "./actions";

export default async function ApproverDashboardPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; dept?: string };
}) {
  const supabase = createClient();
  const q = (searchParams.q || "").trim();
  const status = (searchParams.status || "").trim();
  const dept = (searchParams.dept || "").trim();

  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,employee_id.ilike.%${q}%,department.ilike.%${q}%,permit_type.ilike.%${q}%`
    );
  }
  if (status) query = query.eq("status", status);
  if (dept) query = query.eq("department", dept);

  const { data: rows, error } = await query;

  return (
    <div>
      <Topbar title="Approvals" subtitle="Tinjau dan putuskan status pengajuan ID Card." />

      <div className="space-y-6 p-8">
        <Card>
          <CardBody>
            <form className="grid gap-3 sm:grid-cols-[1fr_180px_180px_auto]">
              <input
                name="q"
                defaultValue={q}
                placeholder="Cari nama / NRP / departemen / jenis ID…"
                className="rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/15"
              />
              <select
                name="status"
                defaultValue={status}
                className="rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
              </select>
              <select
                name="dept"
                defaultValue={dept}
                className="rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm"
              >
                <option value="">Semua Dept</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button className="rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-navy-800">
                Cari
              </button>
            </form>
          </CardBody>
        </Card>

        {error && (
          <div className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger">
            {error.message}
          </div>
        )}

        <Card>
          <CardBody className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-navy-50 text-xs font-bold uppercase tracking-wide text-navy-600">
                <tr>
                  <th className="px-4 py-3">No ID</th>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">NRP</th>
                  <th className="px-4 py-3">Perusahaan</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Jenis ID</th>
                  <th className="px-4 py-3">Zona</th>
                  <th className="px-4 py-3">Masa Berlaku</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Diajukan</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {!rows || rows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-muted">
                      Belum ada data.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-navy-50/50">
                      <td className="px-4 py-3 font-mono text-xs text-navy-600">#{r.id}</td>
                      <td className="px-4 py-3 font-semibold text-navy-800">{r.full_name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.employee_id}</td>
                      <td className="px-4 py-3">{fv(r.company)}</td>
                      <td className="px-4 py-3">{fv(r.position)}</td>
                      <td className="px-4 py-3">{r.department}</td>
                      <td className="px-4 py-3">{r.permit_type}</td>
                      <td className="px-4 py-3">{fv(r.kimper_zone)}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(r.expiry_date)}</td>
                      <td className="px-4 py-3">
                        <div className="mb-2">
                          <StatusBadge status={r.status as AppStatus} />
                        </div>
                        <form action={updateStatusAction} className="flex gap-1.5">
                          <input type="hidden" name="id" value={r.id} />
                          <select
                            name="status"
                            defaultValue={r.status}
                            className="rounded-md border border-navy-100 px-2 py-1.5 text-xs"
                          >
                            <option value="PENDING">Menunggu</option>
                            <option value="APPROVED">Disetujui</option>
                            <option value="REJECTED">Ditolak</option>
                          </select>
                          <button className="rounded-md bg-navy-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800">
                            Simpan
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/idcard/${r.id}`} className="font-semibold text-steel hover:underline">
                          ID Card
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
