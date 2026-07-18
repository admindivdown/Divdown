// ======================================
// APP.JS RUMAH 1 - FINAL STABIL & CACHE
// ======================================

/* --- FUNGSI KOORDINATOR MENU --- */
function tutupSemuaMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (menuDropdown) menuDropdown.classList.remove('show-menu');
  const bahasaDropdown = document.querySelector('.bahasa-dropdown');
  if (bahasaDropdown) bahasaDropdown.classList.remove('show-bahasa');
}
/* --- 1. MUAT KOMPONEN HTML --- */
function loadFile(e,t,n){let r=`${t}?v=${Date.now()}`;return fetch(r).then(e=>{if(!e.ok)throw Error(n);return e.text()}).then(t=>{let n=document.getElementById(e);n&&(n.innerHTML=t)}).catch(e=>console.error(n,e))}

/* --- 2. INISIALISASI HALAMAN --- */
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    loadFile('about', './about.html', 'Gagal muat Tentang'),
    loadFile('kontak', './kontak.html', 'Gagal muat Kontak'),
    loadFile('privacy', './privacy.html', 'Gagal muat Kebijakan'),
    loadFile('terms', './terms.html', 'Gagal muat Syarat'),
    loadFile('footer', './footer.html', 'Gagal muat Footer'),
    // 🔥 TAMBAHAN PENTING
  ]).then(() => {

    let savedLang = localStorage.getItem('userLanguage');

    if (!savedLang) {
      const browserLang = (navigator.language || '').toLowerCase();
      if (browserLang.includes('id')) savedLang = 'indonesia';
      else if (browserLang.includes('pt') || browserLang.includes('br')) savedLang = 'brazil';
      else if (browserLang.includes('hi') || browserLang.includes('in')) savedLang = 'india';
      else savedLang = 'english';
    } else {
      savedLang = savedLang.toLowerCase().trim();
    }

// 🔥 WAJIB ADA INI BIAR FAQ KEISI
if(typeof gantiBahasa==='function'){gantiBahasa(savedLang,false);}});const input=document.getElementById('urlInput');if(input){input.addEventListener('keypress',e=>{if(e.key==='Enter')downloadVideo()});}});

/* --- 3. FUNGSI UTAMA UNDUH --- */
async function downloadVideo() {
  const btn = document.getElementById('downloadBtn');
  if (btn && btn.disabled) return;
  const input = document.getElementById('urlInput');
  if (!input) return;
  const url=input.value.trim();const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';if(!url){alert(isID?'Silakan masukkan tautan Facebook.':'Please enter a Facebook link.');return;}
  
/* === PROGRESS RUMAH 1 === */
  const validDomains = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'];
  const isValid = validDomains.some(d => url.includes(d));
  if(!isValid){alert(isID?'Silakan gunakan tautan Facebook yang valid.':'Please use a valid Facebook link.');return;}

  const pb=document.getElementById('progressBox'),pf=document.getElementById('progressFill'),pt=document.getElementById('progressText');
  if(pb&&pf&&pt){pb.style.display='block';pf.style.width='0%';pt.textContent='0%';let p=0;const i=setInterval(()=>{if(p<40)p+=4;else if(p<60)p+=3;else if(p<80)p+=1;else if(p<90)p+=0.5;else if(p<98)p+=0.2;else p=98;pf.style.width=p+'%';pt.textContent=Math.floor(p)+'%';if(p>=98)clearInterval(i)},150)}
/* === END === */

/* === TOMBOL PROCESSING === */
btn.classList.add('loading');
btn.querySelector('.btn-text').textContent='Processing...';
btn.disabled=true;
/* === END TOMBOL PROCESSING === */
  try{
let data=null;
try{
const res=await fetch('https://divdown.net/api/facebook?url='+encodeURIComponent(url));
data=await res.json();
if(!data.success)throw new Error();
}catch(e){
await new Promise(r=>setTimeout(r,500));
const res=await fetch('https://divdown.net/api/facebook?url='+encodeURIComponent(url));
data=await res.json();
if(!data.success)throw new Error();
}

/* === SIMPAN DATA UNTUK RUMAH 2 === */
sessionStorage.setItem('fbData',JSON.stringify(data));
/* === MASUK RUMAH 2 === */
window.location.href=`rumah_index2/index.html?url=${encodeURIComponent(url)}`;
}catch(err){const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';alert(isID?'Gagal memproses video.\n\nSilakan coba lagi beberapa saat.':'Failed to process the video.\n\nPlease try again in a moment.');
/* === RESET TOMBOL === */
btn.classList.remove('loading');
btn.querySelector('.btn-text').textContent='Download';
btn.disabled=false;
}}
/* === END RESET TOMBOL === */

/* --- 4. RESET TOMBOL KEMBALI --- */
window.addEventListener('pageshow',function(e){if(e.persisted){const btn=document.getElementById('downloadBtn');if(btn){btn.classList.remove('loading');btn.querySelector('.btn-text').textContent='Download';btn.disabled=false;}}});

// --- KENDALI MENU TERPADU (AMAN) ---
document.addEventListener('DOMContentLoaded',()=>{const menuBtn=document.querySelector('#menuBtn.menu-btn');const menuDropdown=document.getElementById('menuDropdown');if(!menuBtn||!menuDropdown)return;menuBtn.addEventListener('click',e=>{e.stopPropagation();const isOpen=menuDropdown.classList.toggle('show-menu');menuBtn.classList.toggle('open',isOpen);});document.addEventListener('click',e=>{if(!menuBtn.contains(e.target)&&!menuDropdown.contains(e.target)){menuDropdown.classList.remove('show-menu');menuBtn.classList.remove('open');}});});

// ===== INSTALL DIVDOWN =====
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;});
document.getElementById("installAppBtn")?.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;});
// ===== END INSTALL DIVDOWN =====

// ===== LOAD BANNER ADSTERRA 320x50 =====
document.addEventListener('DOMContentLoaded',()=>{const box=document.getElementById('banner320Box');if(!box)return;const s1=document.createElement('script');s1.text="atOptions={key:'a9e26a5898162babbd39410bf67794d2',format:'iframe',height:50,width:320,params:{}};";const s2=document.createElement('script');s2.src='https://www.highperformanceformat.com/a9e26a5898162babbd39410bf67794d2/invoke.js';s2.async=true;box.appendChild(s1);box.appendChild(s2);});
// ===== END BANNER ADSTERRA =====