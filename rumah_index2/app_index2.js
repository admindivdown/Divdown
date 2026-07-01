/* === APP_INDEX2.JS BAGIAN 1 === */
document.addEventListener('DOMContentLoaded', async () => {
  const browserLang = (navigator.language || '').toLowerCase();
const isID = browserLang.includes('id');
const serverInfo=document.getElementById('serverInfo');
/* === SERVER INFO (AUTO LANGUAGE) === */
if(serverInfo){
serverInfo.innerHTML=browserLang.includes('id')
?'<div class="faq-item" style="margin-bottom:12px"><div class="faq-question">Kenapa video gagal diproses?</div><div class="faq-answer">Terkadang server membutuhkan waktu lebih lama untuk mengambil data video dari Facebook. Jika proses gagal, cukup refresh halaman satu kali, tunggu beberapa detik hingga data muncul, lalu unduh kembali.</div></div>'
:browserLang.includes('pt')||browserLang.includes('br')
?'<div class="faq-item" style="margin-bottom:12px"><div class="faq-question">Por que meu vídeo não foi processado?</div><div class="faq-answer">Às vezes, o servidor precisa de mais tempo para obter os dados do Facebook. Se o processo falhar, atualize a página uma vez, aguarde alguns segundos e faça o download novamente.</div></div>'
:browserLang.includes('hi')||browserLang.includes('in')
?'<div class="faq-item" style="margin-bottom:12px"><div class="faq-question">मेरा वीडियो प्रोसेस क्यों नहीं हुआ?</div><div class="faq-answer">कभी-कभी Facebook से वीडियो डेटा प्राप्त करने में सर्वर को अधिक समय लगता है। यदि प्रक्रिया विफल हो जाए, तो पेज को एक बार रिफ्रेश करें, कुछ सेकंड प्रतीक्षा करें और फिर दोबारा डाउनलोड करें।</div></div>'
:'<div class="faq-item" style="margin-bottom:12px"><div class="faq-question">Why did my video fail to process?</div><div class="faq-answer">Sometimes our server needs more time to retrieve video data from Facebook. If the process fails, simply refresh the page once, wait a few seconds for the data to load, then download again.</div></div>';
}
/* === END SERVER INFO === */

  loadFAQ();
  loadFooter();
  const thumb = document.getElementById('videoThumb');
  
  const btnWrap = document.getElementById('downloadWrap');
  const btnStandard = document.getElementById('dlStandard');
const btnHD = document.getElementById('dl720');
const btnHQ = document.getElementById('dl1080');

  // Ambil URL langsung
  const params = new URLSearchParams(window.location.search);
  const fbUrl = params.get('url');

  if (!fbUrl) {
    window.location.href = '../index.html';
    return;
  }

  // Fetch langsung ke server vps
  try {
    const response = await fetch('https://divdown.net/api/facebook?url=' + encodeURIComponent(fbUrl));
    const data = await response.json();

    if (data.success) {
// Tampilkan UI
      if (thumb) {
        const loader=document.getElementById('thumbLoading');
        thumb.onload=()=>{if(loader)loader.style.display='none';};
        thumb.src=data.thumbnail;
        thumb.style.display='block';
      }
      if (btnWrap) btnWrap.style.display = 'flex';
      
// Pasang fungsi unduh ke tombol
if (btnStandard) {
  btnStandard.onclick = () => {
    if (data.standard) {
      window.open('https://divdown.net/api/download?url='+encodeURIComponent(data.standard),'_blank');
    } else {
      alert(isID?"Video Standard tidak tersedia di dalam file asli.":"Standard Quality is not available for this video.");
    }
  };
}

if (btnHD) {
  btnHD.onclick = () => {
    if (data.hd720) {
      window.open('https://divdown.net/api/download?url='+encodeURIComponent(data.hd720),'_blank');
    } else {
      alert(isID?"Video 720p tidak tersedia.":"This video is not available in 720p quality.");
    }
  };
}
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
