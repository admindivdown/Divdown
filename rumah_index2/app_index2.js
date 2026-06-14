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

const params = new URLSearchParams(window.location.search);
const fbUrl = params.get('url');

if (!fbUrl) {

  JagaSpinnerTetapMuter();

} else {

  fetch(
    'http://localhost:3000/api/facebook?url=' +
    encodeURIComponent(fbUrl)
  )

  .then(res => res.json())

  .then(data => {

    if (!data.success) {
      throw new Error('Backend gagal');
    }

    const hd720 = data.formats?.find(
      f => f.format_id === 'hd'
    );

    const hd1080 = data.formats?.find(
      f => String(f.format_id).includes('1080')
    );

    const videoData = {
  img: data.thumbnail,
  hd720: data.hd720
};

    // --- TIMING 1: Status ---
    setTimeout(() => {

      if (statusText) {
        statusText.textContent =
          "Optimizing server...";
      }

    }, 200);

    // --- TIMING 2: Thumbnail ---
    setTimeout(() => {

      if (
        videoData.img &&
        videoData.img.trim() !== ""
      ) {

        if (thumb) {

          thumb.onload = () => {

            if (spinner) {
              spinner.style.setProperty(
                'display',
                'none',
                'important'
              );
            }

            if (statusText) {
              statusText.style.setProperty(
                'display',
                'none',
                'important'
              );
            }

            thumb.style.setProperty(
              'display',
              'block',
              'important'
            );
          };

          thumb.onerror = () => {
            JagaSpinnerTetapMuter();
          };

          thumb.src = videoData.img;
        }

      } else {

        JagaSpinnerTetapMuter();

      }

    }, 300);

    // --- TIMING 3: Tombol Download ---
    setTimeout(() => {

      if (btnWrap) {
        btnWrap.style.setProperty(
          'display',
          'flex',
          'important'
        );
      }

    }, 400);

    // --- Tombol 720 ---
    if (btnHD) {

      btnHD.onclick = () => {

        if (videoData.hd720) {

          window.open(
            videoData.hd720,
            '_blank'
          );

        }

      };

    }

    // --- Tombol 1080 ---
    if (btnHQ) {

      btnHQ.onclick = () => {

        if (videoData.hd1080) {

          window.open(
            videoData.hd1080,
            '_blank'
          );

        } else if (videoData.hd720) {

          window.open(
            videoData.hd720,
            '_blank'
          );

        }

      };

    }

  })

  .catch(err => {

    console.error(
      'Gagal memproses data dari backend',
      err
    );

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
