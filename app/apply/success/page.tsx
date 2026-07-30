import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BadgeMark } from "@/components/ui/badge-mark";

export default function ApplySuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
          <BadgeMark className="h-8" />
        </div>
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-ok" />
        <h1 className="font-display text-xl font-extrabold text-navy-800">
          Pengajuan Terkirim
        </h1>
        <p className="mt-2 text-sm text-muted">
          Nomor pengajuan kamu:{" "}
          <span className="font-mono font-semibold text-navy-700">
            #{searchParams.id ?? "-"}
          </span>
          . Atasan akan meninjau dan memperbarui statusnya.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
