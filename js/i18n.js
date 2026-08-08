// Utility bahasa ID/EN yang dipakai bareng di index.html & booking.html.
// Prinsipnya sama seperti js/ui-enhance.js: tidak ada build step, murni
// dictionary + DOM manipulation.
//
// - Teks statis di markup ditandai `data-i18n="key"` (atau
//   `data-i18n-placeholder="key"` untuk atribut placeholder input) —
//   applyTranslations() akan mengisi teksnya sesuai bahasa aktif.
// - Teks yang di-generate lewat JS (kartu unit, form booking, pesan
//   WhatsApp, dst) manggil t("key", {var: nilai}) langsung di template.
// - Ganti bahasa lewat setLang() akan menyimpan pilihan ke localStorage
//   dan menembak event "langchange" di window, supaya bagian yang
//   di-render dinamis (renderUnits, renderForm, dst) bisa ikut me-render
//   ulang dengan teks yang baru tanpa reload halaman.
const LANG_STORAGE_KEY = "rmj_lang";

const I18N = {
  id: {
    nav_home: "Beranda",
    nav_sewa: "Sewa",
    nav_login_vendor: "Login Vendor",
    search_placeholder: "Cari Mobil",

    hero_stat1_value: "Armada Terawat",
    hero_stat1_label: "Unit tahun muda &amp; siap jalan",
    hero_stat2_value: "Konfirmasi via WhatsApp",
    hero_stat2_label: "Cepat, tanpa perlu install app",
    hero_stat3_value: "Deposit Flat",
    hero_stat3_label: "Booking transparan, tanpa biaya siluman",

    catalog_eyebrow: "Katalog Unit",
    catalog_heading: "Sewa Kendaraan di Jogja, Tanpa Ribet",
    catalog_subtext:
      "Pilih unit, tentukan tanggal, lalu konfirmasi langsung lewat WhatsApp. Tidak perlu install aplikasi apapun.",

    fleet_heading: "Armada yang Tersedia",
    fleet_count: "Menampilkan <b style=\"color:var(--text-primary)\">{n}</b> unit",
    orang: "orang",
    price_self_drive: "Lepas kunci",
    price_with_driver: "Dengan sopir",
    unit_cta: "Sewa Sekarang",
    unit_empty: "Belum ada unit tersedia saat ini.",
    unit_fetch_error:
      "Tidak dapat mengambil data unit dari server. Pastikan js/supabase-client.js sudah diisi Project URL &amp; anon key.",

    footer_tagline:
      "Sewa mobil terpercaya di Jogja — lepas kunci atau dengan sopir.",
    footer_help: "Butuh bantuan? Hubungi admin lewat WhatsApp saat booking.",
    footer_rights: "Semua hak dilindungi.",

    back_link: "&larr; Kembali ke daftar unit",
    booking_eyebrow: "Konfirmasi Sewa",
    booking_heading: "Form Sewa Kendaraan",
    loading_unit: "Memuat data unit...",
    unit_not_found: "Unit tidak ditemukan.",
    load_error:
      "Gagal memuat data unit. Pastikan js/supabase-client.js sudah diisi dengan benar.",
    footer_help_booking:
      "Butuh bantuan? Admin akan membantu lewat WhatsApp setelah kamu klik tombol konfirmasi.",

    summary_capacity: "Kapasitas (lepas kunci)",
    summary_days: "Jumlah Hari",
    summary_price_per_day: "Harga per Hari",
    summary_deposit: "Deposit Booking",
    summary_total: "Total Bayar",
    summary_deposit_note:
      "Deposit dibayar di awal, sisa dilunasi saat serah terima.",

    form_header: "Detail Sewa &amp; Data Penyewa",
    section_mode_date: "Pilih Mode &amp; Tanggal",
    label_mode: "Mode Sewa",
    option_with_driver: "Dengan Sopir",
    option_self_drive: "Lepas Kunci",
    option_capacity: "kapasitas {n} orang",
    mode_note_self_drive: "Dihitung per blok 24 jam sejak waktu serah terima.",
    mode_note_with_driver: "Operasional per hari pukul {start}–{end}.",
    jaminan_note:
      "Untuk mode lepas kunci berlaku jaminan tambahan (dokumen/nominal akan diinfokan admin saat konfirmasi WhatsApp).",
    label_tgl_mulai: "Tanggal Mulai",
    label_tgl_selesai: "Tanggal Selesai",
    date_placeholder: "Pilih tanggal",

    section_data_penyewa: "Data Penyewa",
    label_nama: "Nama Lengkap",
    label_wa: "Nomor WhatsApp",
    label_penumpang: "Jumlah Penumpang",
    penumpang_max_note: "Maksimal {n} orang untuk mode ini.",
    penumpang_over_note: "Melebihi kapasitas — maksimal {n} orang untuk mode ini.",
    label_catatan: "Catatan (opsional)",
    submit_btn: "Konfirmasi &amp; Kirim ke WhatsApp",
    submit_btn_saving: "Menyimpan...",

    err_end_before_start: "Tanggal selesai harus setelah tanggal mulai.",
    warn_min_days: "Minimal sewa {n} hari — otomatis dihitung {n} hari.",
    err_unavailable_range: "Unit tidak tersedia pada rentang tanggal tersebut.",
    ok_available: "Unit tersedia pada tanggal tersebut.",
    days_suffix: "hari",

    err_incomplete: "Mohon lengkapi nama, WhatsApp, dan tanggal sewa.",
    err_unavailable_submit:
      "Unit sudah tidak tersedia pada tanggal tersebut. Silakan pilih tanggal lain.",
    err_over_capacity:
      "Jumlah penumpang melebihi kapasitas maksimal ({n} orang) untuk mode sewa ini.",
    err_save_failed:
      "Gagal menyimpan booking. Coba lagi atau hubungi admin langsung via WA.",
    success_saved:
      "Booking tersimpan! Klik tombol di bawah untuk mengirim konfirmasi ke admin via WhatsApp.",
    send_wa_btn: "Kirim Konfirmasi ke WhatsApp",

    wa_greeting: "Halo Admin {brand}, saya ingin konfirmasi booking:",
    wa_unit: "Unit",
    wa_mode: "Mode",
    wa_tanggal: "Tanggal",
    wa_sd: "s/d",
    wa_total: "Total",
    wa_deposit: "Deposit",
    wa_nama: "Nama",
    wa_wa: "WhatsApp",
    wa_penumpang: "Jumlah Penumpang",
    wa_catatan: "Catatan",
    wa_closing: "Mohon konfirmasi ketersediaan. Terima kasih.",
    wa_float_message:
      "Halo, saya ingin bertanya tentang sewa mobil di Rumah Mobil Jogja - Rental Mobil.",
    wa_float_label: "Chat WhatsApp",
  },
  en: {
    nav_home: "Home",
    nav_sewa: "Rent",
    nav_login_vendor: "Vendor Login",
    search_placeholder: "Search cars",

    hero_stat1_value: "Well-Maintained Fleet",
    hero_stat1_label: "Newer units, ready to drive",
    hero_stat2_value: "Confirm via WhatsApp",
    hero_stat2_label: "Fast, no app install needed",
    hero_stat3_value: "Flat Deposit",
    hero_stat3_label: "Transparent booking, no hidden fees",

    catalog_eyebrow: "Vehicle Catalog",
    catalog_heading: "Rent a Vehicle in Jogja, Hassle-Free",
    catalog_subtext:
      "Choose a vehicle, pick your dates, then confirm directly via WhatsApp. No app installation needed.",

    fleet_heading: "Available Fleet",
    fleet_count: "Showing <b style=\"color:var(--text-primary)\">{n}</b> vehicle(s)",
    orang: "people",
    price_self_drive: "Self-drive",
    price_with_driver: "With driver",
    unit_cta: "Book Now",
    unit_empty: "No vehicles available right now.",
    unit_fetch_error:
      "Unable to fetch vehicle data from the server. Make sure js/supabase-client.js has the Project URL &amp; anon key filled in.",

    footer_tagline:
      "Trusted car rental in Jogja — self-drive or with driver.",
    footer_help: "Need help? Contact admin via WhatsApp during booking.",
    footer_rights: "All rights reserved.",

    back_link: "&larr; Back to vehicle list",
    booking_eyebrow: "Confirm Rental",
    booking_heading: "Vehicle Rental Form",
    loading_unit: "Loading vehicle data...",
    unit_not_found: "Vehicle not found.",
    load_error:
      "Failed to load vehicle data. Make sure js/supabase-client.js is configured correctly.",
    footer_help_booking:
      "Need help? Admin will assist via WhatsApp after you click the confirm button.",

    summary_capacity: "Capacity (self-drive)",
    summary_days: "Number of Days",
    summary_price_per_day: "Price per Day",
    summary_deposit: "Booking Deposit",
    summary_total: "Total Payment",
    summary_deposit_note:
      "Deposit is paid upfront, the remainder is settled at handover.",

    form_header: "Rental Details &amp; Renter Info",
    section_mode_date: "Choose Mode &amp; Date",
    label_mode: "Rental Mode",
    option_with_driver: "With Driver",
    option_self_drive: "Self-Drive",
    option_capacity: "capacity {n} people",
    mode_note_self_drive: "Calculated per 24-hour block from handover time.",
    mode_note_with_driver: "Daily operating hours {start}–{end}.",
    jaminan_note:
      "An additional deposit applies for self-drive mode (documents/amount will be informed by admin upon WhatsApp confirmation).",
    label_tgl_mulai: "Start Date",
    label_tgl_selesai: "End Date",
    date_placeholder: "Select date",

    section_data_penyewa: "Renter Information",
    label_nama: "Full Name",
    label_wa: "WhatsApp Number",
    label_penumpang: "Number of Passengers",
    penumpang_max_note: "Maximum {n} people for this mode.",
    penumpang_over_note: "Exceeds capacity — maximum {n} people for this mode.",
    label_catatan: "Notes (optional)",
    submit_btn: "Confirm &amp; Send via WhatsApp",
    submit_btn_saving: "Saving...",

    err_end_before_start: "End date must be after the start date.",
    warn_min_days: "Minimum rental {n} days — automatically set to {n} days.",
    err_unavailable_range: "Vehicle is not available for that date range.",
    ok_available: "Vehicle is available for those dates.",
    days_suffix: "day(s)",

    err_incomplete: "Please fill in your name, WhatsApp number, and rental dates.",
    err_unavailable_submit:
      "Vehicle is no longer available for those dates. Please choose different dates.",
    err_over_capacity:
      "Passenger count exceeds the maximum capacity ({n} people) for this rental mode.",
    err_save_failed:
      "Failed to save booking. Please try again or contact admin directly via WhatsApp.",
    success_saved:
      "Booking saved! Click the button below to send a confirmation to admin via WhatsApp.",
    send_wa_btn: "Send Confirmation via WhatsApp",

    wa_greeting: "Hello {brand} Admin, I'd like to confirm my booking:",
    wa_unit: "Vehicle",
    wa_mode: "Mode",
    wa_tanggal: "Dates",
    wa_sd: "to",
    wa_total: "Total",
    wa_deposit: "Deposit",
    wa_nama: "Name",
    wa_wa: "WhatsApp",
    wa_penumpang: "Passenger Count",
    wa_catatan: "Notes",
    wa_closing: "Please confirm availability. Thank you.",
    wa_float_message:
      "Hello, I'd like to ask about renting a car at Rumah Mobil Jogja - Rental Mobil.",
    wa_float_label: "Chat on WhatsApp",
  },
};

function getLang() {
  return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "id";
}

function t(key, vars) {
  const dict = I18N[getLang()] || I18N.id;
  let str = dict[key] !== undefined ? dict[key] : I18N.id[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    });
  }
  return str;
}

function applyTranslations() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === getLang());
  });
}

function setLang(lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang === "en" ? "en" : "id");
  applyTranslations();
  window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: getLang() } }));
}

// Pasang tombol toggle ID/EN ke dalam elemen container (mis. sebuah <div>
// kosong di navbar) dan langsung terapkan terjemahan ke seluruh halaman.
function initLangSwitcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="lang-switch" role="group" aria-label="ID / EN">
      <button type="button" class="lang-switch-btn" data-lang="id">ID</button>
      <button type="button" class="lang-switch-btn" data-lang="en">EN</button>
    </div>`;
  container.querySelectorAll(".lang-switch-btn").forEach((btn) => {
    btn.onclick = () => setLang(btn.dataset.lang);
  });
  applyTranslations();
}
