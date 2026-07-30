import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/dashboard/topbar";
import { EditForm } from "@/components/apply/edit-form";
import type { Application } from "@/lib/types";

export default async function EditApplicationPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", Number(params.id))
    .single();

  if (!app) notFound();

  return (
    <div>
      <Topbar title={`Edit Pengajuan #${app.id}`} subtitle={app.full_name} />
      <div className="p-8">
        <EditForm application={app as Application} />
      </div>
    </div>
  );
}
