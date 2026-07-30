import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login?error=Akun%20belum%20memiliki%20role");

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar role={profile.role as "admin" | "approver"} name={profile.name || user.email || ""} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
