// ======================================
// APP.JS RUMAH 1 - FINAL SINKRONISASI FONDASI UTAMA
// ======================================

/* ---------- 1. FUNGSI LOAD HTML DENGAN PROMISE ASLI ---------- */
function loadFile(id, file, error) {
  return fetch(file)
    .then(r => {
      if (!r.ok) throw new Error(error);
      return r.text();
    })
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
    })
    .catch(err => {
      console.error(error, err);
    });
}

/* ---------- 2. PROSES MEMUAT KOMPONEN & INITIALISASI BAHASA ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Mengunci browser agar menyelesaikan load semua file HTML luar terlebih dahulu
  Promise.all([
    loadFile('faq', './faq.html', 'FAQ failed'),
    loadFile('about', './about.html', 'About failed'),
    loadFile('kontak', './kontak.html', 'Contact failed'),
    loadFile('privacy', './privacy.html', 'Privacy failed'),
    loadFile('terms', './terms.html', 'Terms failed'),
    loadFile('footer', './footer.html', 'Footer failed')
  ]).then(() => {
    // SETELAH SEMUA HTML SELESAI MENEMPEL TOTAL, BARULAH FUNGSI BAHASA DIEKSEKUSI
    let savedLang = localStorage.getItem('userLanguage');
    
    // DETEKSI OTOMATIS AWAL: Bersih, murni untuk 4 negara pilihan
    if (!savedLang) {
      const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      if (browserLang.includes('id')) {
        savedLang = 'indonesia';
      } else if (browserLang.includes('pt') || browserLang.includes('br')) {
        savedLang = 'brazil';
      } else if (browserLang.includes('hi') || browserLang.includes('in')) {
        savedLang = 'india';
      } else {
        savedLang = 'english';
      }
    } else {
      savedLang = savedLang.toLowerCase().trim();
    }

    // Memberikan jeda mikro agar browser mendaftarkan ID HTML baru secara stabil di HP
    setTimeout(() => {
      if (typeof gantiBahasa === 'function') {
        gantiBahasa(savedLang);
      } else {
        console.error("Fungsi gantiBahasa belum siap di memori global.");
      }
    }, 50);
  });

  // Listener input enter untuk download
  const input = document.getElementById('urlInput');
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') downloadVideo();
    });
  }
});

/* ---------- 3. FUNGSI UTAMA DOWNLOAD ---------- */
function downloadVideo() {
  const btnSpam = document.getElementById('downloadBtn');
  if (btnSpam && btnSpam.disabled) return;

  const input = document.getElementById('urlInput');
  if (!input) return;

  const url = input.value.trim();

  if (!url) {
    alert('Enter Facebook link');
    return;
  }

  const validDomains = [
    'facebook.com',
    'www.facebook.com',
    'm.facebook.com',
    'fb.watch'
  ];

  if (
    url.includes('javascript:') ||
    url.includes('data:') ||
    url.includes('<') ||
    url.includes('>')
  ) {
    alert('Invalid link');
    return;
  }

  const isValid = validDomains.some(domain =>
    url.includes(domain)
  );

  if (!isValid && url !== 'T') {
    alert('Use a valid Facebook link');
    return;
  }

  if (url !== 'T' && url.length < 20) {
    alert('Link is too short');
    return;
  }

  btnSpam.classList.add('loading');
  btnSpam.innerHTML = '<span class="spinner"></span> Loading...';
  btnSpam.disabled = true;

  const videoData = {
    link: url
  };

  localStorage.setItem('videoData', JSON.stringify(videoData));

  const isAdmin =
    new URLSearchParams(location.search).get('tes') === '@analisa';

  window.location.href =
    'rumah_index2/index.html?url=' +
    encodeURIComponent(url) +
    (isAdmin ? '&tes=@analisa' : '');
}

/* ---------- 4. RESET TOMBOL SAAT USER KEMBALI ---------- */
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    const btn = document.getElementById('downloadBtn');
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = 'Download';
      btn.disabled = false;
    }
  }
});
