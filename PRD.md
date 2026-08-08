# PRD — Platform Booking Rental Kendaraan DIY Yogyakarta

**Versi:** 0.1 (Draft MVP)
**Tanggal:** 8 Agustus 2026
**Pemilik Produk:** Tito
**Status:** Draft — beberapa keputusan masih terbuka (lihat Bagian 10)

---

## 1. Latar Belakang & Masalah

Wisatawan yang datang ke Daerah Istimewa Yogyakarta (DIY) butuh kendaraan (motor/mobil, self-drive atau dengan sopir) untuk mobilitas selama liburan. Proses sewa kendaraan yang umum saat ini biasanya:

- Manual lewat chat WhatsApp tanpa katalog yang jelas → calon penyewa harus tanya satu-satu ke vendor.
- Tidak ada sistem ketersediaan (availability) yang transparan → rawan booking tumpang tindih (double booking).
- Vendor individu (teman/keluarga pemilik) belum punya cara mudah untuk memajang unit dan mengelola tanggal kosong/terisi.

Tito ingin membangun platform booking sederhana yang **menjembatani katalog unit + ketersediaan + konfirmasi**, tanpa membangun ulang proses pembayaran atau customer service — WhatsApp tetap jadi kanal komunikasi akhir.

## 2. Tujuan Produk

1. Memungkinkan calon penyewa **melihat katalog unit kendaraan** (motor/mobil) beserta harga self-drive dan dengan-sopir, tanpa perlu install aplikasi.
2. Mengarahkan calon penyewa untuk **melakukan booking** dengan mengisi form sederhana, lalu sistem meneruskan detail booking ke WhatsApp admin secara otomatis (pre-filled message).
3. Memberi **vendor (jaringan pribadi Tito)** panel sederhana untuk input unit, atur tanggal blackout (tidak tersedia), dan memantau booking masuk.
4. Mencapai **MVP yang bisa live cepat**, di atas infrastruktur _free-tier_ (Vercel + Supabase), tanpa biaya API berbayar.

### Tujuan eksplisit yang BUKAN cakupan MVP

- Pembayaran online/payment gateway terintegrasi.
- Verifikasi legal vendor (STNK, asuransi) — ditunda sampai fase setelah MVP saat vendor eksternal (bukan jaringan pribadi) mulai bergabung.
- Aplikasi mobile native.
- Sistem rating/review publik.

## 3. Target Pengguna

| Peran                          | Deskripsi                                             | Kebutuhan Utama                                              |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| **Wisatawan (Penyewa)**        | Turis domestik/asing yang berkunjung ke DIY           | Cari unit, cek harga & ketersediaan, booking cepat tanpa app |
| **Vendor (Pemilik Kendaraan)** | Teman/keluarga Tito yang menyewakan kendaraan pribadi | Pasang unit, atur availability, lihat booking masuk          |
| **Admin (Tito)**               | Pengelola platform, penerima konfirmasi WhatsApp      | Verifikasi booking manual via WA, kontrol keseluruhan sistem |

Catatan: Pada MVP, vendor = jaringan pribadi Tito → tidak perlu proses verifikasi legal formal maupun sistem autentikasi vendor yang kompleks.

## 4. Alur Pengguna Utama (User Flow)

### 4.1 Alur Penyewa

1. Buka `index.html` → lihat daftar unit (foto 3-sudut standar, merek, tahun, transmisi, kapasitas, harga self-drive & dengan-sopir).
2. Pilih unit → masuk ke `booking.html`.
3. Pilih mode sewa: **self-drive** atau **dengan sopir**.
   - Self-drive → hitung durasi per blok 24 jam, minimum 2 hari.
   - Dengan sopir → hitung durasi per hari operasional 05:00–22:00, minimum 2 hari.
   - Kapasitas otomatis berkurang 1 kursi jika pilih mode dengan sopir.
4. Pilih tanggal (sistem cek ketersediaan berdasarkan blackout date yang diinput vendor).
5. Isi data diri singkat.
6. Sistem tampilkan ringkasan biaya: harga sewa + **deposit flat Rp200.000** (deposit hanya berlaku untuk self-drive).
7. Klik tombol booking → sistem generate pesan WhatsApp otomatis (via `wa.me`) berisi ringkasan booking, terkirim ke nomor admin **628118368982**.
8. Penyewa lanjutkan konfirmasi & pembayaran deposit langsung dengan admin di WhatsApp (di luar sistem).

### 4.2 Alur Vendor

1. Login/masuk ke `vendor-dashboard.html`.
2. Input unit baru: merek, tahun, transmisi, kapasitas, foto (3 sudut standar), harga self-drive, harga dengan-sopir.
3. Atur **blackout dates** (tanggal unit tidak tersedia) — sistem otomatis menurunkan ketersediaan dari sini (bukan input manual kalender penuh).
4. Lihat daftar booking pending yang masuk untuk unit-unitnya.

### 4.3 Alur Admin

1. Menerima pesan booking via WhatsApp (`wa.me` click-to-chat, tanpa API berbayar).
2. Konfirmasi manual ke penyewa & vendor terkait.
3. (Opsional/masa depan) update status booking di dashboard.

## 5. Cakupan Fitur MVP

### 5.1 Wajib Ada (Must Have)

- [x] Halaman listing unit (`index.html`)
- [x] Halaman booking dengan kalkulasi harga & durasi otomatis (`booking.html`)
- [x] Dashboard vendor: input unit, kelola blackout date, lihat booking pending (`vendor-dashboard.html`)
- [x] Integrasi WhatsApp click-to-chat (pesan otomatis terisi, tanpa API berbayar)
- [x] Skema database Postgres dengan Row Level Security (`schema.sql`)
- [x] Minimum sewa 2 hari, dengan logika hitung hari berbeda per mode
- [x] Pengurangan kapasitas otomatis (-1 kursi) saat mode dengan sopir dipilih
- [x] Deposit flat Rp200.000 untuk mode self-drive

### 5.2 Belum Diputuskan (Perlu Keputusan Sebelum Launch — lihat Bagian 10)

- [ ] Metode pembayaran deposit & pelunasan
- [ ] Kebijakan pembatalan & refund
- [ ] Nominal jaminan/deposit tambahan untuk self-drive (selain Rp200.000?)

### 5.3 Di Luar Cakupan MVP (Future / Out of Scope)

- Supabase Auth penuh untuk vendor eksternal (di luar jaringan pribadi)
- Proses verifikasi legal vendor (STNK, asuransi)
- Payment gateway terintegrasi
- Aplikasi native / PWA installable
- Multi-bahasa (saat ini bahasa Indonesia)

## 6. Model Data (Ringkasan)

Mengacu ke `schema.sql` yang sudah dibuat:

- **Unit**: merek, tahun, transmisi, kapasitas dasar, foto (3 sudut standar), harga self-drive, harga dengan-sopir, vendor_id
- **Blackout Date**: unit_id, tanggal mulai, tanggal selesai (dipakai untuk derive availability — bukan tabel availability manual)
- **Booking**: unit_id, penyewa (nama, kontak), mode (self-drive/dengan-sopir), tanggal mulai & selesai, status (pending/confirmed/cancelled), total harga, deposit
- **Vendor**: identitas pemilik unit (belum ada verifikasi legal di MVP)

Row Level Security (RLS) diterapkan agar vendor hanya bisa mengelola unit miliknya sendiri.

## 7. Ketentuan Bisnis Kunci

| Aturan                     | Detail                                         |
| -------------------------- | ---------------------------------------------- |
| Minimum sewa               | 2 hari                                         |
| Hitung hari — self-drive   | Blok 24 jam                                    |
| Hitung hari — dengan sopir | Jam operasional 05:00–22:00 per hari           |
| Deposit                    | Flat Rp200.000, dibayar di muka                |
| Pelunasan                  | Saat serah terima kendaraan (handover)         |
| Berlaku deposit            | Hanya mode self-drive                          |
| Pengurangan kapasitas      | -1 kursi otomatis jika pilih mode dengan sopir |

## 8. Non-Functional Requirements

- **Tanpa instalasi aplikasi** — seluruh alur berjalan di browser (mobile-friendly).
- **Biaya operasional Rp0** di fase MVP — seluruh infrastruktur di tier gratis (Vercel + Supabase) dan WhatsApp non-API (`wa.me`).
- **Bahasa**: Indonesia (UI dan komunikasi).
- **Deploy**: GitHub → Vercel (CI/CD sederhana, sudah didokumentasikan di `README.md`).
- Keamanan data dasar: RLS Supabase aktif, tiga checkbox keamanan Data API Supabase dicentang semua di fase MVP (sesuai rekomendasi sebelumnya).

## 9. Metrik Keberhasilan (Success Metrics) — Usulan Awal

_(Perlu divalidasi oleh Tito, ini masih asumsi awal karena belum ada data historis)_

- Jumlah booking request yang berhasil diteruskan ke WhatsApp per bulan.
- Jumlah unit aktif dari vendor jaringan pribadi.
- Rasio booking pending → confirmed (menunjukkan seberapa baik proses manual admin berjalan).
- Tidak ada kasus double-booking (validasi sistem blackout date bekerja).

## 10. Pertanyaan Terbuka & Keputusan Tertunda

Ini adalah item dari to-do list yang **masih harus diputuskan sebelum go-live**, dan sengaja tidak diasumsikan di PRD ini:

1. **Metode pembayaran** — transfer bank manual? QRIS? Siapa yang menerima dana deposit (Tito langsung atau per-vendor)?
2. **Kebijakan pembatalan & refund** — berapa lama sebelum tanggal sewa pembatalan masih dapat refund, dan berapa persen?
3. **Nominal jaminan/deposit self-drive** — apakah Rp200.000 sudah final sebagai satu-satunya jaminan, atau ada deposit tambahan berbasis nilai kendaraan?
4. **Kapan menambahkan Supabase Auth** — trigger untuk mulai membuka platform ke vendor di luar jaringan pribadi.
5. **Proses verifikasi legal vendor** (STNK, asuransi) — bentuk prosesnya seperti apa saat scaling.

> Catatan: Saya sengaja tidak mengisi asumsi untuk kelima poin di atas karena ini keputusan bisnis yang berdampak langsung ke risiko finansial dan legal — sebaiknya diputuskan sadar oleh Tito, bukan ditebak oleh saya.

## 11. Risiko & Mitigasi Awal

| Risiko                                              | Dampak                                                   | Mitigasi Usulan                                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Double booking jika blackout date tidak konsisten   | Penyewa kecewa, reputasi turun                           | Validasi ketersediaan real-time saat booking submit, bukan hanya saat render halaman                                      |
| Ketergantungan penuh pada `wa.me` (tanpa API resmi) | Tidak ada tracking otomatis status pesan terkirim/dibaca | Diterima sebagai trade-off MVP demi biaya Rp0; evaluasi ulang saat volume naik                                            |
| Vendor jaringan pribadi tanpa verifikasi legal      | Risiko hukum jika kendaraan bermasalah (STNK/asuransi)   | Dibatasi eksplisit hanya untuk jaringan pribadi Tito di fase MVP; wajib ada proses verifikasi sebelum buka ke vendor umum |
| Free-tier Supabase/Vercel ada limit                 | Platform down jika traffic melonjak                      | Pantau usage dashboard, siapkan rencana upgrade tier jika mendekati limit                                                 |

## 12. Inventaris Unit Awal (Lampiran)

Unit mobil yang sudah tersedia dari jaringan pribadi Tito untuk fase MVP:

| Merek & Model        | Tahun | Transmisi     | Kapasitas     | Harga Self-Drive | Harga Dengan Sopir | Foto (3 sudut) |
| -------------------- | ----- | ------------- | ------------- | ---------------- | ------------------ | -------------- |
| Toyota Kijang Innova | 2014  | _belum diisi_ | _belum diisi_ | _belum diisi_    | _belum diisi_      | _belum ada_    |
| Toyota Avanza        | 2016  | _belum diisi_ | _belum diisi_ | _belum diisi_    | _belum diisi_      | _belum ada_    |
| Toyota Avanza Veloz  | 2019  | _belum diisi_ | _belum diisi_ | _belum diisi_    | _belum diisi_      | _belum ada_    |

> Catatan: Sesuai skema (`schema.sql`) dan spesifikasi unit di Bagian 6, kelima kolom kosong di atas wajib diisi sebelum unit bisa ditayangkan di `index.html`. Kapasitas yang dicatat di sini harus kapasitas **dasar** (mode self-drive) — sistem akan otomatis mengurangi 1 kursi saat mode dengan sopir dipilih, jadi jangan masukkan kapasitas yang sudah dikurangi manual.
>
> Perlu dikonfirmasi juga: apakah ketiga mobil ini transmisi matic semua (umum untuk Avanza/Innova keluaran tahun tersebut), atau ada yang manual? Ini memengaruhi filter/tampilan di halaman listing.

---

**Lampiran teknis yang sudah tersedia di repo:**
`index.html`, `booking.html`, `vendor-dashboard.html`, `schema.sql`, `css/style.css`, `js/supabase-client.js`, `README.md`, `todo-booking-rental-yogya.md`, `mock-up-opsi2-availability.md`
