import Link from "next/link";
import { BadgeMark } from "@/components/ui/badge-mark";
import { ShieldCheck, ScanLine, ClipboardCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <header className="border-b border-navy-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BadgeMark className="h-7" />
            <div className="font-display text-[15px] font-bold uppercase tracking-wide text-navy-700">
              SHE ID Card
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50"
          >
            Login Staff
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-100">
        <div className="absolute inset-0 bg-blueprint bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-navy-600">
              Departemen SHE • PT Sumbawa Jutaraya
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-navy-800 sm:text-5xl">
              Satu kartu identitas untuk setiap orang yang pulang dengan selamat.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              Ajukan ID Card tanpa login, diverifikasi atasan secara transparan, dan
              dicetak lengkap dengan QR verifikasi. Satu sistem, satu standar, untuk
              seluruh area kerja.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="rounded-lg bg-navy-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-navy-800"
              >
                Ajukan ID Card
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-navy-200 bg-white px-5 py-3 text-sm font-bold text-navy-700 hover:bg-navy-50"
              >
                Login Admin / Atasan
              </Link>
            </div>
          </div>

          {/* Badge mockup — signature element */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-[22px] border border-navy-100 bg-white p-2 shadow-[0_20px_60px_-15px_rgba(11,42,74,0.35)]">
              <div className="relative overflow-hidden rounded-[16px] bg-navy-700 p-5 text-white">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                  <span>SHE ID Card</span>
                  <span>2026</span>
                </div>
                <div className="mt-6 flex items-end gap-3">
                  <div className="h-20 w-16 rounded-md bg-white/15" />
                  <div className="flex-1">
                    <div className="h-2.5 w-28 rounded bg-white/70" />
                    <div className="mt-2 h-2 w-20 rounded bg-white/40" />
                    <div className="mt-4 h-2 w-24 rounded bg-white/30 font-mono" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="h-9 w-9 rounded bg-white/90" />
                  <span className="rounded-full bg-amber/90 px-2.5 py-1 text-[10px] font-bold text-navy-800">
                    APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          <Feature
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Tanpa Login"
            desc="Karyawan mengisi form pengajuan langsung, tanpa perlu membuat akun."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Approval Transparan"
            desc="Atasan meninjau dan memutuskan status; admin mengelola data lengkap."
          />
          <Feature
            icon={<ScanLine className="h-5 w-5" />}
            title="Siap Cetak & QR"
            desc="Kartu ID langsung siap dicetak dengan kode QR untuk verifikasi lapangan."
          />
        </div>
      </section>

      <footer className="border-t border-navy-100 py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Team SHE • PT Sumbawa Jutaraya
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        {icon}
      </div>
      <div className="font-display text-[15px] font-bold text-navy-800">{title}</div>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
