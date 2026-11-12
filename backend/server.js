const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { exec, execFile } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
app.use(cors());
app.use(express.json({verify:(req,res,buf)=>{req.rawBody=buf;}}));


app.get(/^\/(id|pt-br|hi|es|fil|vi|th|bn|ru)\/?$/, (req,res)=>{fs.readFile(path.join(__dirname,'..','index.html'),'utf8',(err,html)=>{if(err)return res.status(500).send('Page load error');const code=req.params[0],url='https://divdown.net/'+code+'/',seo={'id':{lang:'id',locale:'id_ID',title:'Pengunduh Video Facebook | Download Video Facebook | Divdown',desc:'Unduh video Facebook dan Reels dalam kualitas HD, 1080p, 2K, hingga 4K dengan Divdown. Gratis, cepat, dan mudah digunakan tanpa perlu login.'},'pt-br':{lang:'pt-BR',locale:'pt_BR',title:'Baixador de Vídeos do Facebook | Baixar Vídeos do Facebook | Divdown',desc:'Baixe vídeos e Reels do Facebook em HD, 1080p, 2K e até 4K com o Divdown. Grátis, rápido e fácil de usar. Não é necessário fazer login.'},'hi':{lang:'hi',locale:'hi_IN',title:'Facebook वीडियो डाउनलोडर | Facebook वीडियो डाउनलोड करें | Divdown',desc:'Divdown से Facebook वीडियो और Reels को HD, 1080p, 2K और 4K तक डाउनलोड करें। मुफ़्त, तेज़ और आसान। लॉगिन करने की ज़रूरत नहीं।'},'es':{lang:'es',locale:'es_ES',title:'Descargador de Videos de Facebook | Descargar Videos de Facebook | Divdown',desc:'Descarga videos y Reels de Facebook en HD, 1080p, 2K y hasta 4K con Divdown. Gratis, rápido y fácil de usar. Sin necesidad de iniciar sesión.'},'fil':{lang:'tl',locale:'tl_PH',title:'Facebook Video Downloader | Mag-download ng Facebook Videos | Divdown',desc:'Mag-download ng Facebook videos at Reels sa HD, 1080p, 2K, at hanggang 4K gamit ang Divdown. Libre, mabilis, at madaling gamitin. Hindi kailangan mag-login.'},'vi':{lang:'vi',locale:'vi_VN',title:'Trình Tải Video Facebook | Tải Video Facebook | Divdown',desc:'Tải video và Reels Facebook chất lượng HD, 1080p, 2K và lên đến 4K với Divdown. Miễn phí, nhanh chóng, dễ sử dụng và không cần đăng nhập.'},'th':{lang:'th',locale:'th_TH',title:'ดาวน์โหลดวิดีโอ Facebook | โปรแกรมดาวน์โหลดวิดีโอ Facebook | Divdown',desc:'ดาวน์โหลดวิดีโอและ Reels จาก Facebook ด้วย Divdown ในคุณภาพ HD, 1080p, 2K และสูงสุด 4K ฟรี รวดเร็ว ใช้งานง่าย และไม่ต้องเข้าสู่ระบบ'},'bn':{lang:'bn',locale:'bn_BD',title:'Facebook ভিডিও ডাউনলোডার | Facebook ভিডিও ডাউনলোড করুন | Divdown',desc:'Divdown দিয়ে HD, 1080p, 2K এবং 4K পর্যন্ত মানে Facebook ভিডিও ও Reels ডাউনলোড করুন। বিনামূল্যে, দ্রুত এবং সহজ। লগইন করার প্রয়োজন নেই।'},'ru':{lang:'ru',locale:'ru_RU',title:'Скачать видео с Facebook | Загрузчик видео Facebook | Divdown',desc:'Скачивайте видео и Reels с Facebook в HD, 1080p, 2K и до 4K с помощью Divdown. Бесплатно, быстро и просто. Без регистрации и входа.'}}[code];html=html
.replace('<html lang="en">','<html lang="'+seo.lang+'">').replace('<meta http-equiv="Content-Language" content="en">','<meta http-equiv="Content-Language" content="'+seo.lang+'">')  

.replace(/<title>[\s\S]*?<\/title>/,'<title>'+seo.title+'</title>').replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+seo.desc+'">').replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+seo.title+'">').replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+seo.desc+'">').replace(/<meta property="og:locale" content="[^"]*">/,'<meta property="og:locale" content="'+seo.locale+'">').replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+url+'">').replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+url+'">');res.type('html').send(html);});});

app.use(express.static(path.join(__dirname, '..')));

/* === GITHUB WEBHOOK === */
const webhookSecret=fs.readFileSync('/root/.divdown_webhook_secret','utf8').trim();
function verifyWebhook(req){
const signature=req.headers['x-hub-signature-256'];
if(!signature||!signature.startsWith('sha256='))return false;
const expected=crypto.createHmac('sha256',webhookSecret).update(req.rawBody).digest('hex');
const received=signature.slice(7);
if(received.length!==expected.length)return false;
return crypto.timingSafeEqual(Buffer.from(received),Buffer.from(expected));
}
app.post('/webhook',(req,res)=>{
  if(req.headers['x-github-event']!=='push')return res.status(200).send('Ignored');
if(!verifyWebhook(req))return res.status(401).send('Unauthorized');
if(req.body.ref!=='refs/heads/main')return res.status(200).send('Ignored');
res.status(200).send('Webhook received');
exec('cd /var/www/Divdown && git pull origin main && pm2 restart divdown',(error,stdout,stderr)=>{
if(error){console.error('Auto-deploy error:',error.message);return;}
console.log('Auto-deploy berhasil:');
console.log(stdout);
if(stderr)console.error(stderr);
});
});
/* === END WEBHOOK === */

/* === LIMIT USER === */
const rl=new Map();
function limitRequest(req,res,next){
const ip=req.ip,now=Date.now();
if(!rl.has(ip)){rl.set(ip,{c:1,t:now});return next();}
const d=rl.get(ip);
if(now-d.t>60000){rl.set(ip,{c:1,t:now});return next();}
if(d.c>=15){
return res.status(429).json({
message:"Server is limiting requests to prevent abuse. Please wait 60 seconds.\n\nServer membatasi dari serangan bot.\nSilahkan tunggu 60 detik"
});
}
d.c++;next();
}
/* === END === */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/api/facebook',limitRequest,(req,res)=>{
  const videoUrl = req.query.url;
  if(!videoUrl){
return res.status(400).json({
success:false,
message:"URL is missing.\n\nURL tidak ditemukan"
});
}

  // Sudah diperbaiki: hapus --impersonate, ganti pakai user-agent biasa
execFile('yt-dlp', ['-f', 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best', '--merge-output-format', 'mp4', '--dump-single-json', '--no-warnings', '--no-check-certificate', '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36', videoUrl], { maxBuffer: 1024 * 5000 }, (error, stdout) => {
    if (error) {
      console.error('Error yt-dlp:', error.message);
      return res.status(500).json({ success: false, message: 'Gagal memproses' });
    }

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats || [];

 const standard =
  formats.find(f =>
    f.height &&
    f.height < 720 &&
    f.url
  ) || data.url || null;

      const hd720 = formats.find(f => (f.format_id === 'hd' || f.height === 720) && f.url && f.acodec !== 'none') || 
                    formats.find(f => (f.format_id === 'hd' || f.height === 720) && f.url) || 
                    formats.find(f => f.height < 720 && f.url) || 
                    data.url || null;

      res.json({
  success: true,
  thumbnail: data.thumbnail || null,
  standard: standard?.url || standard || null,
  hd720: hd720?.url || hd720 || null
});

    } catch (e) {
      console.error('Error parse:', e.message);
      return res.status(500).json({ success: false, message: 'Error parsing data' });
    }
  });
});

app.get('/api/download', limitRequest, async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) {
    return res.status(400).send('URL tidak ada');
  }

  try {
    const response = await fetch(fileUrl);
const fileName = `Divdown_Video_${Math.floor(100000 + Math.random() * 900000)}.mp4`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'video/mp4');

    response.body.pipe(res);

  } catch (err) {
    res.status(500).send("Download failed.\n\nGagal mengunduh video");
  }
});


/* === DOWNLOAD 1080P === */
app.get('/api/download1080',limitRequest,async(req,res)=>{const videoUrl=req.query.url;if(!videoUrl)return res.status(400).send('URL tidak ada');const tempDir='/tmp/divdown1080';const jobId=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const outputFile=path.join(tempDir,`video-${jobId}.mp4`);try{fs.mkdirSync(tempDir,{recursive:true});execFile('yt-dlp',['-f','bestvideo[height>=1080]+bestaudio/bestvideo[height<=1080]+bestaudio/best','--merge-output-format','mp4','--no-warnings','--no-check-certificate','--user-agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36','-o',outputFile,videoUrl],{maxBuffer:1024*5000},(error)=>{if(error||!fs.existsSync(outputFile)){console.error('1080P yt-dlp error:',error?.message||'File tidak dibuat');return res.status(500).send('Gagal memproses video 1080P');}const fileName = `Divdown_Video_${Math.floor(100000 + Math.random() * 900000)}.mp4`;res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
res.setHeader('Content-Type','video/mp4');const stream=fs.createReadStream(outputFile);const cleanup=()=>{if(fs.existsSync(outputFile))fs.unlink(outputFile,()=>{});};stream.on('error',()=>{cleanup();if(!res.headersSent)res.status(500).send('Download gagal');});stream.on('close',cleanup);req.on('close',()=>{if(!res.writableFinished)cleanup();});stream.pipe(res);});}catch(err){console.error('1080P error:',err.message);if(fs.existsSync(outputFile))fs.unlink(outputFile,()=>{});return res.status(500).send('Gagal memproses video 1080P');}});
/* === END DOWNLOAD 1080P === */

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});
