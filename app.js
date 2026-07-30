// APP.JS RUMAH 1 - FINAL STABIL & CACHE
/* --- FUNGSI KOORDINATOR MENU --- */
function tutupSemuaMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (menuDropdown) menuDropdown.classList.remove('show-menu');
  const bahasaDropdown = document.querySelector('.bahasa-dropdown');
  if (bahasaDropdown) bahasaDropdown.classList.remove('show-bahasa');
}
/* --- 1. MUAT KOMPONEN HTML --- */
function loadFile(e,t,n){let k='cache_'+t,h=sessionStorage.getItem(k);if(h){let x=document.getElementById(e);x&&(x.innerHTML=h);return Promise.resolve()}return fetch(t).then(r=>{if(!r.ok)throw Error(n);return r.text()}).then(d=>{sessionStorage.setItem(k,d);let x=document.getElementById(e);x&&(x.innerHTML=d)}).catch(err=>console.error(n,err))}
/* --- 2. INISIALISASI HALAMAN --- */
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    loadFile('about', './about.html', 'Gagal muat Tentang'),
    loadFile('kontak', './kontak.html', 'Gagal muat Kontak'),
    loadFile('privacy', './privacy.html', 'Gagal muat Kebijakan'),
    loadFile('footer', './footer.html', 'Gagal muat Footer'),
    loadFile('panduan', './panduan.html', 'Gagal muat Panduan'),
// 🔥 TAMBAHAN PENTING
  ]).then(() => { let savedLang = localStorage.getItem('userLanguage');

 if (!savedLang) { const browserLang = (navigator.language || '').toLowerCase(); if (browserLang.includes('id')) savedLang = 'indonesia'; else if (browserLang.includes('pt') || browserLang.includes('br')) savedLang = 'brazil'; else if (browserLang.includes('hi') || browserLang.includes('in')) savedLang = 'india'; else savedLang = 'english'; } else { savedLang = savedLang.toLowerCase().trim(); }
// 🔥 WAJIB ADA INI BIAR FAQ KEISI
if(typeof gantiBahasa==='function'){gantiBahasa(savedLang,false).then(()=>{const d=cacheBahasa[bahasaAktif]||{};setText('termsTitle',d.termsTitle);});}});const input=document.getElementById('urlInput');if(input){input.addEventListener('keypress',e=>{if(e.key==='Enter')downloadVideo()});}});
/* --- 3. FUNGSI UTAMA UNDUH --- */
async function downloadVideo(){const btn=document.getElementById('downloadBtn');if(btn&&btn.disabled)return;const input=document.getElementById('urlInput');if(!input)return;const url=input.value.trim();const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';if(!url){alert(isID?'Silakan masukkan tautan Facebook.':'Please enter a Facebook link.');return;}
/* === PROGRESS RUMAH 1 === */
  const validDomains = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'];
  const isValid = validDomains.some(d => url.includes(d));
  if(!isValid){alert(isID?'Silakan gunakan tautan Facebook yang valid.':'Please use a valid Facebook link.');return;}
  const pb=document.getElementById('progressBox'),pf=document.getElementById('progressFill'),pt=document.getElementById('progressText');
if(pb&&pf&&pt){pb.style.display='block';pf.style.width='0%';pt.textContent='0%';let p=0;const i=setInterval(()=>{if(p<80)p+=3.5;else if(p<94)p+=0.30;else if(p<97)p+=0.085;else p=97;pf.style.width=p+'%';pt.textContent=Math.floor(p)+'%';if(p>=97)clearInterval(i)},85)}
/* === TOMBOL PROCESSING === */
btn.classList.add('loading');
btn.querySelector('.btn-text').textContent='Processing...';
btn.disabled=true;
/* === END TOMBOL PROCESSING === */
try{let data=null;try{const res=await fetch('https://divdown.net/api/facebook?url='+encodeURIComponent(url));data=await res.json();if(!data.success)throw new Error();}catch(e){await new Promise(r=>setTimeout(r,500));const res=await fetch('https://divdown.net/api/facebook?url='+encodeURIComponent(url));data=await res.json();if(!data.success)throw new Error();}
/* === SIMPAN DATA UNTUK RUMAH 2 === */
sessionStorage.setItem('fbData',JSON.stringify(data));
/* === MASUK RUMAH 2 === */
window.location.href=`rumah_index2/index.html?url=${encodeURIComponent(url)}`;
}catch(err){const isID=(localStorage.getItem('userLanguage')||'').toLowerCase()==='indonesia';alert(isID?'Gagal memproses video.\n\nSilakan coba lagi beberapa saat.':'Failed to process the video.\n\nPlease try again in a moment.');
/* === RESET TOMBOL === */
btn.classList.remove('loading');
btn.querySelector('.btn-text').textContent='Download';btn.disabled=false;}}
/* --- 4. RESET TOMBOL KEMBALI --- */
window.addEventListener('pageshow',function(e){if(e.persisted){const btn=document.getElementById('downloadBtn');if(btn){btn.classList.remove('loading');btn.querySelector('.btn-text').textContent='Download';btn.disabled=false;}}});
// --- KENDALI MENU TERPADU (AMAN) ---
document.addEventListener('DOMContentLoaded',()=>{const menuBtn=document.querySelector('#menuBtn.menu-btn');const menuDropdown=document.getElementById('menuDropdown');if(!menuBtn||!menuDropdown)return;
menuBtn.addEventListener('click',e=>{
e.stopPropagation();
const isOpen=menuDropdown.classList.toggle('show-menu');
menuBtn.classList.toggle('open',isOpen);
});
document.addEventListener('click',e=>{if(!menuBtn.contains(e.target)&&!menuDropdown.contains(e.target)){menuDropdown.classList.remove('show-menu');menuBtn.classList.remove('open');}});});
// ===== INSTALL DIVDOWN =====
let deferredPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;});
document.getElementById("installAppBtn")?.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;});
/* ===== FAQ TOGGLE + LAZY LOAD ===== */document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("faqHeader"),c=document.getElementById("faqContent"),a=document.getElementById("faqArrow");if(!t||!c)return;t.addEventListener("click",()=>{if(!window.faqLoaded)loadFaq();const o=c.style.display==="block";c.style.display=o?"none":"block";a&&(a.style.transform=o?"rotate(0deg)":"rotate(180deg)");});});
/* ===== FAQ LAZY (MUAT SEKALI) ===== */
function loadFaq(){window.faqLoaded=true;if(typeof cacheBahasa==="undefined")return;const d=cacheBahasa[bahasaAktif]||{};setText('faqQ1',d.faqQ1);setText('faqA1',d.faqA1);setText('faqQ2',d.faqQ2);setText('faqA2',d.faqA2);setText('faqQ3',d.faqQ3);setText('faqA3',d.faqA3);setText('faqQ4',d.faqQ4);setText('faqA4',d.faqA4);setText('faqQ5',d.faqQ5);setText('faqA5',d.faqA5);}
/* ===== END FAQ LAZY LOAD ===== */
/* ===== TERMS LAZY LOAD ===== */
function loadTerms(){if(window.termsLoaded)return;window.termsLoaded=true;fetch('./terms.html').then(r=>{if(!r.ok)throw Error();return r.text()}).then(h=>{document.getElementById('termsContent').innerHTML=h;if(typeof cacheBahasa!=="undefined"){const d=cacheBahasa[bahasaAktif]||{};setText('termsTitle',d.termsTitle);setText('termsText1',d.termsText1);setText('termsSub1',d.termsSub1);setText('termsText2',d.termsText2);setText('termsSub2',d.termsSub2);setText('termsText3',d.termsText3);setText('termsSub3',d.termsSub3);setText('termsText4',d.termsText4);setText('termsSub4',d.termsSub4);setText('termsText5',d.termsText5);}}).catch(()=>console.error("Gagal muat Syarat"));}

document.addEventListener("DOMContentLoaded",()=>{const h=document.getElementById("termsHeader"),c=document.getElementById("termsContent"),a=document.getElementById("termsArrow");if(!h||!c)return;h.addEventListener("click",()=>{if(!window.termsLoaded)loadTerms();const o=c.style.display==="block";c.style.display=o?"none":"block";a&&(a.style.transform=o?"rotate(0deg)":"rotate(180deg)");});});
