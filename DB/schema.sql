-- ============================================================
-- SCHEMA DATABASE — Jalankan ini di Supabase SQL Editor
-- (Project kamu > SQL Editor > New Query > paste semua ini > Run)
-- ============================================================

-- ============================================================
-- 1. TABEL UNITS (Data kendaraan dari vendor)
-- ============================================================
create table units (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references auth.users(id) on delete set null,
  brand text not null,
  model text,
  tahun int not null,
  transmisi text not null check (transmisi in ('Manual', 'Matic')),
  kapasitas int not null, -- kapasitas dasar (lepas kunci)
  harga_lepas_kunci int not null,
  harga_dengan_sopir int not null,
  foto_depan text,
  foto_samping text,
  foto_dashboard text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'published', 'suspended')),
  vendor_nama text not null,
  vendor_whatsapp text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column units.kapasitas is 'Kapasitas mode lepas kunci. Mode dengan sopir = kapasitas - 1 (dihitung otomatis di frontend).';

-- ============================================================
-- 2. TABEL BLACKOUT_DATES (Tanggal unit tidak tersedia)
--    Diisi vendor secara manual setelah konfirmasi booking via WA,
--    atau untuk servis/keperluan pribadi unit.
-- ============================================================
create table blackout_dates (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  alasan text,
  created_at timestamptz default now(),
  check (tanggal_selesai >= tanggal_mulai)
);

-- ============================================================
-- 3. TABEL BOOKINGS (Data booking dari customer)
--    Status "menunggu_konfirmasi" murni informasional untuk vendor;
--    tanggal BARU dianggap unavailable setelah vendor input blackout_dates.
-- ============================================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  mode_sewa text not null check (mode_sewa in ('self_drive', 'with_driver')),
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  jumlah_hari int not null,
  total_harga int not null,
  deposit int not null default 200000,
  nama_customer text not null,
  whatsapp_customer text not null,
  jumlah_penumpang int,
  catatan text,
  status text not null default 'menunggu_konfirmasi'
    check (status in ('menunggu_konfirmasi', 'dikonfirmasi', 'ditolak', 'selesai')),
  created_at timestamptz default now(),
  check (tanggal_selesai >= tanggal_mulai)
);

-- ============================================================
-- 4. TABEL VENDOR_PROFILES (opsional, hubungkan auth.users -> nama vendor)
--    Dibuat manual oleh admin di fase MVP karena vendor masih
--    jaringan pribadi (belum ada self-signup).
-- ============================================================
create table vendor_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  whatsapp text not null,
  role text not null default 'vendor' check (role in ('vendor', 'admin')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table units enable row level security;
alter table blackout_dates enable row level security;
alter table bookings enable row level security;
alter table vendor_profiles enable row level security;

-- --- UNITS ---
-- Publik boleh baca unit yang sudah published (untuk index.html / booking.html)
create policy "Publik bisa lihat unit published"
  on units for select
  using (status = 'published');

-- Vendor yang login boleh lihat unit miliknya sendiri (termasuk yang masih pending)
create policy "Vendor bisa lihat unit miliknya"
  on units for select
  using (auth.uid() = vendor_id);

-- Vendor yang login boleh menambah unit atas namanya sendiri
create policy "Vendor bisa tambah unit"
  on units for insert
  with check (auth.uid() = vendor_id);

-- Vendor yang login boleh update unit miliknya sendiri
create policy "Vendor bisa update unit miliknya"
  on units for update
  using (auth.uid() = vendor_id);

-- Vendor yang login boleh hapus unit miliknya sendiri
create policy "Vendor bisa hapus unit miliknya"
  on units for delete
  using (auth.uid() = vendor_id);

-- --- BLACKOUT_DATES ---
-- Publik boleh baca semua blackout date (dipakai untuk cek ketersediaan di booking.html)
create policy "Publik bisa lihat blackout dates"
  on blackout_dates for select
  using (true);

-- Hanya vendor pemilik unit terkait yang boleh menambah blackout date
create policy "Vendor bisa tambah blackout unit miliknya"
  on blackout_dates for insert
  with check (
    exists (
      select 1 from units
      where units.id = blackout_dates.unit_id
      and units.vendor_id = auth.uid()
    )
  );

-- Hanya vendor pemilik unit terkait yang boleh hapus blackout date
create policy "Vendor bisa hapus blackout unit miliknya"
  on blackout_dates for delete
  using (
    exists (
      select 1 from units
      where units.id = blackout_dates.unit_id
      and units.vendor_id = auth.uid()
    )
  );

-- --- BOOKINGS ---
-- Publik (customer, tanpa login) boleh membuat booking baru
create policy "Publik bisa membuat booking"
  on bookings for insert
  with check (true);

-- Hanya vendor pemilik unit terkait yang boleh melihat booking masuk
create policy "Vendor bisa lihat booking unit miliknya"
  on bookings for select
  using (
    exists (
      select 1 from units
      where units.id = bookings.unit_id
      and units.vendor_id = auth.uid()
    )
  );

-- Hanya vendor pemilik unit terkait yang boleh update status booking
create policy "Vendor bisa update booking unit miliknya"
  on bookings for update
  using (
    exists (
      select 1 from units
      where units.id = bookings.unit_id
      and units.vendor_id = auth.uid()
    )
  );

-- --- VENDOR_PROFILES ---
-- Vendor hanya boleh melihat & mengubah profilnya sendiri
create policy "Vendor bisa lihat profil sendiri"
  on vendor_profiles for select
  using (auth.uid() = id);

create policy "Vendor bisa update profil sendiri"
  on vendor_profiles for update
  using (auth.uid() = id);

-- Catatan: pembuatan baris vendor_profiles untuk vendor baru dilakukan
-- manual oleh admin lewat Table Editor Supabase di fase MVP ini
-- (karena vendor masih terbatas jaringan pribadi, belum ada self-signup).
