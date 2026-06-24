/* ==========================================================
   APP_INDEX2.JS - BAGIAN 1: LOGIKA PEMUATAN DATA (FINAL)
   ========================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const thumb = document.getElementById('videoThumb');
  const btnWrap = document.getElementById('downloadWrap');
  const btnStandard = document.getElementById('dlStandard');
const btnHD = document.getElementById('dl720');
const btnHQ = document.getElementById('dl1080');

  // 1. Ambil URL langsung dari parameter browser (Tanpa LocalStorage)
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

  if (!fbUrl) {
    window.location.href = '../index.html';
    return;
  }

  // 2. Fetch langsung ke server vps
  try {
    const response = await fetch('https://divdown.net/api/facebook?url=' + encodeURIComponent(fbUrl));
    const data = await response.json();

    if (data.success) {
      // Tampilkan UI
      if (thumb) { 
        thumb.src = data.thumbnail; 
        thumb.style.display = 'block'; 
      }
      if (btnWrap) btnWrap.style.display = 'flex';
      // 3. Pasang fungsi unduh ke tombol
  if (btnStandard) {
    btnStandard.onclick = () => {
  if (data.standard) {
    window.open(
      'https://divdown.net/api/download?url=' + encodeURIComponent(data.standard),
      '_blank'
    );
      } else {
        alert("Maaf, link Standard tidak tersedia.");
      }
    };
  }

 if (btnHD) {
  btnHD.onclick = () => {
    if (data.hd720) {
      window.open(
        'https://divdown.net/api/download?url=' + encodeURIComponent(data.hd720),
        '_blank'
      );
      } else {
        alert("Maaf, link 720p tidak tersedia.");
      }
    };
  }

  if (btnHQ) {
    btnHQ.onclick = () => {
      alert("Maaf, video ini tidak tersedia dalam kualitas 1080p.");
    };
  }   
  } else {
      alert("Video tidak ditemukan, silakan coba link lain.");
      window.location.href = '../index.html';
    }
  } catch (err) {
    alert("Gagal memproses ke server, silakan coba lagi.");
  }

  loadFAQ();
  loadFooter();
});

/* ==========================================================
   APP_INDEX2.JS - BAGIAN 2: EKSEKUSI UNDUH & KOMPONEN (FINAL)
   ========================================================== */

// Fungsi Unduh: Langsung simpan, tidak nonton di browser
async function unduhVideo(url, namaFile, btn, teksAsli) {
  if (!url) { alert("Link tidak tersedia!"); return; }

  btn.textContent = "Downloading...";
  btn.disabled = true;

  try {
    const res = await fetch(url, { credentials: 'omit', mode: 'cors' });
    if (!res.ok) throw new Error("Gagal ambil file");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = namaFile;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 300);

  } catch (err) {
    // Cara cadangan jika gagal
    const a = document.createElement('a');
    a.href = url + "?dl=1";
    a.download = namaFile;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
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
