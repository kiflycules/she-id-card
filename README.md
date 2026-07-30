# SHE ID Card System — Next.js + Supabase

Versi ulang dari aplikasi PHP/MySQL kamu, dengan **logika identik** (form publik
tanpa login → status PENDING, dashboard admin, approvals atasan, hitung masa
berlaku otomatis, ID card cetak + QR) tapi tampilan baru bergaya **corporate
biru-putih** dan stack **Next.js + Supabase**, siap deploy lewat **GitHub →
Vercel**.

## Alur & Logika (sama persis dengan versi PHP)

| Fitur | Aturan |
|---|---|
| Form pengajuan | Publik, tanpa login (`/apply`) |
| Masa berlaku | Work Permit = **+2 bulan**, Mine Permit / Kimper = **+1 tahun** (dihitung di server) |
| Role | `admin` (kelola semua data) dan `approver` / atasan (ubah status, lihat ID card) |
| Status | `PENDING → APPROVED / REJECTED`, diubah dari dashboard approver |
| ID Card | Dicetak dengan QR berisi id, nama, NRP, departemen, posisi, status |
| Audit log | Setiap ubah status / edit data tercatat |

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan seluruh isi `supabase/schema.sql`. Ini akan membuat:
   - tabel `applications`, `profiles`, `audit_logs`
   - Row Level Security: publik boleh `INSERT` ke `applications` (form apply),
     hanya staff (`admin`/`approver`) yang boleh `SELECT`/`UPDATE`
   - bucket storage `photos` (public read, siapa saja boleh upload foto saat apply)
3. Buka **Authentication → Users** → tambah 2 user manual, misalnya:
   - `admin@perusahaan.com` (role admin)
   - `atasan@perusahaan.com` (role approver)
4. Salin **UUID** masing-masing user, lalu di SQL Editor jalankan:
   ```sql
   insert into public.profiles (id, name, role) values
     ('uuid-admin-di-sini', 'Admin SHE', 'admin'),
     ('uuid-atasan-di-sini', 'Atasan SHE', 'approver');
   ```
5. Buka **Project Settings → API** → salin `Project URL` dan `anon public key`.

## 2. Push ke GitHub

```bash
cd she-idcard-next
git init
git add .
git commit -m "SHE ID Card System - Next.js + Supabase"
git branch -M main
git remote add origin https://github.com/USERNAME/she-idcard-next.git
git push -u origin main
```

## 3. Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new) → import repo GitHub di atas.
2. Framework preset otomatis terdeteksi: **Next.js**.
3. Tambahkan Environment Variables (Project Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
   ```
4. Deploy. Selesai — domain Vercel kamu langsung jadi URL aplikasi.

## Jalan lokal (opsional)

```bash
npm install
cp .env.example .env.local   # isi dengan URL & anon key Supabase kamu
npm run dev
```

## Struktur

```
app/
  page.tsx                 landing
  apply/page.tsx            form pengajuan publik
  apply/success/page.tsx
  login/page.tsx             login staff (admin/approver)
  dashboard/
    admin/page.tsx           dashboard admin: stats + tabel + search + pagination
    admin/[id]/edit/page.tsx edit data pengajuan
    approver/page.tsx        approvals: filter + ubah status inline
  idcard/[id]/page.tsx        kartu ID cetak + QR
  api/applications/          route handler: submit, edit
lib/supabase/                 client Supabase (browser, server, middleware)
supabase/schema.sql            skema DB + RLS + storage bucket
```

## Catatan keamanan

- Semua akses tulis/baca data terlindungi lewat **Row Level Security** di
  Postgres (bukan cuma di kode), jadi lebih aman dibanding versi PHP yang
  sebelumnya menyimpan kredensial DB & akun staff hardcoded di file.
- Ganti password akun staff langsung dari Supabase Authentication kapan saja.
- Jangan commit file `.env.local` (sudah ada di `.gitignore`).
