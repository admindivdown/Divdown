// ======================================
// APP.JS RUMAH 1 - FINAL STABIL & CACHE AMAN
// ======================================

/* --- FUNGSI KOORDINATOR MENU --- */
function tutupSemuaMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (menuDropdown) menuDropdown.classList.remove('show-menu');
  const bahasaDropdown = document.querySelector('.bahasa-dropdown');
  if (bahasaDropdown) bahasaDropdown.classList.remove('show-bahasa');
}

/* ---------- 1. MUAT KOMPONEN HTML ---------- */
function loadFile(id, file, error) {
  const url = `${file}?v=${Date.now()}`;
  return fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(error);
      return r.text();
    })
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
    })
    .catch(err => console.error(error, err));
}

/* ---------- 2. INISIALISASI HALAMAN ---------- */
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    loadFile('about', './about.html', 'Gagal muat Tentang'),
    loadFile('kontak', './kontak.html', 'Gagal muat Kontak'),
    loadFile('privacy', './privacy.html', 'Gagal muat Kebijakan'),
    loadFile('terms', './terms.html', 'Gagal muat Syarat'),
    loadFile('footer', './footer.html', 'Gagal muat Footer'),
    // 🔥 TAMBAHAN PENTING
  ]).then(() => {

    let savedLang = localStorage.getItem('userLanguage');

    if (!savedLang) {
      const browserLang = (navigator.language || '').toLowerCase();
      if (browserLang.includes('id')) savedLang = 'indonesia';
      else if (browserLang.includes('pt') || browserLang.includes('br')) savedLang = 'brazil';
      else if (browserLang.includes('hi') || browserLang.includes('in')) savedLang = 'india';
      else savedLang = 'english';
    } else {
      savedLang = savedLang.toLowerCase().trim();
    }

// 🔥 WAJIB ADA INI BIAR FAQ KEISI
if (typeof gantiBahasa === 'function') {
  gantiBahasa(savedLang, false);
}
  });

  const input = document.getElementById('urlInput');
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') downloadVideo();
    });
  }
});

/* ---------- 3. FUNGSI UTAMA UNDUH (DENGAN URL PARAMETER) ---------- */
async function downloadVideo() {
  const btn = document.getElementById('downloadBtn');
  if (btn && btn.disabled) return;

  const input = document.getElementById('urlInput');
  if (!input) return;
  const url = input.value.trim();
  if (!url) { alert('Masukkan tautan Facebook'); return; }

  const validDomains = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'];
  const isValid = validDomains.some(d => url.includes(d));
  if (!isValid) { alert('Gunakan tautan Facebook yang valid'); return; }

  btn.classList.add('loading');
  btn.innerHTML = '<span class="spinner"></span> Memproses...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/facebook?url=' + encodeURIComponent(url));
    const data = await res.json();
    
    if (data.success) {
      // Pindah ke Rumah 2 dengan membawa URL di alamat browser
      window.location.href = `rumah_index2/index.html?url=${encodeURIComponent(url)}`;
    } else {
      throw new Error('Gagal ambil data');
    }
  } catch (err) {
    alert('Gagal memproses video, silakan coba lagi');
    btn.classList.remove('loading');
    btn.innerHTML = 'Download';
    btn.disabled = false;
  }
}
/* ---------- 4. RESET TOMBOL KEMBALI ---------- */
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    const btn = document.getElementById('downloadBtn');
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = 'Download';
      btn.disabled = false;
    }
  }
});

/* --- KENDALI MENU BARU --- */
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuDropdown.classList.toggle('show-menu');
  });

  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('show-menu');
    }
  });
});
// === ATURAN IKLAN MENU: MUNCUL TIAP 2 JAM SEKALI ===
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const KUNCI = 'iklanTerakhir';
  const JEDA = 2 * 60 * 60 * 1000;

  menuBtn.addEventListener('click', () => {
    const terakhir = localStorage.getItem(KUNCI) || 0;
    const sekarang = Date.now();
    if (sekarang - terakhir > JEDA) {
      // TEMPEL KODE IKLAN ADSTERRA DI SINI
      localStorage.setItem(KUNCI, sekarang);
    }
  });
});
// === UBAH GARIS MENU JADI X ===
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  if (!menuBtn) return;
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
  });
});

