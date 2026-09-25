// APP_INDEX2.JS - RUMAH 2
document.addEventListener('DOMContentLoaded',async()=>{
const API_BASE=(location.hostname==='localhost'||location.hostname==='127.0.0.1')?'https://divdown.net':'';
const browserLang=(navigator.language||'').toLowerCase();const isID=browserLang.includes('id');loadFAQ();loadFooter();
  
const thumb=document.getElementById('videoThumb');const btnWrap=document.getElementById('downloadWrap');const btnStandard=document.getElementById('dlStandard');const btnHD=document.getElementById('dl720');const btn1080=document.getElementById('dl1080');
  
const params=new URLSearchParams(window.location.search);const fbUrl=params.get('url');if(!fbUrl){window.location.href='../index.html';return;}
/* === AMBIL DARI SESSION / SERVER === */ try{let data=JSON.parse(sessionStorage.getItem('fbData')||'null');if(!data){const res=await fetch(API_BASE+'/api/facebook?url='+encodeURIComponent(fbUrl));data=await res.json();}
if(data.success){
  
/* === TAMPILKAN UI INSTAN === */ const loader=document.getElementById('thumbLoading');if(loader)loader.style.display='none';if(thumb){thumb.src=data.thumbnail;thumb.style.display='block';}if(btnWrap)btnWrap.style.display='flex';
/* === DOWNLOAD VIDEO === */
if(btnStandard){if(data.standard&&data.standard.trim()){btnStandard.onclick=()=>{window.open(API_BASE+'/api/download?url='+encodeURIComponent(data.standard),'_blank')

}}else{btnStandard.disabled=true;btnStandard.style.pointerEvents="none";btnStandard.style.opacity=".55";btnStandard.style.cursor="not-allowed";btnStandard.style.background="#8b8b8b";btnStandard.style.color="#e5e5e5";btnStandard.onclick=null;}}
if(btnHD){btnHD.onclick=()=>{if(data.hd720){
window.open(API_BASE+'/api/download?url='+encodeURIComponent(data.hd720),'_blank')
}else{alert(isID?"Video 720p tidak tersedia.":"720p Quality is not available.")}}}

if(btn1080){btn1080.onclick=()=>{window.open(API_BASE+'/api/download1080?url='+encodeURIComponent(fbUrl),'_blank')}}

}else{alert(isID?"Video tidak ditemukan.":"Video not found.");window.location.href='../index.html';}}catch(err){alert(isID?"Gagal mengambil file.":"Failed to load file.");}});
/* === BAGIAN 3: LOAD FAQ === */ async function loadFAQ(){try{const res=await fetch('faq_rumah2.html');if(!res.ok)return;const html=await res.text();const target=document.getElementById('faq');if(target){target.innerHTML=html;let langCode='en';try{const geo=await fetch('https://ipapi.co/json/').then(r=>r.json());const country=(geo.country_code||'').toUpperCase();if(country==='ID')langCode='id';else if(country==='BR')langCode='br';else if(country==='RU')langCode='ru';}catch(e){const browserLang=(navigator.language||'').toLowerCase();if(browserLang.includes('id'))langCode='id';else if(browserLang.includes('pt'))langCode='br';else if(browserLang.includes('ru'))langCode='ru';}document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=el.getAttribute(`data-${langCode}`)||el.getAttribute('data-en');});}}catch(e){console.log('FAQ tidak dimuat');}}
/* === FUNGSI LOAD FOOTER === */ async function loadFooter(){try{const res=await fetch('footer_rumah2.html');if(res.ok)document.getElementById('footer').innerHTML=await res.text();}catch(e){console.log('Footer tidak dimuat');}}
