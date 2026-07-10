/* === APP_INDEX2.JS BAGIAN 1 === */
document.addEventListener('DOMContentLoaded', async () => {
  const browserLang = (navigator.language || '').toLowerCase();
const isID = browserLang.includes('id');
  loadFAQ();
  loadFooter();
  const thumb = document.getElementById('videoThumb');
  
  const btnWrap = document.getElementById('downloadWrap');
  const btnStandard = document.getElementById('dlStandard');
const btnHD = document.getElementById('dl720');

  // Ambil URL langsung
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

  if (!fbUrl) {
    window.location.href = '../index.html';
    return;
  }

/* === AMBIL DATA DARI SESSION / SERVER === */
try{
let data=JSON.parse(sessionStorage.getItem('fbData')||'null');
if(!data){
const response=await fetch('https://divdown.net/api/facebook?url='+encodeURIComponent(fbUrl));
data=await response.json();
}
sessionStorage.removeItem('fbData');

    if (data.success) {
// Tampilkan UI
      if (thumb) {
        const loader=document.getElementById('thumbLoading');
        thumb.onload=()=>{if(loader)loader.style.display='none';};
        thumb.src=data.thumbnail;
        thumb.style.display='block';
      }
      if (btnWrap) btnWrap.style.display = 'flex';
      
// Pasang fungsi iklan unduh ke tombol
const panggilIklanFull=()=>{try{(window.AdProvider=window.AdProvider||[]).push({"serve":{}})}catch(e){}};
if(btnStandard){btnStandard.onclick=()=>{if(data.standard){panggilIklanFull();setTimeout(()=>{window.open('https://divdown.net/api/download?url='+encodeURIComponent(data.standard),'_blank')},800)}else{alert(isID?"Video Standard tidak tersedia di dalam file asli.":"Standard Quality is not available for this video.")}}}
if(btnHD){btnHD.onclick=()=>{if(data.hd720){panggilIklanFull();setTimeout(()=>{window.open('https://divdown.net/api/download?url='+encodeURIComponent(data.hd720),'_blank')},800)}else{alert(isID?"Video 720p tidak tersedia.":"This video is not available in 720p quality.")}}}
} else {
  alert(isID?"Video tidak ditemukan. Silakan coba link lain.":"Video not found. Please try another link.");
  window.location.href = '../index.html';
}
} catch (err) {
  alert(isID?"Gagal mengambil file.\nSilakan refresh halaman 1 kali lalu tunggu sampai video muncul.":"Failed to load file.\nPlease refresh the page once and wait until the video appears.");
}
});

/* === BAGIAN 3: LOAD FAQ === */
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

// Fungsi Load Footer OK
async function loadFooter() {
  try {
    const res = await fetch('footer_rumah2.html');
    if (res.ok) document.getElementById('footer').innerHTML = await res.text();
  } catch (e) { console.log('Footer tidak dimuat'); }
}
