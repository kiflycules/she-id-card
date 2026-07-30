"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Label, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { COMPANIES, DEPARTMENTS, KIMPER_ZONES, PERMIT_TYPES, type PermitType } from "@/lib/types";

export function ApplyForm() {
  const router = useRouter();
  const [permitType, setPermitType] = useState<PermitType>("Mine Permit");
  const [department, setDepartment] = useState("");
  const [showOtherDept, setShowOtherDept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isKimper = permitType === "Kimper";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Resolve "Lainnya" department into the actual typed value
    if (formData.get("department") === "OTHER") {
      formData.set("department", (formData.get("department_other") as string) || "");
    }

    try {
      const res = await fetch("/api/applications", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengirim pengajuan");
      router.push(`/apply/success?id=${json.id}`);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="font-display text-sm font-bold text-navy-700">
          Data Diri
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nama Lengkap</Label>
            <Input name="full_name" required placeholder="Nama sesuai KTP" />
          </div>
          <div>
            <Label>NRP</Label>
            <Input name="employee_id" required placeholder="NRP / NIK internal" />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select name="company" required defaultValue="">
              <option value="">— Pilih Perusahaan —</option>
              {COMPANIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Jabatan</Label>
            <Input name="position" placeholder="Mechanic, Operator, dll" />
          </div>
          <div>
            <Label>Tempat Lahir</Label>
            <Input name="birth_place" placeholder="Sumbawa Barat" />
          </div>
          <div>
            <Label>Tanggal Lahir</Label>
            <Input type="date" name="birth_date" />
          </div>
          <div className="sm:col-span-2">
            <Label>Alamat</Label>
            <Input name="address" placeholder="Alamat lengkap" />
          </div>
          <div>
            <Label>Tanggal Dikeluarkan ID (opsional)</Label>
            <Input type="date" name="id_issue_date" />
            <p className="mt-1 text-xs text-muted">Jika diisi: jadi patokan hitung masa berlaku.</p>
          </div>
          <div>
            <Label>Foto</Label>
            <Input type="file" name="photo" accept="image/*" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="font-display text-sm font-bold text-navy-700">
          Departemen
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Departemen</Label>
            <Select
              name="department"
              required
              value={showOtherDept ? "OTHER" : department}
              onChange={(e) => {
                const v = e.target.value;
                setShowOtherDept(v === "OTHER");
                setDepartment(v);
              }}
            >
              <option value="">— Pilih Departemen —</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="OTHER">Lainnya (ketik sendiri)</option>
            </Select>
            <p className="mt-1 text-xs text-muted">Pilih dari daftar atau &ldquo;Lainnya&rdquo; untuk mengetik manual.</p>
          </div>
          {showOtherDept && (
            <div>
              <Label>Nama Departemen</Label>
              <Input name="department_other" required placeholder="Tulis nama departemen…" />
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="font-display text-sm font-bold text-navy-700">
          Jenis ID Card
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Jenis ID Card</Label>
            <Select
              name="permit_type"
              required
              value={permitType}
              onChange={(e) => setPermitType(e.target.value as PermitType)}
            >
              {PERMIT_TYPES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <p className="mt-1 text-xs text-muted">
              Masa berlaku saat simpan: <b>Kimper/Mine = 1 tahun</b>, <b>Work Permit = 2 bulan</b>.
            </p>
          </div>
          <div>
            <Label>Kimper Zone</Label>
            <Select name="kimper_zone" defaultValue="-">
              {KIMPER_ZONES.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Catatan (opsional)</Label>
            <Input name="notes" placeholder="Keterangan tambahan" />
          </div>
        </CardBody>
      </Card>

      {isKimper && (
        <Card>
          <CardHeader className="font-display text-sm font-bold text-navy-700">
            Data Kimper / SIM / Sertifikat
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-3">
            <div><Label>No SIM</Label><Input name="sim_no" required={isKimper} /></div>
            <div><Label>Jenis SIM</Label><Input name="sim_type" placeholder="A / B1 / B2 / C" required={isKimper} /></div>
            <div><Label>Masa Berlaku SIM</Label><Input type="date" name="sim_expiry" required={isKimper} /></div>
            <div><Label>Jenis Sertifikat</Label><Input name="cert_type" placeholder="K3, POP, dll" required={isKimper} /></div>
            <div><Label>No Sertifikat</Label><Input name="cert_no" required={isKimper} /></div>
            <div><Label>Tanggal Terbit SIM</Label><Input type="date" name="sim_issue" /></div>
          </CardBody>
        </Card>
      )}

      {isKimper && (
        <Card>
          <CardHeader className="font-display text-sm font-bold text-navy-700">
            Kualifikasi / Unit
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <div key={`u${i}`}>
                  <Label>U{i}</Label>
                  <Input name={`u${i}`} placeholder="-" />
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <div key={`s${i}`}>
                  <Label>S{i}</Label>
                  <Input name={`s${i}`} placeholder="-" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Mengirim…" : "Kirim Pengajuan"}
        </Button>
      </div>
    </form>
  );
}
