// ===== APP_INDEX2.JS RUMAH 2 FINAL - SINKRON BAHASA & DINAMIS API =====

document.addEventListener('DOMContentLoaded', () => {
  /* ====================================
     1. AMBIL DATA VIDEO DARI MEMORI RUMAH 1 & API (TAKTIK TUNDA CUAN)
     ==================================== */
  const thumb = document.getElementById('videoThumb');
  const spinner = document.getElementById('thumbSpinner');
  const statusText = document.getElementById('statusText');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  // Kunci status awal: Bersihkan src gambar asli, sembunyikan kotak gambar dan boks tombol
  if (spinner) spinner.style.setProperty('display', 'block', 'important');
  if (statusText) statusText.style.setProperty('display', 'block', 'important');
  if (thumb) { thumb.style.setProperty('display', 'none', 'important'); thumb.removeAttribute('src'); }
  if (btnWrap) { btnWrap.style.setProperty('display', 'none', 'important'); }

// === INISIALISASI DATA ===
const params = new URLSearchParams(window.location.search);
const fbUrl = params.get('url');

if (!fbUrl) {
  JagaSpinnerTetapMuter();
} else {
  fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(fbUrl))
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error('Backend gagal');

      // Pastikan hd1080 juga didefinisikan di sini
      const videoData = { 
        img: data.thumbnail, 
        hd720: data.hd720,
        hd1080: data.hd1080 // Pastikan ini sesuai dengan respon backendmu
      };

      // 1. Update Status
      setTimeout(() => { if (statusText) statusText.textContent = "Optimizing server..."; }, 200);

      // 2. Load Thumbnail
      setTimeout(() => {
        if (videoData.img?.trim()) {
          if (thumb) {
            thumb.onload = () => {
              spinner?.style.setProperty('display', 'none', 'important');
              statusText?.style.setProperty('display', 'none', 'important');
              thumb.style.setProperty('display', 'block', 'important');
            };
            thumb.onerror = JagaSpinnerTetapMuter;
            thumb.src = videoData.img;
          }
        } else {
          JagaSpinnerTetapMuter();
        }
      }, 300);

      // 3. Tampilkan Tombol
      setTimeout(() => {
        if (btnWrap) btnWrap.style.setProperty('display', 'flex', 'important');
      }, 400);

      // 4. Aksi Download 720p
      if (btnHD) {
        btnHD.onclick = async () => {
          if (videoData.hd720) {
            const res = await fetch(videoData.hd720);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Divdown_Video.mp4';
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        };
      }

      // 5. Aksi Download 1080p (POSISI DI SINI, DI DALAM BLOK THEN)
      if (btnHQ) {
        btnHQ.onclick = async () => {
          const urlToDownload = videoData.hd1080 || videoData.hd720;
          if (urlToDownload) {
            try {
              const res = await fetch(urlToDownload);
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Divdown_Video_HQ.mp4';
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              window.open(urlToDownload, '_blank');
            }
          }
        };
      }
    })
    .catch(err => {
      console.error('Gagal:', err);
      JagaSpinnerTetapMuter();
    });
}

  /* ==========================================
     2. LOAD FAQ + DETEKSI BAHASA PREMIUM SINKRON
     ========================================== */
  loadFAQ();
  loadFooter();
});

// Fungsi pengunci: Memaksa spinner tetap aktif berputar tanpa memunculkan gambar dummy pecah
function JagaSpinnerTetapMuter() {
  const spinner = document.getElementById('thumbSpinner');
  const statusText = document.getElementById('statusText');
  const thumb = document.getElementById('videoThumb');
  if (spinner) spinner.style.setProperty('display', 'block', 'important');
  if (statusText) { statusText.style.setProperty('display', 'block', 'important'); statusText.textContent = "Processing video..."; }
  if (thumb) { thumb.removeAttribute('src'); thumb.style.setProperty('display', 'none', 'important'); }
}

async function loadFAQ() {
  try {
    const res = await fetch('faq_rumah2.html');
    if (!res.ok) return;
    const html = await res.text();
    const target = document.getElementById('faq');
    if (target) target.innerHTML = html;
    
    let savedLangRumah2 = localStorage.getItem('kunciBahasaRumah2');
    if (!savedLangRumah2) {
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('id')) { savedLangRumah2 = 'indonesia'; }
      else if (browserLang.startsWith('pt')) { savedLangRumah2 = 'brazil'; }
      else if (browserLang.startsWith('hi')) { savedLangRumah2 = 'india'; }
      else { savedLangRumah2 = 'english'; }
      localStorage.setItem('kunciBahasaRumah2', savedLangRumah2);
    }

    let langCode = 'en'; 
    if (savedLangRumah2 === 'indonesia') { langCode = 'id'; }
    else if (savedLangRumah2 === 'brazil') { langCode = 'br'; }
    else if (savedLangRumah2 === 'india') { langCode = 'in'; }

    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${langCode}`) || el.getAttribute('data-en');
    });
  } catch (e) {
    console.log('FAQ gagal dimuat', e);
  }
}

async function loadFooter() {
  try {
    const res = await fetch('footer_rumah2.html');
    if (!res.ok) return;
    const html = await res.text();
    const target = document.getElementById('footer');
    if (target) target.innerHTML = html;
  } catch (e) {
    console.error('Footer gagal dimuat', e);
  }
}
