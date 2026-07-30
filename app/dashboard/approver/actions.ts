"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppStatus } from "@/lib/types";

export async function updateStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as AppStatus;

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("applications")
    .update({ status, decided_by: user?.id ?? null, decided_at: new Date().toISOString() })
    .eq("id", id);

  if (user) {
    await supabase.from("audit_logs").insert({
      application_id: id,
      user_id: user.id,
      action: `status_${status.toLowerCase()}`,
    });
  }

  revalidatePath("/dashboard/approver");
  revalidatePath("/dashboard/admin");
}
