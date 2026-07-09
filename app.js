// ======================================
// APP.JS RUMAH 1 - FINAL STABIL & CACHE AMAN
// ======================================

/* --- FUNGSI KOORDINATOR MENU --- */
function tutupSemuaMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (menuDropdown) menuDropdown.classList.remove('show-menu');
  const bahasaDropdown = document.querySelector('.bahasa-dropdown');
  if (bahasaDropdown) bahasaDropdown.classList.remove('show-bahasa');
}
/* ---------- 1. MUAT KOMPONEN HTML ---------- */
function loadFile(e,t,n){let r=`${t}?v=${Date.now()}`;return fetch(r).then(e=>{if(!e.ok)throw Error(n);return e.text()}).then(t=>{let n=document.getElementById(e);n&&(n.innerHTML=t)}).catch(e=>console.error(n,e))}

/* ---------- 2. INISIALISASI HALAMAN ---------- */
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
if (typeof gantiBahasa === 'function') {
  gantiBahasa(savedLang, false);
}
  });

  const input = document.getElementById('urlInput');
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') downloadVideo();
    });
  }
});

/* ---------- 3. FUNGSI UTAMA UNDUH (DENGAN URL PARAMETER) ---------- */
async function downloadVideo() {
  const btn = document.getElementById('downloadBtn');
  if (btn && btn.disabled) return;
  const input = document.getElementById('urlInput');
  if (!input) return;
  const url=input.value.trim();const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';if(!url){alert(isID?'Silakan masukkan tautan Facebook.':'Please enter a Facebook link.');return;}
  
/* === PROGRESS RUMAH 1 === */
const pb=document.getElementById('progressBox'),pf=document.getElementById('progressFill'),pt=document.getElementById('progressText');
if(pb&&pf&&pt){
pb.style.display='block';pf.style.width='0%';pt.textContent='0%';
let p=0;const i=setInterval(()=>{if(p<30)p+=3;else if(p<70)p+=2;else if(p<90)p+=1;else p+=0.5;if(p>100)p=100;pf.style.width=p+'%';pt.textContent=Math.floor(p)+'%';if(p>=100)clearInterval(i)},150);
}
/* === END === */
  
  const validDomains = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'];
  const isValid = validDomains.some(d => url.includes(d));
  if(!isValid){alert(isID?'Silakan gunakan tautan Facebook yang valid.':'Please use a valid Facebook link.');return;}
  btn.classList.add('loading');
btn.innerHTML = 'Memproses...';
btn.disabled = true;

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

}catch(err){
const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';
alert(isID
?'Gagal memproses video.\n\nSilakan coba lagi beberapa saat.'
:'Failed to process the video.\n\nPlease try again in a moment.');
btn.classList.remove('loading');
btn.innerHTML='Download';
btn.disabled=false;
}
}
  
/* ---------- 4. RESET TOMBOL KEMBALI ---------- */
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    const btn = document.getElementById('downloadBtn');
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = 'Download';
      btn.disabled = false;
    }
  }
});

// --- KENDALI MENU TERPADU (AMAN & TIDAK TERTUKAR) ---
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#menuBtn.menu-btn'); // satu penanda saja
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menuDropdown.classList.toggle('show-menu');
    menuBtn.classList.toggle('open', isOpen); // ikon selalu ikut kondisi menu
  });

  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('show-menu');
      menuBtn.classList.remove('open'); // pas tutup otomatis balikin ke garis
    }
  });
});
// ===== INSTALL DIVDOWN =====
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;});
document.getElementById("installAppBtn")?.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;});
// ===== END INSTALL DIVDOWN =====