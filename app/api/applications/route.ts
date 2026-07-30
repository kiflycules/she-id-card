import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeExpiryDate } from "@/lib/utils";
import type { PermitType } from "@/lib/types";

const TEXT_FIELDS = [
  "full_name", "employee_id", "company", "position", "department",
  "birth_place", "birth_date", "address", "permit_type", "kimper_zone",
  "sim_no", "sim_type", "sim_issue", "sim_expiry", "cert_type", "cert_no",
  "notes", "id_issue_date",
];

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const data: Record<string, string | null> = {};
  for (const key of TEXT_FIELDS) {
    const v = formData.get(key);
    data[key] = typeof v === "string" && v.trim() !== "" ? v.trim() : null;
  }
  for (let i = 1; i <= 10; i++) {
    const u = formData.get(`u${i}`);
    const s = formData.get(`s${i}`);
    data[`u${i}`] = typeof u === "string" && u.trim() !== "" ? u.trim() : null;
    data[`s${i}`] = typeof s === "string" && s.trim() !== "" ? s.trim() : null;
  }

  // Minimal validation — mirrors submit_apply.php required fields
  const required = ["full_name", "employee_id", "birth_date", "address", "department", "permit_type"];
  for (const field of required) {
    if (!data[field]) {
      return NextResponse.json({ error: `Field "${field}" wajib diisi.` }, { status: 422 });
    }
  }

  const permitType = data.permit_type as PermitType;
  const expiryDate = computeExpiryDate(permitType);

  // Photo upload (optional)
  let photoPath: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const ext = photo.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, photo, { contentType: photo.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: `Gagal upload foto: ${uploadError.message}` }, { status: 500 });
    }
    const { data: publicUrl } = supabase.storage.from("photos").getPublicUrl(fileName);
    photoPath = publicUrl.publicUrl;
  }

  const { data: inserted, error } = await supabase
    .from("applications")
    .insert({ ...data, expiry_date: expiryDate, photo_path: photoPath, status: "PENDING" })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: inserted.id });
}
