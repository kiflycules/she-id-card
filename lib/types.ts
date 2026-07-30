export type PermitType = "Mine Permit" | "Work Permit" | "Kimper";
export type AppStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Application {
  id: number;
  full_name: string;
  employee_id: string;
  company: string | null;
  position: string | null;
  department: string;
  birth_place: string | null;
  birth_date: string | null;
  address: string | null;
  permit_type: PermitType;
  kimper_zone: string | null;
  sim_no: string | null;
  sim_type: string | null;
  sim_issue: string | null;
  sim_expiry: string | null;
  cert_type: string | null;
  cert_no: string | null;
  u1: string | null; u2: string | null; u3: string | null; u4: string | null; u5: string | null;
  u6: string | null; u7: string | null; u8: string | null; u9: string | null; u10: string | null;
  s1: string | null; s2: string | null; s3: string | null; s4: string | null; s5: string | null;
  s6: string | null; s7: string | null; s8: string | null; s9: string | null; s10: string | null;
  notes: string | null;
  photo_path: string | null;
  id_issue_date: string | null;
  expiry_date: string;
  status: AppStatus;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
}

export const COMPANIES = [
  "PT. SJR",
  "PT. DMI",
  "PT. KPP",
  "PT. MALE",
  "PT. KKA",
  "PT. CDM",
  "PT. AK21",
] as const;

export const DEPARTMENTS = ["SHE DEPT", "HCGS DEPT", "RDE DEPT", "PCM DEPT"] as const;

export const KIMPER_ZONES = ["-", "A", "B", "C", "AB", "AC", "BC", "ABC"] as const;

export const PERMIT_TYPES: PermitType[] = ["Mine Permit", "Work Permit", "Kimper"];
