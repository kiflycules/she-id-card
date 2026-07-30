import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IdCardPrint } from "@/components/idcard/idcard-print";
import type { Application } from "@/lib/types";

export default async function IdCardPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", Number(params.id))
    .single();

  if (!app) notFound();

  return <IdCardPrint app={app as Application} />;
}
