/* === APP_INDEX2.JS FINAL - VERSI SINKRON SERVER === */

document.addEventListener('DOMContentLoaded', () => {
  const thumb = document.getElementById('videoThumb');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  // Ambil data yang sudah disiapkan oleh Rumah 1 (Hanya Thumbnail & 720p)
  const data = JSON.parse(localStorage.getItem('videoData'));

  if (data) {
    if (thumb) { 
        thumb.src = data.thumbnail; 
        thumb.style.display = 'block'; 
    }
    if (btnWrap) btnWrap.style.display = 'flex';

    // Tombol 720p: Pakai data yang sudah ada
    if (btnHD) btnHD.onclick = () => unduhVideo(data.hd720, 'Divdown_Video_720p.mp4', btnHD, '720p Download HD');
    
    // Tombol 1080p: Ambil data baru dari server saat diklik
    if (btnHQ) btnHQ.onclick = () => ambil1080pDanUnduh(btnHQ);
  }

  loadFAQ();
  loadFooter();
});

// Fungsi khusus tombol 1080p: Fetch ulang ke server
async function ambil1080pDanUnduh(btn) {
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');
  if (!fbUrl) return;

  btn.textContent = "Processing 1080p...";
  window.postMessage('triggerPopunder', '*');

  try {
    // Memanggil API kembali untuk mendapatkan semua format termasuk 1080p
    const res = await fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(fbUrl));
    const data = await res.json();
    
    // Asumsi: Server kamu akan tetap mengirimkan list format atau logic 1080p di sini
    const url1080 = data.hd1080 || data.hd720; 
    
    await unduhVideo(url1080, 'Divdown_Video_1080p.mp4', btn, '1080p High Quality');
  } catch (err) { 
    console.error("Gagal ambil 1080p", err);
    btn.textContent = '1080p High Quality';
  }
}

async function unduhVideo(url, namaFile, btn, teksAsli) {
  if (!url) return;
  btn.textContent = "Processing...";
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = namaFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) { window.location.href = url; }
  finally {
    btn.textContent = teksAsli;
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
