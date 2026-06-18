// ===== APP_INDEX2.JS RUMAH 2 FINAL - SINKRON BAHASA & DINAMIS API =====

document.addEventListener('DOMContentLoaded', () => {
  const thumb = document.getElementById('videoThumb');
  const spinner = document.getElementById('thumbSpinner');
  const statusText = document.getElementById('statusText');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  if (spinner) spinner.style.setProperty('display', 'block', 'important');
  if (statusText) statusText.style.setProperty('display', 'block', 'important');
  if (thumb) { thumb.style.setProperty('display', 'none', 'important'); thumb.removeAttribute('src'); }
  if (btnWrap) { btnWrap.style.setProperty('display', 'none', 'important'); }

  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

    if (!fbUrl) {
    JagaSpinnerTetapMuter();
  } else {
    fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(fbUrl))
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error('Backend gagal');

        const videoData = { 
          img: data.thumbnail, 
          hd720: data.hd720,
          hd1080: data.hd1080 
        };

        // Update UI setelah data diterima
        if (btnWrap) btnWrap.style.setProperty('display', 'flex', 'important');
        if (thumb) { thumb.src = videoData.img; thumb.style.setProperty('display', 'block', 'important'); }
        if (spinner) spinner.style.setProperty('display', 'none', 'important');
        if (statusText) statusText.style.setProperty('display', 'none', 'important');

// 4. Aksi Download 720p (Metode Blob Paksa Unduh)
if (btnHD) {
  btnHD.onclick = async () => {
    if (videoData.hd720) {
      btnHD.textContent = "Processing...";mulaiProgressDownload();
      
      // Sinyal pemicu popunder untuk file iklan
      window.postMessage('triggerPopunder', '*');
      
      try {
        const res = await fetch(videoData.hd720);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Divdown_Video_720p.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) { window.location.href = videoData.hd720; }
      finally {
     btnHD.textContent = "720p Download HD";
       resetProgressDownload();
     }
    }
  };
}

        // 5. Aksi Download 1080p (Metode Blob Paksa Unduh)
        if (btnHQ) {
          btnHQ.onclick = async () => {
            const urlToDownload = videoData.hd1080 || videoData.hd720;
            if (urlToDownload) {
              btnHQ.textContent = "Processing...";
              // === DAMMY PROGRES BERJALAN ===
              mulaiProgressDownload();
              // Sinyal pemicu popunder untuk file iklan
              window.postMessage('triggerPopunder', '*');
              
              try {
                const res = await fetch(urlToDownload);
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Divdown_Video_1080p.mp4';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) { window.location.href = urlToDownload; }
              finally {
            btnHQ.textContent = "1080p High Quality";
              resetProgressDownload();
             }
            }
          };
        }
      }) // <--- INI PENUTUPNYA
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

// === DAMMY PROGRES BERJALAN ===
function mulaiProgressDownload(){const progress=document.getElementById('downloadProgress');const bar=document.getElementById('downloadProgressBar');if(!progress||!bar)return;progress.style.display='block';bar.classList.remove('jalan');void bar.offsetWidth;bar.classList.add('jalan');}

function resetProgressDownload(){const progress=document.getElementById('downloadProgress');const bar=document.getElementById('downloadProgressBar');if(!progress||!bar)return;bar.classList.remove('jalan');progress.style.display='none';}
// === END DAMMY PROGRES BERJALAN ===
