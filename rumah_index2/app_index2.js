/* === APP_INDEX2.JS - VERSI SINKRON URL PARAMETER === */
document.addEventListener('DOMContentLoaded', async () => {
  const thumb = document.getElementById('videoThumb');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  // 1. Ambil URL dari parameter browser (?url=...)
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

  // 2. Ambil data cadangan dari LocalStorage
  const data = JSON.parse(localStorage.getItem('videoData'));

  // Jika tidak ada URL dan tidak ada data, kembali ke Home
  if (!fbUrl && !data) {
    window.location.href = '../index.html';
    return;
  }

  // Tampilkan data (thumbnail) jika tersedia
  if (data) {
    if (thumb) { 
        thumb.src = data.thumbnail; 
        thumb.style.display = 'block'; 
    }
    if (btnWrap) btnWrap.style.display = 'flex';

    // Tombol 720p: Pakai data 720p yang sudah ada
    if (btnHD) btnHD.onclick = () => unduhVideo(data.hd720, 'Divdown_Video_720p.mp4', btnHD, '720p Download HD');
    
    // Tombol 1080p: Fetch ulang ke server menggunakan fbUrl (dari parameter) atau originalUrl (dari storage)
    const targetUrl = fbUrl || data.originalUrl;
    if (btnHQ) btnHQ.onclick = () => ambil1080pDanUnduh(btnHQ, targetUrl);
  }

  loadFAQ();
  loadFooter();
});

// Fungsi Fetch 1080p dengan URL dari data yang disimpan
async function ambil1080pDanUnduh(btn, originalUrl) {
  if (!originalUrl) {
      alert("Error: URL tidak ditemukan");
      return;
  }

  btn.textContent = "Processing 1080p...";
  window.postMessage('triggerPopunder', '*');

  try {
    const res = await fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(originalUrl));
    const data = await res.json();
    
    // Pastikan link 1080p tersedia, jika tidak fallback ke 720p
    const url1080 = data.hd1080 || data.hd720; 
    await unduhVideo(url1080, 'Divdown_Video_1080p.mp4', btn, '1080p High Quality');
  } catch (err) { 
    btn.textContent = '1080p High Quality';
    alert("Gagal mengambil kualitas 1080p");
  }
}

// Fungsi unduh (Menggunakan a.href agar lebih stabil)
async function unduhVideo(url, namaFile, btn, teksAsli) {
  if (!url) return;
  btn.textContent = "Downloading...";
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = namaFile;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) { window.location.href = url; }
  finally {
    setTimeout(() => { btn.textContent = teksAsli; }, 1000);
  }
}
/* === BAGIAN 2: BAHASA & KOMPONEN === */

async function loadFAQ() {
  try {
    const res = await fetch('faq_rumah2.html');
    if (!res.ok) return;
    const html = await res.text();
    const target = document.getElementById('faq');
    if (target) target.innerHTML = html;
    
    let savedLangRumah2 = localStorage.getItem('kunciBahasaRumah2');
    if (!savedLangRumah2) {
      const browserLang = navigator.language || navigator.userLanguage || '';
      if (browserLang.startsWith('id')) savedLangRumah2 = 'indonesia';
      else if (browserLang.startsWith('pt')) savedLangRumah2 = 'brazil';
      else if (browserLang.startsWith('hi')) savedLangRumah2 = 'india';
      else savedLangRumah2 = 'english';
      localStorage.setItem('kunciBahasaRumah2', savedLangRumah2);
    }
    let langCode = 'en'; 
    if (savedLangRumah2 === 'indonesia') langCode = 'id';
    else if (savedLangRumah2 === 'brazil') langCode = 'br';
    else if (savedLangRumah2 === 'india') langCode = 'in';
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${langCode}`) || el.getAttribute('data-en');
    });
  } catch (e) { console.log('FAQ tidak ditemukan'); }
}

async function loadFooter() {
  try {
    const res = await fetch('footer_rumah2.html');
    if (!res.ok) return;
    const html = await res.text();
    const target = document.getElementById('footer');
    if (target) target.innerHTML = html;
  } catch (e) { console.log('Footer tidak ditemukan'); }
}
