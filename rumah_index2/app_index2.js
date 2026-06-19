/* === APP_INDEX2.JS FINAL - CLEAN VERSION === */
document.addEventListener('DOMContentLoaded', () => {
  const thumb = document.getElementById('videoThumb');
  const btnWrap = document.getElementById('downloadWrap');
  const btnHD = document.getElementById('dl720');
  const btnHQ = document.getElementById('dl1080');

  // Ambil data yang sudah disiapkan oleh Rumah 1
  const data = JSON.parse(localStorage.getItem('videoData'));

  if (data) {
    // Langsung tampilkan thumbnail tanpa spinner
    if (thumb) { 
        thumb.src = data.thumbnail; 
        thumb.style.display = 'block'; 
    }
    
    // Langsung tampilkan tombol download
    if (btnWrap) btnWrap.style.display = 'flex';

    // Konfigurasi tombol download
    if (btnHD) btnHD.onclick = () => unduhVideo(data.hd720, 'Divdown_Video_720p.mp4', btnHD, '720p Download HD');
    if (btnHQ) btnHQ.onclick = () => unduhVideo(data.hd1080 || data.hd720, 'Divdown_Video_1080p.mp4', btnHQ, '1080p High Quality');
  }

  loadFAQ();
  loadFooter();
});

async function unduhVideo(url, namaFile, btn, teksAsli) {
  if (!url) return;
  btn.textContent = "Processing...";
  mulaiProgressDownload();
  window.postMessage('triggerPopunder', '*');
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
    resetProgressDownload();
  }
}
/* === BAGIAN 2: PROGRESS, BAHASA, & KOMPONEN === */
function mulaiProgressDownload(){const p=document.getElementById('downloadProgress');const b=document.getElementById('downloadProgressBar');if(p&&b){p.style.display='block';b.classList.add('jalan');}}
function resetProgressDownload(){const p=document.getElementById('downloadProgress');const b=document.getElementById('downloadProgressBar');if(p&&b){b.classList.remove('jalan');p.style.display='none';}}

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
