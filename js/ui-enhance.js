// Ganti tampilan <select> native jadi dropdown custom bertema dark, supaya
// panel opsinya tidak ikut warna default browser/OS (yang tidak bisa
// di-styling lintas platform lewat CSS biasa).
//
// `select` aslinya TETAP ADA di DOM (cuma disembunyikan visual), jadi semua
// kode yang sudah ada — select.value, select.onchange, select.innerHTML — di
// halaman manapun tetap jalan apa adanya. Dropdown ini murni lapisan
// tampilan di atasnya:
//   - enhanceSelect(select) dipanggil sekali untuk memasang UI custom-nya.
//   - Kalau opsi select diganti belakangan (mis. `select.innerHTML = ...`
//     buat isi ulang daftar unit), panggil enhanceSelect(select) lagi —
//     aman dipanggil berkali-kali, panggilan kedua+ cuma me-refresh opsi.
function enhanceSelect(select) {
  if (!select) return;

  if (select.dataset.enhanced) {
    if (select._enhancedRefresh) select._enhancedRefresh();
    return;
  }
  select.dataset.enhanced = "true";
  select.tabIndex = -1;

  const wrap = document.createElement("div");
  wrap.className = "custom-select";
  if (select.classList.contains("form-control-sm")) {
    wrap.classList.add("custom-select-sm");
  }
  if (select.style.maxWidth) {
    wrap.style.maxWidth = select.style.maxWidth;
  }

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.innerHTML = `
    <span class="custom-select-label"></span>
    <svg class="custom-select-chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>`;

  const panel = document.createElement("div");
  panel.className = "custom-select-panel";

  function syncFromSelect() {
    const selected = select.options[select.selectedIndex];
    trigger.querySelector(".custom-select-label").textContent = selected
      ? selected.textContent
      : "";
    panel.querySelectorAll(".custom-select-option").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.value === select.value);
    });
  }

  function renderOptions() {
    panel.innerHTML = "";
    Array.from(select.options).forEach((opt) => {
      const item = document.createElement("div");
      item.className = "custom-select-option";
      item.textContent = opt.textContent;
      item.dataset.value = opt.value;
      item.tabIndex = 0;
      item.onclick = () => choose(opt.value);
      item.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          choose(opt.value);
        }
      };
      panel.appendChild(item);
    });
    syncFromSelect();
  }

  function choose(value) {
    select.value = value;
    select.dispatchEvent(new Event("change"));
    syncFromSelect();
    closePanel();
    trigger.focus();
  }

  // Panel pakai position:fixed supaya lolos dari overflow:hidden milik
  // ancestor (mis. .card) — posisinya dihitung manual dari posisi trigger
  // di viewport, lalu dibuka ke atas kalau ruang di bawah tidak cukup.
  function positionPanel() {
    const rect = trigger.getBoundingClientRect();
    const panelHeight = Math.min(panel.scrollHeight || 260, 260);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < panelHeight + 12 && spaceAbove > spaceBelow;

    panel.style.left = rect.left + "px";
    panel.style.width = rect.width + "px";
    if (openUpward) {
      panel.style.top = "";
      panel.style.bottom = window.innerHeight - rect.top + 6 + "px";
    } else {
      panel.style.bottom = "";
      panel.style.top = rect.bottom + 6 + "px";
    }
  }

  function openPanel() {
    positionPanel();
    wrap.classList.add("is-open");
    panel.classList.add("is-open");
    document.addEventListener("click", onOutsideClick);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("scroll", closePanel, true);
    window.addEventListener("resize", closePanel);
  }
  function closePanel() {
    wrap.classList.remove("is-open");
    panel.classList.remove("is-open");
    document.removeEventListener("click", onOutsideClick);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("scroll", closePanel, true);
    window.removeEventListener("resize", closePanel);
  }
  function onOutsideClick(e) {
    if (!wrap.contains(e.target) && !panel.contains(e.target)) closePanel();
  }
  function onKeydown(e) {
    if (e.key === "Escape") {
      closePanel();
      trigger.focus();
    }
  }

  trigger.onclick = (e) => {
    e.stopPropagation();
    if (wrap.classList.contains("is-open")) {
      closePanel();
    } else {
      openPanel();
    }
  };

  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(trigger);
  wrap.appendChild(panel);
  select.classList.add("custom-select-native");
  wrap.appendChild(select);

  renderOptions();
  select._enhancedRefresh = renderOptions;
}
