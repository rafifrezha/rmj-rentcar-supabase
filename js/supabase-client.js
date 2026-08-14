// ============================================================
// KONEKSI SUPABASE — dipakai di semua halaman
// ============================================================
// Cara dapat nilai ini:
// 1. Buka project kamu di supabase.com
// 2. Masuk ke Project Settings > API
// 3. Copy "Project URL" dan "anon public" key
// 4. Paste di bawah, ganti dua baris SUPABASE_URL & SUPABASE_ANON_KEY
//
// CATATAN KEAMANAN:
// anon key ini MEMANG boleh terlihat di HTML publik — itu wajar untuk
// arsitektur Supabase. Keamanan data diatur lewat Row Level Security
// (RLS) di database, BUKAN dengan menyembunyikan key ini.
// Pastikan RLS aktif di semua tabel (sudah diatur di schema.sql)
// sebelum ada data customer asli masuk.
// ============================================================

const SUPABASE_URL = "https://jrqycppahititmtwvdoq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycXljcHBhaGl0aXRtdHd2ZG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTAxNjMsImV4cCI6MjEwMTA2NjE2M30.6_AuyFZlCAnLN4rkdBtfeGDM7lQJTHvEhrK1bddD6sM";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ============================================================
// KONFIGURASI UMUM PLATFORM
// ============================================================
const ADMIN_WHATSAPP = "628118368982"; // format: 62 + nomor tanpa 0 di depan
const DEPOSIT_FLAT = 200000; // deposit flat, dibayar di awal, sisanya saat handover
const MIN_RENTAL_DAYS = 2; // minimal sewa 2 hari
const DRIVER_WINDOW_START = "05:00";
const DRIVER_WINDOW_END = "22:00";

// ============================================================
// HELPER: format Rupiah
// ============================================================
function formatRupiah(angka) {
  return "Rp" + Number(angka || 0).toLocaleString("id-ID");
}

// ============================================================
// HELPER: hitung jumlah hari sewa sesuai mode
// - self_drive: dihitung per blok 24 jam (tanggal mulai s/d tanggal
//   selesai inklusif, minimal MIN_RENTAL_DAYS)
// - with_driver: dihitung per hari kalender dalam window 05:00-22:00,
//   minimal MIN_RENTAL_DAYS
// ============================================================
function hitungJumlahHari(tanggalMulai, tanggalSelesai) {
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);
  const selisihHari = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(MIN_RENTAL_DAYS, selisihHari);
}

// ============================================================
// HELPER: format Date -> "YYYY-MM-DD" pakai komponen lokal (hindari
// pergeseran tanggal akibat konversi UTC dari toISOString()).
// ============================================================
function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayLocal() {
  return formatDateLocal(new Date());
}

// ============================================================
// HELPER: format tanggal "YYYY-MM-DD" -> "21 Agu 2026" (lebih enak
// dibaca daripada format ISO mentah, dipakai di tabel admin dkk.)
// ============================================================
const BULAN_PENDEK_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];
function formatTanggalIndo(tanggalStr) {
  if (!tanggalStr) return "-";
  const d = new Date(tanggalStr + "T00:00:00");
  if (isNaN(d)) return tanggalStr;
  return `${d.getDate()} ${BULAN_PENDEK_ID[d.getMonth()]} ${d.getFullYear()}`;
}

// ============================================================
// HELPER: bangun link wa.me dengan pesan sudah terisi
// ============================================================
function buildWhatsAppLink(pesan) {
  const encoded = encodeURIComponent(pesan);
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encoded}`;
}
