import Link from "next/link";
import { BadgeMark } from "@/components/ui/badge-mark";
import { ApplyForm } from "@/components/apply/apply-form";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-paper pb-16">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <BadgeMark className="h-7" />
            <span className="font-display text-[15px] font-bold uppercase tracking-wide text-navy-700">
              SHE ID Card
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-navy-600 hover:text-navy-800">
            ← Kembali
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
            Form Pengajuan
          </div>
          <h1 className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
            Pengajuan ID Card
          </h1>
          <p className="mt-1 text-sm text-muted">
            Karyawan mengajukan tanpa login. Admin & Atasan akan memproses.
          </p>
        </div>

        <ApplyForm />
      </div>
    </div>
  );
}
