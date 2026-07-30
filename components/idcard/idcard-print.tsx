"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
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
    QRCode.toCanvas(canvasRef.current, payload, { width: 72, margin: 0, color: { dark: "#0B2A4A" } });
  }, [app]);

  const cardTitle = app.permit_type.replace(/\s+/g, "").toUpperCase();
  const zone = app.kimper_zone && app.kimper_zone !== "-" ? app.kimper_zone : null;

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-sm px-6">
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

        {/* Physical ID card replica */}
        <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_20px_60px_-15px_rgba(11,42,74,0.3)]">
          {/* Diagonal corner cut, top right */}
          <div
            className="absolute right-0 top-0 h-16 w-24 bg-navy-800"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
          />

          {/* Header */}
          <div className="relative px-4 pb-3 pt-4">
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-navy-700">
                <div className="h-4 w-4 rounded-full bg-amber" />
              </div>
              <div className="pt-0.5 text-[11px] font-bold uppercase leading-tight text-navy-600">
                PT Sumbawa Jutaraya
              </div>
            </div>
            <h1 className="mt-2 font-display text-[26px] font-extrabold leading-none tracking-tight text-navy-800">
              {cardTitle}
            </h1>
            <div className="mt-1 text-[11px] font-semibold text-muted">
              CONTRACTOR &ndash; ID Reg:{" "}
              <span className="font-mono text-navy-700">{app.employee_id}</span>
            </div>
          </div>

          {/* Zone strip + photo */}
          <div className="flex">
            {/* Zone / permit type color strip */}
            <div className="flex w-16 flex-shrink-0 flex-col items-center justify-between bg-danger py-3 text-white">
              <div className="text-center text-[11px] font-bold uppercase leading-tight">
                {zone ? "Zona" : app.permit_type.split(" ")[0]}
              </div>
              <div className="font-display text-3xl font-extrabold leading-none">
                {zone ?? app.permit_type.split(" ")[1]?.slice(0, 1) ?? ""}
              </div>
              <div className="text-center text-[9px] font-semibold leading-tight">
                Masa Berlaku
                <br />
                {formatDate(app.expiry_date)}
              </div>
            </div>

            {/* Photo */}
            <div className="flex-1 bg-navy-50 p-2">
              {app.photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={app.photo_path}
                  alt={app.full_name}
                  className="h-44 w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center rounded-md bg-navy-100 text-xs text-muted">
                  Tidak ada foto
                </div>
              )}
            </div>
          </div>

          {/* Name / position band */}
          <div className="bg-navy-800 px-4 py-3 text-center text-white">
            <div className="font-display text-lg font-extrabold uppercase leading-tight">
              {app.full_name}
            </div>
            <div className="mt-0.5 text-[12px] text-white/80">
              {fv(app.position)} &nbsp;/&nbsp; {app.department}
            </div>
            <div className="text-[12px] text-white/60">
              {fv(app.company)}
            </div>
          </div>

          {/* Violation / Accident punch rows */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-navy-600">
                Violation
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-3 w-3 rounded-full bg-danger" />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-navy-600">
                Accident
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="h-3 w-3 rounded-full bg-danger" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QR verification tag, separate from the physical card face */}
        <div className="print-hide mx-auto mt-4 flex max-w-sm items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3">
          <div className="text-[11px] leading-tight text-muted">
            Pindai untuk verifikasi lapangan.
          </div>
          <canvas ref={canvasRef} className="rounded" />
        </div>
      </div>
    </div>
  );
}
