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
    loadFile('footer', './footer.html', 'Gagal muat Footer')
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
    setTimeout(() => {
      if (typeof gantiBahasa === 'function') {
        gantiBahasa(savedLang);
      } else {
        console.warn('Fungsi gantiBahasa belum siap');
      }
    }, 150);
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
    const res = await fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(url));
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

/* ---------- 5. MENU JARINGAN - MUAT SAAT DIKLIK ---------- */
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  const menuTempatIsi = document.getElementById('menuTempatIsi');
  let sudahDimuat = false;

  if (!menuBtn || !menuDropdown || !menuTempatIsi) return;

  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const bahasaDropdown = document.querySelector('.bahasa-dropdown');
    if (bahasaDropdown) bahasaDropdown.classList.remove('show-bahasa');

    if (!sudahDimuat) {
      const linkCSS = document.createElement('link');
      linkCSS.rel = 'stylesheet';
      linkCSS.href = `./jaringan/menu_jaringan.css?v=${Date.now()}`;
      document.head.appendChild(linkCSS);

      fetch(`./jaringan/menu_jaringan.html?v=${Date.now()}`)
        .then(res => res.ok ? res.text() : '<div style="padding:12px;text-align:center;">Menu tidak tersedia</div>')
        .then(html => {
          menuTempatIsi.innerHTML = html;
          sudahDimuat = true;
          menuDropdown.classList.toggle('show-menu');
        })
        .catch(() => {
          menuTempatIsi.innerHTML = '<div style="padding:12px;text-align:center;color:red;">Gagal memuat menu</div>';
          menuDropdown.classList.toggle('show-menu');
        });
    } else {
      menuDropdown.classList.toggle('show-menu');
    }
  });

  document.addEventListener('click', function(e) {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('show-menu');
    }
  });
});
