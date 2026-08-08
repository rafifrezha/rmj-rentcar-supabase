-- ============================================================
-- ADMIN RLS POLICIES — Jalankan ini SETELAH schema.sql
-- (Project kamu > SQL Editor > New Query > paste semua ini > Run)
--
-- Tujuan: user dengan role = 'admin' di vendor_profiles bisa
-- lihat & kelola SEMUA unit dan SEMUA booking (bukan cuma milik
-- sendiri seperti vendor biasa), dipakai oleh admin-dashboard.html.
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: is_admin()
-- Dipakai di semua policy admin di bawah. Pakai SECURITY DEFINER
-- supaya query ke vendor_profiles di dalam fungsi ini tidak
-- kena RLS berulang (hindari infinite recursion kalau dipanggil
-- dari policy vendor_profiles sendiri).
-- ============================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from vendor_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- UNITS — admin bisa lihat/tambah/update/hapus unit siapa saja
-- ============================================================
create policy "Admin bisa lihat semua unit"
  on units for select
  using (is_admin());

create policy "Admin bisa tambah unit apa saja"
  on units for insert
  with check (is_admin());

create policy "Admin bisa update unit apa saja"
  on units for update
  using (is_admin());

create policy "Admin bisa hapus unit apa saja"
  on units for delete
  using (is_admin());

-- ============================================================
-- BLACKOUT_DATES — admin bisa tambah/hapus untuk unit apa saja
-- (select sudah publik di schema.sql, tidak perlu policy baru)
-- ============================================================
create policy "Admin bisa tambah blackout apa saja"
  on blackout_dates for insert
  with check (is_admin());

create policy "Admin bisa hapus blackout apa saja"
  on blackout_dates for delete
  using (is_admin());

-- ============================================================
-- BOOKINGS — admin bisa lihat & update status booking apa saja
-- ============================================================
create policy "Admin bisa lihat semua booking"
  on bookings for select
  using (is_admin());

create policy "Admin bisa update booking apa saja"
  on bookings for update
  using (is_admin());

-- ============================================================
-- VENDOR_PROFILES — admin bisa lihat semua akun vendor/admin
-- ============================================================
create policy "Admin bisa lihat semua vendor profile"
  on vendor_profiles for select
  using (is_admin());
