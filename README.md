# RMJ RentCar — Sewa Kendaraan Jogja (MVP)

Versi ini adalah adaptasi dari desain frontend RMJ RentCar, dengan alur dan
backend yang diganti total mengikuti rencana platform booking tanpa aplikasi:

- **Tidak ada login untuk customer** — langsung pilih unit, isi tanggal, submit,
  lalu konfirmasi ke admin via WhatsApp (wa.me link, gratis, tanpa API berbayar)
- **Login hanya untuk vendor/admin** (Supabase Auth), untuk kelola unit,
  tanggal tidak tersedia, dan booking masuk
- **Backend: Supabase** (Postgres + Auth + Storage, free tier) — bukan lagi
  Express/MySQL/Google Cloud Run seperti versi sebelumnya
- **Hosting: Vercel** (free tier, static site, tidak perlu build command)

## Struktur Project
```
/index.html              → Landing publik, daftar unit tersedia
/booking.html             → Pilih tanggal & mode sewa, submit + kirim WA
/login.html                → Login vendor/admin (Supabase Auth), redirect otomatis sesuai role
/vendor-dashboard.html      → Kelola unit MILIK SENDIRI, blackout date, booking masuk unit sendiri
/admin-dashboard.html       → Kelola SEMUA unit dari semua vendor + SEMUA booking, ubah status
/css/style.css
/js/supabase-client.js      → Konfigurasi koneksi Supabase + konstanta platform
/schema.sql                 → Struktur database + RLS, jalankan ini duluan
/admin-schema.sql           → RLS tambahan untuk role admin, jalankan SETELAH schema.sql
/assets/                    → Logo, banner, background (dari project asli)
```

## Vendor vs Admin
- **Vendor**: hanya bisa lihat & kelola unit miliknya sendiri (`vendor-dashboard.html`), lewat RLS `auth.uid() = vendor_id`.
- **Admin**: role `admin` di `vendor_profiles`, bisa lihat & kelola **semua** unit dan **semua** booking dari seluruh vendor (`admin-dashboard.html`), termasuk input kendaraan baru langsung dari admin (tidak terikat akun vendor manapun — cukup isi nama & WhatsApp pemilik sebagai catatan).
- `login.html` otomatis mengarahkan ke dashboard yang sesuai berdasarkan `role` setelah login berhasil.

## Aturan Bisnis yang Sudah Diterapkan di Kode
- Minimal sewa **2 hari** (`MIN_RENTAL_DAYS` di `js/supabase-client.js`)
- Mode **lepas kunci**: dihitung per blok 24 jam; kapasitas penuh
- Mode **dengan sopir**: operasional 05:00–22:00; kapasitas otomatis −1 kursi
- Deposit booking flat **Rp200.000**, sisa dilunasi saat serah terima
- Nomor WA admin: `628118368982` (ganti di `ADMIN_WHATSAPP` bila perlu)

## ⚠️ Yang Masih Perlu Kamu Putuskan (belum difinalisasi di kode)
Sesuai catatan to-do sebelumnya, poin-poin ini sengaja saya beri catatan
placeholder di `booking.html`, **bukan angka pasti**, supaya tidak salah info
ke customer:
1. **Nominal jaminan tambahan untuk mode lepas kunci** — saat ini hanya
   muncul teks "akan diinfokan admin saat konfirmasi WA". Begitu kamu putuskan
   nominal/bentuk jaminannya (uang tunai, KTP asli, dll), saya bisa update
   teksnya jadi pasti.
2. **Metode pembayaran** deposit (transfer manual? QRIS?) — belum ada di alur,
   saat ini murni informasi WA.
3. **Kebijakan pembatalan/refund** — belum ada logika atau teks di sistem.

## Langkah Setup

### 1. Buat project Supabase
- Daftar di supabase.com → buat project baru (free plan)
- Saat membuat project, centang semua opsi keamanan Data API (Enable Data API,
  Automatically expose new tables, Enable automatic RLS)
- Masuk **SQL Editor** → New Query → paste seluruh isi `schema.sql` → Run
- Lanjut New Query lagi → paste seluruh isi `admin-schema.sql` → Run (menambahkan
  akses penuh untuk role `admin`, dipakai oleh `admin-dashboard.html`)

### 2. Buat Storage Bucket untuk foto unit
- Masuk **Storage** → buat bucket baru bernama `foto-unit`, set **public**

### 3. Isi kredensial di `js/supabase-client.js`
- Masuk **Project Settings > API** → copy `Project URL` dan `anon public key`
- Paste ke `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `js/supabase-client.js`

### 4. Buat akun vendor/admin pertama
Karena fase MVP ini vendor masih jaringan pribadi (belum ada self-signup):
1. Masuk **Authentication > Users** di Supabase → **Add user** → isi email + password
2. Masuk **Table Editor > vendor_profiles** → tambah baris baru:
   - `id` = user id yang baru dibuat (copy dari langkah sebelumnya)
   - `nama` = nama vendor/admin
   - `whatsapp` = nomor WA vendor (format `62...`)
   - `role` = `admin` atau `vendor`

### 5. Push ke GitHub, deploy ke Vercel
```bash
git init
git add .
git commit -m "Adaptasi RMJ RentCar ke Supabase + booking via WhatsApp"
git remote add origin <url-repo-github-kamu>
git push -u origin main
```
Di vercel.com: **Add New Project** → import repo ini → **Deploy**
(Framework Preset: **Other**, tanpa build command, karena ini HTML statis).

### 6. Testing sebelum go-live
- [ ] Login ke `login.html` pakai akun vendor yang dibuat di langkah 4
- [ ] Tambah 1 unit lewat `vendor-dashboard.html`, cek foto ter-upload
- [ ] Ubah status unit itu ke `published` lewat Table Editor Supabase
- [ ] Cek unit muncul di `index.html`
- [ ] Coba booking dari `booking.html`, cek data masuk ke tabel `bookings`
- [ ] Cek tombol WhatsApp membuka chat dengan pesan otomatis terisi
- [ ] Tandai booking "dikonfirmasi" di dashboard, cek blackout date otomatis
      ditambahkan dan tanggal itu jadi tidak tersedia di `booking.html`

## Perbedaan dari Kode Asli (RMJ RentCar / Cloud Run)
| Aspek | Versi Asli | Versi Ini |
|---|---|---|
| Backend | Express + MySQL (Sequelize), Google Cloud Run | Supabase (Postgres + Auth + Storage) |
| Login customer | Wajib | Dihapus — langsung booking |
| Konfirmasi | Disimpan di DB, tanpa notifikasi otomatis | wa.me link ke admin, pesan otomatis terisi |
| Hosting | Docker/Cloud Build ke Cloud Run | Vercel (static, free tier) |
| Desain visual | Dipertahankan (navbar, warna, logo, kartu) | Dipertahankan |
