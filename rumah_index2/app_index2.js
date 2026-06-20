/* ==========================================================
   APP_INDEX2.JS - BAGIAN 1: LOGIKA PEMUATAN DATA (FINAL)
   ========================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const thumb = document.getElementById('videoThumb');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  // 1. Ambil URL langsung dari parameter browser (Tanpa LocalStorage)
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

  if (!fbUrl) {
    window.location.href = '../index.html';
    return;
  }

  // 2. Fetch langsung ke server Railway
  try {
    const response = await fetch('https://divdown-production-33fd.up.railway.app/api/facebook?url=' + encodeURIComponent(fbUrl));
    const data = await response.json();

    if (data.success) {
      // Tampilkan UI
      if (thumb) { 
        thumb.src = data.thumbnail; 
        thumb.style.display = 'block'; 
      }
      if (btnWrap) btnWrap.style.display = 'flex';

      // 3. Pasang fungsi unduh ke tombol
      if (btnHD) btnHD.onclick = () => unduhVideo(data.hd720, 'Divdown_Video_720p.mp4', btnHD, '720p Download HD');
      if (btnHQ) btnHQ.onclick = () => unduhVideo(data.hd1080 || data.hd720, 'Divdown_Video_1080p.mp4', btnHQ, '1080p High Quality');
    } else {
      alert("Video tidak ditemukan, silakan coba link lain.");
      window.location.href = '../index.html';
    }
  } catch (err) {
    alert("Gagal memproses ke server, silakan coba lagi.");
  }

  // Muat komponen pelengkap (FAQ & Footer)
  loadFAQ();
  loadFooter();
});
/* ==========================================================
   APP_INDEX2.JS - BAGIAN 2: EKSEKUSI UNDUH & KOMPONEN (FINAL)
   ========================================================== */

// Fungsi Unduh (Versi "Paksa" - Paling stabil untuk Mobile)
async function unduhVideo(url, namaFile, btn, teksAsli) {
  if (!url) { alert("Link tidak tersedia!"); return; }
  
  btn.textContent = "Downloading...";
  btn.disabled = true;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = namaFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (err) { 
    // Fallback: Jika fetch gagal, arahkan langsung ke link
    window.location.href = url; 
  } finally {
    btn.textContent = teksAsli;
    btn.disabled = false;
  }
}

// Fungsi Load FAQ (Tetap mempertahankan logika bahasa otomatis)
async function loadFAQ() {
  try {
    const res = await fetch('faq_rumah2.html');
    if (!res.ok) return;
    const html = await res.text();
    const target = document.getElementById('faq');
    if (target) {
      target.innerHTML = html;

      // Logika bahasa (Membaca dari LocalStorage)
      let savedLangRumah2 = localStorage.getItem('kunciBahasaRumah2') || 'indonesia';
      let langCode = 'id'; 
      if (savedLangRumah2 === 'english') langCode = 'en';
      else if (savedLangRumah2 === 'brazil') langCode = 'br';
      else if (savedLangRumah2 === 'india') langCode = 'in';

      // Menerapkan perubahan bahasa ke semua elemen data-*
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${langCode}`) || el.getAttribute('data-en');
      });
    }
  } catch (e) { console.log('FAQ tidak dimuat'); }
}

// Fungsi Load Footer
async function loadFooter() {
  try {
    const res = await fetch('footer_rumah2.html');
    if (res.ok) document.getElementById('footer').innerHTML = await res.text();
  } catch (e) { console.log('Footer tidak dimuat'); }
}
