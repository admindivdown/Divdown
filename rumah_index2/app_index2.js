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

const savedVideoData = localStorage.getItem('videoData');

if (savedVideoData) {
try {
const videoData = JSON.parse(savedVideoData);

if (videoData.hd720 || videoData.hd1080) {

  // --- TIMING 1: Perubahan Teks Status Dinamis (Detik ke-2) ---
  setTimeout(() => {
    if (statusText) {
      statusText.textContent = "Optimizing server...";
    }
  }, 2000);

  // --- TIMING 2: Tunda Pemuatan Gambar Asli Video (Detik ke-3) ---
  setTimeout(() => {
    if (videoData.img && videoData.img.trim() !== "") {
      if (thumb) {
        thumb.onload = () => {
          if (spinner) spinner.style.setProperty('display', 'none', 'important');
          if (statusText) statusText.style.setProperty('display', 'none', 'important');
          thumb.style.setProperty('display', 'block', 'important');
        };

        thumb.onerror = () => {
          JagaSpinnerTetapMuter();
        };

        thumb.src = videoData.img;
      }
    } else {
      JagaSpinnerTetapMuter();
    }
  }, 3000);

  // --- TIMING 3: Tunda Munculnya Boks Tombol Download (Detik ke-4) ---
  setTimeout(() => {
    if (btnWrap) {
      btnWrap.style.setProperty('display', 'flex', 'important');
    }
  }, 4000);

  // AKSI TOMBOL DOWNLOAD SAAT DIKLIK USER
  if (btnHD) {
    btnHD.onclick = () => {
      if (videoData.hd720) {
        window.open(videoData.hd720, '_blank');
      }
    };
  }

  if (btnHQ) {
    btnHQ.onclick = () => {
      if (videoData.hd1080) {
        window.open(videoData.hd1080, '_blank');
      } else if (videoData.hd720) {
        window.open(videoData.hd720, '_blank');
      }
    };
  }

} else {
  JagaSpinnerTetapMuter();
}

} catch (e) {
console.error('Gagal memproses data video dari Rumah 1', e);
JagaSpinnerTetapMuter();
}
} else {
JagaSpinnerTetapMuter();
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
