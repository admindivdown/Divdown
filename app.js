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
  
/* === PROGRESS RUMAH 1 === */
const pb=document.getElementById('progressBox'),pf=document.getElementById('progressFill'),pt=document.getElementById('progressText');
if(pb&&pf&&pt){
pb.style.display='block';pf.style.width='0%';pt.textContent='0%';
let p=0;const i=setInterval(()=>{if(p<30)p+=3;else if(p<70)p+=2;else if(p<90)p+=1;else p+=0.5;if(p>100)p=100;pf.style.width=p+'%';pt.textContent=Math.floor(p)+'%';if(p>=100)clearInterval(i)},170);
}
/* === END === */
  
  const validDomains = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'];
  const isValid = validDomains.some(d => url.includes(d));
  if (!isValid) { alert('Gunakan tautan Facebook yang valid'); return; }

  btn.classList.add('loading');
btn.innerHTML = 'Memproses...';
btn.disabled = true;

  try {
    const res = await fetch('https://divdown.net/api/facebook?url=' + encodeURIComponent(url));
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

// --- KENDALI MENU TERPADU (AMAN & TIDAK TERTUKAR) ---
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#menuBtn.menu-btn'); // satu penanda saja
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menuDropdown.classList.toggle('show-menu');
    menuBtn.classList.toggle('open', isOpen); // ikon selalu ikut kondisi menu
  });

  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('show-menu');
      menuBtn.classList.remove('open'); // pas tutup otomatis balikin ke garis
    }
  });
});
// ===== SOCIAL BAR ADSTERRA MENU =====
document.addEventListener('DOMContentLoaded',()=>{
const menuBtn=document.getElementById('menuBtn');
const KUNCI='socialbarTerakhir';
const JEDA=60601000;
menuBtn.addEventListener('click',()=>{
const terakhir=+localStorage.getItem(KUNCI)||0;
const sekarang=Date.now();
if(sekarang-terakhir<JEDA)return;
localStorage.setItem(KUNCI,sekarang);
const s=document.createElement('script');
s.src='https://pl29906335.effectivecpmnetwork.com/a2/08/20/a208209753529aeee294bb011e03c014.js';
document.body.appendChild(s);
});
});
// ===== END IKLAN SOCIAL BAR =====

// ===== PRELOAD BANNER MENU 320x50 =====
document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{const b=document.getElementById('menuBanner320');if(!b)return;const o=document.createElement('script');o.innerHTML="atOptions={'key':'a9e26a5898162babbd39410bf67794d2','format':'iframe','height':50,'width':320,'params':{}};";b.appendChild(o);const s=document.createElement('script');s.src='https://www.highperformanceformat.com/a9e26a5898162babbd39410bf67794d2/invoke.js';b.appendChild(s);},1500);});
// ===== END PRELOAD BANNER MENU =====

// ===== LOAD BANNER PROMO =====
document.addEventListener('DOMContentLoaded',()=>{
setTimeout(()=>{
const banner=document.querySelector('.promo-banner');
if(banner)banner.style.display='block';
},2000);
});
// ===== END LOAD BANNER =====