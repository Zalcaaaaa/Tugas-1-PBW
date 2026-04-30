(function () {
  "use strict";

  const q = (s) => document.querySelector(s);
  const qa = (s) => document.querySelectorAll(s);

  function currentPage() {
    return location.pathname.split("/").pop();
  }

  function rupiah(n) {
    return "Rp " + Number(n).toLocaleString("id-ID");
  }

  const HARGA_BUKU = {
    ASIP4301: 135000,
    EKMA4216: 185000,
    EKMA4310: 145000, // Kepemimpinan
    BIOL4211: 195000,
    PAUD4401: 120000
  };

  function getHarga(kode) {
    return HARGA_BUKU[kode] || 150000;
  }

  function fixCover(path) {
    // dari "img/xxx.jpg" → "assets/img/xxx.jpg"
    return "assets/" + path.replace(/^\/?/, "");
  }


  function guardPages() {
    const page = currentPage();
    const protectedPages = [
      "dashboard.html",
      "stock.html",
      "tracking.html",
      "histori.html",
      "laporan.html"
    ];

    if (protectedPages.includes(page)) {
      if (typeof window.requireLogin === "function") {
        window.requireLogin();
      } else {
        location.href = "index.html";
      }
    }
  }

  function initLogin() {
    if (currentPage() !== "index.html") return;

    const form = q("#loginForm");
    const email = q("#email");
    const pass = q("#password");
    const error = q("#loginError");

    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      error.textContent = "";

      const user = window.dataPengguna.find(
        (u) => u.email === email.value.trim() && u.password === pass.value.trim()
      );

      if (!user) {
        error.textContent = "email atau password yang dimasukan salah";
        return;
      }

      window.setSession({
        id: user.id,
        nama: user.nama,
        role: user.role,
        lokasi: user.lokasi,
        email: user.email
      });

      location.href = "dashboard.html";
    });
  }


  function initNavbarAccount() {
    const user = window.getSession && window.getSession();
    if (!user) return;

    if (q("#navAccountName")) q("#navAccountName").textContent = user.nama;
    if (q("#accountName")) q("#accountName").textContent = user.nama;
    if (q("#accountRole")) q("#accountRole").textContent = user.role;

    const btn = q("#accountBtn");
    const menu = q("#accountMenu");

    if (btn && menu) {
      btn.onclick = () => menu.classList.toggle("show");
      document.onclick = (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove("show");
        }
      };
    }

    if (q("#logoutBtn")) q("#logoutBtn").onclick = window.logout;
    if (q("#logoutTopBtn")) q("#logoutTopBtn").onclick = window.logout;
  }


  function initDashboard() {
    if (currentPage() !== "dashboard.html") return;
    const user = window.getSession();
    if (!user) return;

    if (q("#welcomeName")) q("#welcomeName").textContent = user.nama;
    if (q("#welcomeRole")) q("#welcomeRole").textContent = user.role;
  }


  function initTracking() {
    if (currentPage() !== "tracking.html") return;

    const form = q("#trackingForm");
    const input = q("#resiInput");
    const error = q("#trackingError");
    const result = q("#trackingResult");

    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      error.textContent = "";
      result.hidden = true;
      result.innerHTML = "";

      const resi = input.value.trim();
      const data = window.dataTracking[resi];

      if (!data) {
        error.textContent = "Nomor Resi tidak di temukan";
        return;
      }

      let timeline = data.perjalanan.map(
        (p) => `<li><b>${p.waktu}</b><br>${p.keterangan}</li>`
      ).join("");

      result.innerHTML = `
        <h3>Status: ${data.status}</h3>
        <p><b>Nama:</b> ${data.nama}</p>
        <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
        <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
        <p><b>Total:</b> ${data.total}</p>
        <ul class="timeline">${timeline}</ul>
      `;
      result.hidden = false;
    });
  }


  function initStock() {
    if (currentPage() !== "stock.html") return;

    const grid = q("#catalogGrid");
    if (!grid) return;

    grid.innerHTML = "";

    window.dataBahanAjar.forEach((item) => {
      const card = document.createElement("div");
      card.className = "catalog-card";

      card.innerHTML = `
        <img class="catalog-cover" src="${fixCover(item.cover)}" alt="${item.namaBarang}">
        <div class="catalog-body">
          <h3 class="catalog-title">${item.namaBarang}</h3>
          <div class="catalog-meta">
            <span>Kode: ${item.kodeBarang}</span>
            <span>Stok: ${item.stok}</span>
            <span>Edisi: ${item.edisi}</span>
          </div>
          <div class="price-row">
            <span class="price">${rupiah(getHarga(item.kodeBarang))}</span>
            <span class="badge">${item.jenisBarang}</span>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }


  document.addEventListener("DOMContentLoaded", function () {
    guardPages();
    initLogin();
    initNavbarAccount();
    initDashboard();
    initTracking();
    initStock();
  });

})();
``