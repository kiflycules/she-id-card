"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent("Email atau password salah")}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user!.id)
    .single();

  if (!profile) {
    redirect(`/login?error=${encodeURIComponent("Akun ini belum memiliki role. Hubungi admin.")}`);
  }

  if (profile!.role === "admin") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/approver");
  }
}
