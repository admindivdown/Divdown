// ======================================
// BAHASA.JS RUMAH 1 - FINAL CLEAN ENGINE
// ======================================
const cacheBahasa = {};
let bahasaAktif = 'english';
/* --- FUNGSI TAMBAHAN: SPINNER ELEGAN --- */
function tampilkanLoading(){let e=document.getElementById("loadingSpinner");if(!e){(e=document.createElement("div")).id="loadingSpinner",e.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid #587f30; border-radius:50%; animation: spin 1s linear infinite; z-index:99999; display:none;";let n=document.createElement("style");n.innerHTML="@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }",document.head.appendChild(n),document.body.appendChild(e)}e.style.display="block"}function sembunyikanLoading(){let e=document.getElementById("loadingSpinner");e&&(e.style.display="none")}

/* ---------- 1. FUNGSI MEMUAT FILE SCRIPT BAHASA EXTERNAL ---------- */
function loadFileBahasa(a){return new Promise(e=>{if(!a){e({});return}let r=a.replace("bahasa_","").toLowerCase().trim();if(cacheBahasa[r]){e(cacheBahasa[r]);return}let t=document.createElement("script");t.src=`bahasa/bahasa_${r}.js`,t.onload=()=>{let a=window[r]||window[r.charAt(0).toUpperCase()+r.slice(1)]||"undefined"!=typeof Window&&Window[r]||window[`bahasa_${r}`];cacheBahasa[r]=a||{},e(cacheBahasa[r])},t.onerror=()=>{console.error(`File bahasa/bahasa_${r}.js gagal dimuat!`),e({})},document.head.appendChild(t)})}

/* --- 2. FUNGSI SUNTIK TEKS AMAN --- */
function setText(e,n){let t=document.getElementById(e);t&&null!=n&&(t.innerHTML=n)}

/* --- 3. PROSES TEKS KE ELEMEN HTML --- */
function applyBahasa(data) {
  if (!data || Object.keys(data).length === 0) return;
  if (data.title) document.title = data.title;
  const input = document.getElementById('urlInput');
  if (input && data.placeholder) {
    input.placeholder = data.placeholder;
  }

  /* KOMPONEN FAQ */
  setText('faqTitle', data.faqTitle);
  setText('faqQ1', data.faqQ1);
  setText('faqA1', data.faqA1);
  setText('faqQ2', data.faqQ2);
  setText('faqA2', data.faqA2);
  setText('faqQ3', data.faqQ3);
  setText('faqA3', data.faqA3);
  setText('faqQ4', data.faqQ4);
  setText('faqA4', data.faqA4);
  setText('faqQ5', data.faqQ5);
  setText('faqA5', data.faqA5);

  /* KOMPONEN ABOUT */
  setText('aboutTitle', data.aboutTitle);
  setText('aboutText1', data.aboutText1);
  setText('aboutText2', data.aboutText2);

  /* KOMPONEN CONTACT */
  setText('contactTitle', data.contactTitle);
  setText('contactText1', data.contactText1);

  /* KOMPONEN PRIVACY POLICY */
  setText('privacyTitle', data.privacyTitle);
  setText('privacyText1', data.privacyText1);
  setText('privacySub1', data.privacySub1);
  setText('privacyText2', data.privacyText2);
  setText('privacySub2', data.privacySub2);
  setText('privacyText3', data.privacyText3);
  setText('privacySub3', data.privacySub3);
  setText('privacyText4', data.privacyText4);
  setText('privacySub4', data.privacySub4);
  setText('privacyText5', data.privacyText5);
  setText('privacySub5', data.privacySub5);
  setText('privacyText6', data.privacyText6);

  /* KOMPONEN TERMS OF SERVICE */
  setText('termsTitle', data.termsTitle);
  setText('termsText1', data.termsText1);
  setText('termsSub1', data.termsSub1);
  setText('termsText2', data.termsText2);
  setText('termsSub2', data.termsSub2);
  setText('termsText3', data.termsText3);
  setText('termsSub3', data.termsSub3);
  setText('termsText4', data.termsText4);
  setText('termsSub4', data.termsSub4);
  setText('termsSub5', data.termsSub5); 
  setText('termsText5', data.termsText5);
}
/* ---------- 4. FUNGSI PEMICU GANTI BAHASA ---------- */
async function gantiBahasa(namaBahasa, isManual = false) {
  if (!namaBahasa) return;
// Hanya tampilkan spinner jika user melakukan interaksi (isManual = true)
if(isManual)tampilkanLoading();
let namaMurni=namaBahasa.replace('bahasa_','').toLowerCase().trim();
bahasaAktif=namaMurni;
localStorage.setItem('userLanguage',namaMurni);
const data=await Promise.all([loadFileBahasa(namaMurni),isManual?new Promise(resolve=>setTimeout(resolve,800)):Promise.resolve()]).then(results=>results[0]);
applyBahasa(data);
const btn=document.getElementById('bahasaBtn');
if(btn&&data.bendera)btn.innerHTML=`${data.bendera} ${data.nama||'Language'}`;
sembunyikanLoading();
}