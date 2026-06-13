// ======================================
// APP.JS RUMAH 1 - FINAL SINKRONISASI BACKEND DIVDOWN
// ======================================

/* ---------- 1. LOAD HTML COMPONENT ---------- */
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
    .catch(err => console.error(error, err));
}

/* ---------- 2. INIT PAGE ---------- */
document.addEventListener('DOMContentLoaded', () => {

  Promise.all([
    loadFile('faq', './faq.html', 'FAQ failed'),
    loadFile('about', './about.html', 'About failed'),
    loadFile('kontak', './kontak.html', 'Contact failed'),
    loadFile('privacy', './privacy.html', 'Privacy failed'),
    loadFile('terms', './terms.html', 'Terms failed'),
    loadFile('footer', './footer.html', 'Footer failed')
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
      }
    }, 50);

  });

  const input = document.getElementById('urlInput');
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') downloadVideo();
    });
  }
});

/* ---------- 3. MAIN DOWNLOAD FUNCTION (FINAL FIX) ---------- */
function downloadVideo() {
  const btn = document.getElementById('downloadBtn');
  if (btn && btn.disabled) return;

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

  const isValid = validDomains.some(d => url.includes(d));

  if (!isValid) {
    alert('Use valid Facebook link');
    return;
  }

btn.classList.add('loading');
btn.innerHTML = '<span class="spinner"></span>Loading...';
btn.disabled = true;  

  // 🔥 CONNECT KE BACKEND
  fetch('http://localhost:3000/api/facebook?url=' + encodeURIComponent(url))
    .then(res => res.json())
    .then(data => {

      if (!data || !data.success) {
        throw new Error('API failed');
      }

      // 🔥 KIRIM KE RUMAH 2
const hd720 = data.formats?.find(f => f.format_id === 'hd');
const hd1080 = data.formats?.find(f =>
  String(f.format_id).includes('1080')
);

const videoData = {
  img: data.thumbnail,
  hd720: hd720?.url || null,
  hd1080: hd1080?.url || hd720?.url || null
};

      localStorage.setItem('videoData', JSON.stringify(videoData));

      const isAdmin =
        new URLSearchParams(location.search).get('tes') === '@analisa';

      window.location.href =
        'rumah_index2/index.html?url=' +
        encodeURIComponent(url) +
        (isAdmin ? '&tes=@analisa' : '');
    })
    .catch(err => {
      console.error(err);
      alert('Server error / backend tidak jalan');

      btn.classList.remove('loading');
      btn.innerHTML = 'Download';
      btn.disabled = false;
    });
}

/* ---------- 4. RESET BUTTON ---------- */
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