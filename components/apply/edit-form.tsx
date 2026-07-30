"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Label, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { COMPANIES, DEPARTMENTS, KIMPER_ZONES, PERMIT_TYPES, type Application, type PermitType } from "@/lib/types";

export function EditForm({ application }: { application: Application }) {
  const router = useRouter();
  const [permitType, setPermitType] = useState<PermitType>(application.permit_type);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const isKimper = permitType === "Kimper";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch(`/api/applications/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setSavedMsg("Perubahan disimpan.");
      router.refresh();
    } else {
      const json = await res.json();
      setSavedMsg(`Gagal: ${json.error}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
      {savedMsg && (
        <div className="rounded-lg bg-navy-50 px-4 py-3 text-sm font-medium text-navy-700">
          {savedMsg}
        </div>
      )}

      <Card>
        <CardHeader className="font-display text-sm font-bold text-navy-700">Data Diri</CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nama Lengkap</Label><Input name="full_name" defaultValue={application.full_name} required /></div>
          <div><Label>NRP</Label><Input name="employee_id" defaultValue={application.employee_id} required /></div>
          <div>
            <Label>Perusahaan</Label>
            <Select name="company" defaultValue={application.company ?? ""}>
              <option value="">— Pilih Perusahaan —</option>
              {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div><Label>Jabatan</Label><Input name="position" defaultValue={application.position ?? ""} /></div>
          <div><Label>Tempat Lahir</Label><Input name="birth_place" defaultValue={application.birth_place ?? ""} /></div>
          <div><Label>Tanggal Lahir</Label><Input type="date" name="birth_date" defaultValue={application.birth_date ?? ""} /></div>
          <div className="sm:col-span-2"><Label>Alamat</Label><Input name="address" defaultValue={application.address ?? ""} /></div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="font-display text-sm font-bold text-navy-700">Departemen & Jenis ID</CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Departemen</Label>
            <Select name="department" defaultValue={application.department} required>
              {DEPARTMENTS.includes(application.department as any) ? null : (
                <option value={application.department}>{application.department}</option>
              )}
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <div>
            <Label>Jenis ID Card</Label>
            <Select
              name="permit_type"
              defaultValue={application.permit_type}
              onChange={(e) => setPermitType(e.target.value as PermitType)}
              required
            >
              {PERMIT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>
          <div>
            <Label>Kimper Zone</Label>
            <Select name="kimper_zone" defaultValue={application.kimper_zone ?? "-"}>
              {KIMPER_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </Select>
          </div>
          <div>
            <Label>Tanggal Dikeluarkan ID</Label>
            <Input type="date" name="id_issue_date" defaultValue={application.id_issue_date ?? ""} />
          </div>
          <div>
            <Label>Masa Berlaku (Expiry)</Label>
            <Input type="date" name="expiry_date" defaultValue={application.expiry_date} required />
          </div>
          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue={application.status}>
              <option value="PENDING">Menunggu</option>
              <option value="APPROVED">Disetujui</option>
              <option value="REJECTED">Ditolak</option>
            </Select>
          </div>
          <div className="sm:col-span-3">
            <Label>Catatan</Label>
            <Input name="notes" defaultValue={application.notes ?? ""} />
          </div>
        </CardBody>
      </Card>

      {isKimper && (
        <Card>
          <CardHeader className="font-display text-sm font-bold text-navy-700">Data Kimper / SIM / Sertifikat</CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-3">
            <div><Label>No SIM</Label><Input name="sim_no" defaultValue={application.sim_no ?? ""} /></div>
            <div><Label>Jenis SIM</Label><Input name="sim_type" defaultValue={application.sim_type ?? ""} /></div>
            <div><Label>Masa Berlaku SIM</Label><Input type="date" name="sim_expiry" defaultValue={application.sim_expiry ?? ""} /></div>
            <div><Label>Jenis Sertifikat</Label><Input name="cert_type" defaultValue={application.cert_type ?? ""} /></div>
            <div><Label>No Sertifikat</Label><Input name="cert_no" defaultValue={application.cert_no ?? ""} /></div>
            <div><Label>Tanggal Terbit SIM</Label><Input type="date" name="sim_issue" defaultValue={application.sim_issue ?? ""} /></div>
          </CardBody>
        </Card>
      )}

      {isKimper && (
        <Card>
          <CardHeader className="font-display text-sm font-bold text-navy-700">Kualifikasi / Unit</CardHeader>
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <div key={`u${i}`}>
                  <Label>U{i}</Label>
                  <Input name={`u${i}`} defaultValue={(application as any)[`u${i}`] ?? ""} />
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <div key={`s${i}`}>
                  <Label>S{i}</Label>
                  <Input name={`s${i}`} defaultValue={(application as any)[`s${i}`] ?? ""} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan…" : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
