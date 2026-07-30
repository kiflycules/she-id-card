import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EDITABLE_FIELDS = [
  "full_name", "employee_id", "company", "position", "department",
  "birth_place", "birth_date", "address", "permit_type", "kimper_zone",
  "sim_no", "sim_type", "sim_issue", "sim_expiry", "cert_type", "cert_no",
  "notes", "id_issue_date", "expiry_date", "status",
  ...Array.from({ length: 10 }, (_, i) => `u${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `s${i + 1}`),
];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const update: Record<string, string | null> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) update[key] = body[key] === "" ? null : body[key];
  }

  const { error } = await supabase
    .from("applications")
    .update(update)
    .eq("id", Number(params.id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    application_id: Number(params.id),
    user_id: user.id,
    action: "edit",
  });

  return NextResponse.json({ ok: true });
}
