// APP_INDEX2.JS - RUMAH 2
document.addEventListener('DOMContentLoaded',async()=>{
const API_BASE=(location.hostname==='localhost'||location.hostname==='127.0.0.1')?'https://divdown.net':'';
/* === ADMAVEN LIGHTBOX TEST === */const loadLightbox=()=>{const s=document.createElement('script');s.setAttribute('data-cfasync','false');s.src='//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1414832';document.body.appendChild(s)};loadLightbox();
  
const savedLang=localStorage.getItem('divdown_rumah2_lang');const browserLang=(navigator.language||'en').toLowerCase();const rumah2Lang=savedLang||((browserLang.startsWith('id'))?'id':(browserLang.startsWith('hi'))?'hi':(browserLang.startsWith('th'))?'th':(browserLang.startsWith('ru'))?'ru':'en');if(!savedLang)localStorage.setItem('divdown_rumah2_lang',rumah2Lang);const isID=rumah2Lang==='id';

const infoKualitas=document.querySelector('.info-kualitas');if(infoKualitas){const infoText={id:'Kualitas Tinggi 1080–4K butuh waktu memproses. Tunggu 3–4 detik, unduhan akan muncul otomatis',en:'1080–4K High Quality needs processing time. Please wait 3–4 seconds, the download will appear automatically',hi:'1080–4K उच्च गुणवत्ता को प्रोसेस होने में समय लगता है। 3–4 सेकंड प्रतीक्षा करें, डाउनलोड अपने आप दिखाई देगा',th:'คุณภาพสูง 1080–4K ต้องใช้เวลาในการประมวลผล โปรดรอ 3–4 วินาที แล้วการดาวน์โหลดจะปรากฏโดยอัตโนมัติ',ru:'Высокое качество 1080–4K требует времени на обработку. Подождите 3–4 секунды, и загрузка появится автоматически'};infoKualitas.firstChild.textContent=infoText[rumah2Lang]+' ';} 
const thumb=document.getElementById('videoThumb');const btnWrap=document.getElementById('downloadWrap');const btnStandard=document.getElementById('dlStandard');const btnHD=document.getElementById('dl720');const btn1080=document.getElementById('dl1080');
  
const params=new URLSearchParams(window.location.search);const fbUrl=params.get('url');if(!fbUrl){window.location.href='../index.html';return;}
/* === AMBIL DARI SESSION / SERVER === */ try{let data=JSON.parse(sessionStorage.getItem('fbData')||'null');if(!data){const res=await fetch(API_BASE+'/api/facebook?url='+encodeURIComponent(fbUrl));data=await res.json();}
if(data.success){
/* === TAMPILKAN UI INSTAN === */ const loader=document.getElementById('thumbLoading');if(loader)loader.style.display='none';if(thumb){thumb.src=data.thumbnail;thumb.style.display='block';}if(btnWrap)btnWrap.style.display='flex';/* ADMAVEN INTERSTITIAL */
const loadInterstitial=()=>{const s=document.createElement('script');s.setAttribute('data-cfasync','false');s.src='//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1414662';document.body.appendChild(s)};

/* === DOWNLOAD VIDEO === */
if(btnStandard){if(data.standard&&data.standard.trim()){
btnStandard.onclick=()=>{loadInterstitial();window.open(API_BASE+'/api/download?url='+encodeURIComponent(data.standard),'_blank')
}}else{btnStandard.disabled=true;btnStandard.style.pointerEvents="none";btnStandard.style.opacity=".55";btnStandard.style.cursor="not-allowed";btnStandard.style.background="#8b8b8b";btnStandard.style.color="#e5e5e5";btnStandard.onclick=null;}}
if(btnHD){btnHD.onclick=()=>{if(data.hd720){
loadInterstitial();window.open(API_BASE+'/api/download?url='+encodeURIComponent(data.hd720),'_blank')
}else{alert(isID?"Video 720p tidak tersedia.":"720p Quality is not available.")}}}
if(btn1080){btn1080.onclick=()=>{loadInterstitial();window.open(API_BASE+'/api/download1080?url='+encodeURIComponent(fbUrl),'_blank')}}
}else{alert(isID?"Video tidak ditemukan.":"Video not found.");window.location.href='../index.html';}}catch(err){alert(isID?"Gagal mengambil file.":"Failed to load file.");}});
