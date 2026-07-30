"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { BadgeMark } from "@/components/ui/badge-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, fv } from "@/lib/utils";
import type { Application } from "@/lib/types";

export function IdCardPrint({ app }: { app: Application }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = JSON.stringify({
      id: app.id,
      name: app.full_name,
      emp: app.employee_id,
      dept: app.department,
      pos: app.position,
      status: app.status,
    });
    QRCode.toCanvas(canvasRef.current, payload, { width: 96, margin: 0, color: { dark: "#0B2A4A" } });
  }, [app]);

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-xl px-6">
        <div className="print-hide mb-6 flex items-center justify-between">
          <Link href="/dashboard/approver" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-700 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-[22px] border border-navy-100 bg-white shadow-[0_20px_60px_-15px_rgba(11,42,74,0.25)]">
          <div className="relative bg-navy-700 px-6 pb-8 pt-5 text-white">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeMark className="h-6" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                  SHE ID Card
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white/60">#{app.id}</span>
            </div>
            <div className="mt-6 flex items-end gap-4">
              {app.photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={app.photo_path}
                  alt={app.full_name}
                  className="h-24 w-20 rounded-lg border-2 border-white/30 object-cover"
                />
              ) : (
                <div className="h-24 w-20 rounded-lg border-2 border-white/30 bg-white/10" />
              )}
              <div>
                <div className="font-display text-lg font-extrabold leading-tight">{app.full_name}</div>
                <div className="text-sm text-white/75">{fv(app.position)} · {app.department}</div>
                <div className="mt-1 font-mono text-xs text-white/60">NIP {app.employee_id}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-5 text-sm">
            <Field label="Perusahaan" value={fv(app.company)} />
            <Field label="Jenis ID" value={app.permit_type} />
            <Field label="Kimper Zone" value={fv(app.kimper_zone)} />
            <Field label="Masa Berlaku" value={formatDate(app.expiry_date)} />
            <Field label="Diajukan" value={formatDate(app.created_at)} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">Status</div>
              <div className="mt-1"><StatusBadge status={app.status} /></div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-navy-100 px-6 py-4">
            <div className="text-[11px] leading-tight text-muted">
              Pindai untuk verifikasi lapangan.
              <br />
              PT Sumbawa Jutaraya
            </div>
            <canvas ref={canvasRef} className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 font-semibold text-navy-800">{value}</div>
    </div>
  );
}
