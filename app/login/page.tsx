import { BadgeMark } from "@/components/ui/badge-mark";
import { Label, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { loginAction } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-800 px-6">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.08]" />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-navy-700/60 p-8 backdrop-blur">
        <div className="mb-6 flex flex-col items-center text-center">
          <BadgeMark className="mb-3 h-9" />
          <h1 className="font-display text-lg font-extrabold text-white">SHE ID Card</h1>
          <p className="text-xs text-white/60">Login untuk Admin & Atasan</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-danger/15 px-3.5 py-2.5 text-sm font-medium text-red-100">
            {searchParams.error}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <Label className="text-white/80">Email</Label>
            <Input type="email" name="email" required placeholder="nama@perusahaan.com" />
          </div>
          <div>
            <Label className="text-white/80">Password</Label>
            <Input type="password" name="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
