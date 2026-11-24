const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const dns = require('dns').promises;
const net = require('net');
const https = require('https');
const { execFile } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
app.set('trust proxy', 'loopback');
app.use(cors());
app.use(express.json({verify:(req,res,buf)=>{req.rawBody=buf;}}));

// === VALIDASI URL FACEBOOK ===
function isAllowedFacebookUrl(value) {
if (typeof value !== 'string' || value.length > 4096) return false;
try {
const u = new URL(value);
const h = u.hostname.toLowerCase().replace(/\.$/, '');
const domains = ['facebook.com', 'fb.watch', 'fb.com'];
return u.protocol === 'https:' && !u.username && !u.password &&
domains.some(d => h === d || h.endsWith('.' + d));
} catch {
  return false;
  }
}
// === END VALIDASI URL FACEBOOK ===

// === CEK IP PUBLIK ===
const blockedIPv4 = new net.BlockList(), blockedIPv6 = new net.BlockList(), globalIPv6 = new net.BlockList();
const privateRangesV4 = ['0.0.0.0/8','10.0.0.0/8','100.64.0.0/10','127.0.0.0/8','169.254.0.0/16','172.16.0.0/12','192.0.0.0/24','192.0.2.0/24','192.88.99.0/24','192.168.0.0/16','198.18.0.0/15','198.51.100.0/24','203.0.113.0/24','224.0.0.0/4','240.0.0.0/4'];
const privateRangesV6 = ['2001::/23','2001:db8::/32','2002::/16','3fff::/20'];
for (const range of privateRangesV4) { const [ip,prefix] = range.split('/'); blockedIPv4.addSubnet(ip,Number(prefix),'ipv4'); }
for (const range of privateRangesV6) { const [ip,prefix] = range.split('/'); blockedIPv6.addSubnet(ip,Number(prefix),'ipv6'); }
globalIPv6.addSubnet('2000::',3,'ipv6');
function isPublicIp(ip) { const version = net.isIP(ip); if (version === 4) return !blockedIPv4.check(ip,'ipv4'); if (version === 6) return globalIPv6.check(ip,'ipv6') && !blockedIPv6.check(ip,'ipv6'); return false; }
// === END CEK IP PUBLIK ===

// === VALIDASI URL MEDIA FACEBOOK ===
function isAllowedMediaUrl(value) {
if (typeof value !== 'string' || value.length > 8192) return false;
try {
const u = new URL(value);
const h = u.hostname.toLowerCase().replace(/\.$/, '');
const domains = ['fbcdn.net', 'fbsbx.com', 'facebook.com'];
return u.protocol === 'https:' && !u.username && !u.password && domains.some(d => h === d || h.endsWith('.' + d));
 } catch { return false; }
}
// === END VALIDASI URL MEDIA FACEBOOK ===

// === FETCH MEDIA AMAN + DNS PINNING ===
async function fetchMediaRedirect(url, redirects = 0, signal) {
if (!isAllowedMediaUrl(url)) throw new Error('URL media tidak valid');
if (redirects > 5) throw new Error('Redirect terlalu banyak');
if (signal?.aborted) throw new Error('Download dibatalkan');
const parsed = new URL(url), hostname = parsed.hostname;
const records = await dns.lookup(hostname, { all: true, verbatim: true });
if (signal?.aborted) throw new Error('Download dibatalkan');
if (!records.length || records.some(r => !isPublicIp(r.address))) throw new Error('IP server media tidak aman');
const pinnedLookup = (host, options, callback) => {
if (host.toLowerCase() !== hostname.toLowerCase()) return callback(new Error('Hostname tidak cocok'));
const family = options?.family || 0, found = records.filter(r => !family || r.family === family);
if (!found.length) return callback(new Error('IP tidak tersedia'));
if (options?.all) return callback(null, found);
callback(null, found[0].address, found[0].family);
};
const agent = new https.Agent({ keepAlive: false, lookup: pinnedLookup });
try {
const response = await fetch(url, { redirect: 'manual', agent, signal });
if ([301,302,303,307,308].includes(response.status)) {
const location = response.headers.get('location');
response.body?.destroy(); agent.destroy();
if (!location) throw new Error('Redirect tidak valid');
return fetchMediaRedirect(new URL(location, url).toString(), redirects + 1, signal);
}
const cleanup = () => agent.destroy();
if (response.body) { response.body.once('end', cleanup); response.body.once('close', cleanup); response.body.once('error', cleanup); }
else cleanup();
return response;
} catch (err) { agent.destroy(); throw err; }
}
// === END FETCH MEDIA AMAN ===

app.get(/^\/(id|pt-br|hi|es|fil|vi|th|bn|ru)\/?$/,
(req,res)=>{fs.readFile(path.join(__dirname,'..','index.html'),'utf8',(err,html)=>{if(err)return res.status(500).send('Page load error');const code=req.params[0],url='https://divdown.net/'+code+'/',seo={'id':{lang:'id',locale:'id_ID',title:'Pengunduh Video Facebook | Download Video Facebook | Divdown',desc:'Unduh video Facebook dan Reels dalam kualitas HD, 1080p, 2K, hingga 4K dengan Divdown. Gratis, cepat, dan mudah digunakan tanpa perlu login.'},'pt-br':{lang:'pt-BR',locale:'pt_BR',title:'Baixador de Vídeos do Facebook | Baixar Vídeos do Facebook | Divdown',desc:'Baixe vídeos e Reels do Facebook em HD, 1080p, 2K e até 4K com o Divdown. Grátis, rápido e fácil de usar. Não é necessário fazer login.'},'hi':{lang:'hi',locale:'hi_IN',title:'Facebook वीडियो डाउनलोडर | Facebook वीडियो डाउनलोड करें | Divdown',desc:'Divdown से Facebook वीडियो और Reels को HD, 1080p, 2K और 4K तक डाउनलोड करें। मुफ़्त, तेज़ और आसान। लॉगिन करने की ज़रूरत नहीं।'},'es':{lang:'es',locale:'es_ES',title:'Descargador de Videos de Facebook | Descargar Videos de Facebook | Divdown',desc:'Descarga videos y Reels de Facebook en HD, 1080p, 2K y hasta 4K con Divdown. Gratis, rápido y fácil de usar. Sin necesidad de iniciar sesión.'},'fil':{lang:'tl',locale:'tl_PH',title:'Facebook Video Downloader | Mag-download ng Facebook Videos | Divdown',desc:'Mag-download ng Facebook videos at Reels sa HD, 1080p, 2K, at hanggang 4K gamit ang Divdown. Libre, mabilis, at madaling gamitin. Hindi kailangan mag-login.'},'vi':{lang:'vi',locale:'vi_VN',title:'Trình Tải Video Facebook | Tải Video Facebook | Divdown',desc:'Tải video và Reels Facebook chất lượng HD, 1080p, 2K và lên đến 4K với Divdown. Miễn phí, nhanh chóng, dễ sử dụng và không cần đăng nhập.'},'th':{lang:'th',locale:'th_TH',title:'ดาวน์โหลดวิดีโอ Facebook | โปรแกรมดาวน์โหลดวิดีโอ Facebook | Divdown',desc:'ดาวน์โหลดวิดีโอและ Reels จาก Facebook ด้วย Divdown ในคุณภาพ HD, 1080p, 2K และสูงสุด 4K ฟรี รวดเร็ว ใช้งานง่าย และไม่ต้องเข้าสู่ระบบ'},'bn':{lang:'bn',locale:'bn_BD',title:'Facebook ভিডিও ডাউনলোডার | Facebook ভিডিও ডাউনলোড করুন | Divdown',desc:'Divdown দিয়ে HD, 1080p, 2K এবং 4K পর্যন্ত মানে Facebook ভিডিও ও Reels ডাউনলোড করুন। বিনামূল্যে, দ্রুত এবং সহজ। লগইন করার প্রয়োজন নেই।'},'ru':{lang:'ru',locale:'ru_RU',title:'Скачать видео с Facebook | Загрузчик видео Facebook | Divdown',desc:'Скачивайте видео и Reels с Facebook в HD, 1080p, 2K и до 4K с помощью Divdown. Бесплатно, быстро и просто. Без регистрации и входа.'}}[code];html=html
.replace('<html lang="en">','<html lang="'+seo.lang+'">').replace('<meta http-equiv="Content-Language" content="en">','<meta http-equiv="Content-Language" content="'+seo.lang+'">')  

.replace(/<title>[\s\S]*?<\/title>/,'<title>'+seo.title+'</title>').replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+seo.desc+'">').replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+seo.title+'">').replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+seo.desc+'">').replace(/<meta property="og:locale" content="[^"]*">/,'<meta property="og:locale" content="'+seo.locale+'">').replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+url+'">').replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+url+'">');res.type('html').send(html);});});
app.use(express.static(path.join(__dirname, '..')));

/* === GITHUB WEBHOOK === */
const webhookSecret=fs.readFileSync('/etc/divdown/webhook.secret','utf8').trim();
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
execFile('/usr/bin/sudo',['-n','/usr/local/sbin/divdown-deploy'],(error,stdout,stderr)=>{
if(error){console.error('Auto-deploy error:',error.message);return;}
console.log('Auto-deploy berhasil:');
console.log(stdout);
if(stderr)console.error(stderr);
});
});
/* === END WEBHOOK === */

/* === LIMIT USER === */
const rl=new Map();
function limitRequest(req,res,next){const ip=req.ip||req.socket.remoteAddress||'unknown',now=Date.now(),windowMs=60000,maxRequests=15;let data=rl.get(ip);if(!data||now-data.t>windowMs){rl.set(ip,{c:1,t:now});return next();}if(data.c>=maxRequests)return res.status(429).json({message:"Server is limiting requests to prevent abuse. Please wait 60 seconds.\n\nServer membatasi permintaan untuk mencegah penyalahgunaan. Silakan tunggu 60 detik."});data.c++;next();}
setInterval(()=>{const now=Date.now();for(const [ip,data] of rl){if(now-data.t>60000)rl.delete(ip);}},300000).unref();
/* === END === */
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/api/facebook',limitRequest,(req,res)=>{
const videoUrl = req.query.url;
if (!videoUrl) {
return res.status(400).json({
success: false,
message: "URL is missing.\n\nURL tidak ditemukan"
});
}
if (!isAllowedFacebookUrl(videoUrl)) {
return res.status(400).json({
success: false,
message: "Invalid Facebook URL"
});
}

// Sudah diperbaiki: hapus --impersonate, ganti pakai user-agent biasa
execFile('/opt/divdown/venv/bin/yt-dlp', ['-f', 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best', '--merge-output-format', 'mp4', '--dump-single-json', '--no-warnings',  '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36', videoUrl], 
{ maxBuffer: 1024 * 5000, timeout: 120000, killSignal: 'SIGKILL' }
, (error, stdout) => {
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
formats.find(f => f.height < 720 && f.url) || data.url || null;

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

app.get('/api/download',limitRequest,async(req,res)=>{const fileUrl=req.query.url;if(!fileUrl)return res.status(400).send('URL tidak ada');if(!isAllowedMediaUrl(fileUrl))return res.status(400).send('URL video tidak valid');const controller=new AbortController();req.on('aborted',()=>controller.abort());res.on('close',()=>{if(!res.writableFinished)controller.abort();});try{const response=await fetchMediaRedirect(fileUrl,0,controller.signal);if(!response.ok||!response.body){response.body?.destroy();return res.status(502).send('Video gagal diambil dari server Facebook');}const fileName=`Divdown_Video_${Math.floor(100000+Math.random()*900000)}.mp4`;res.setHeader('Content-Disposition',`attachment; filename="${fileName}"`);res.setHeader('Content-Type','video/mp4');response.body.on('error',()=>{if(!res.headersSent)res.status(502).send('Download gagal');else res.destroy();});response.body.pipe(res);}catch(err){if(controller.signal.aborted)return;console.error('Download error:',err.message);if(!res.headersSent)res.status(502).send('Download failed.\n\nGagal mengunduh video');else res.destroy();}});

/* === DOWNLOAD 1080P === */
app.get('/api/download1080',limitRequest,async(req,res)=>{const videoUrl=req.query.url;if(!videoUrl)return res.status(400).send('URL tidak ada');if(!isAllowedFacebookUrl(videoUrl))return res.status(400).send('URL Facebook tidak valid');const tempDir='/var/lib/divdown/tmp';const jobId=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const outputFile=path.join(tempDir,`video-${jobId}.mp4`);const cleanup=()=>{fs.unlink(outputFile,()=>{});};try{fs.mkdirSync(tempDir,{recursive:true});const child=execFile('/opt/divdown/venv/bin/yt-dlp',[
'-f','bestvideo*+bestaudio/best',
'--merge-output-format','mp4','--no-warnings','--user-agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36','-o',outputFile,videoUrl],{maxBuffer:1024*5000,timeout:600000,killSignal:'SIGKILL'},(error)=>{if(error||!fs.existsSync(outputFile)){console.error('1080P yt-dlp error:',error?.message||'File tidak dibuat');cleanup();if(!res.headersSent&&!res.destroyed)return res.status(500).send('Gagal memproses video 1080P');return;}if(res.destroyed){cleanup();return;}const fileName=`Divdown_Video_${Math.floor(100000+Math.random()*900000)}.mp4`;res.setHeader('Content-Disposition',`attachment; filename="${fileName}"`);res.setHeader('Content-Type','video/mp4');const stream=fs.createReadStream(outputFile);stream.on('error',()=>{cleanup();if(!res.headersSent)res.status(500).send('Download gagal');else res.destroy();});stream.on('close',cleanup);res.on('close',()=>{if(!res.writableFinished)cleanup();});stream.pipe(res);});res.on('close',()=>{if(!res.writableFinished){child.kill('SIGKILL');cleanup();}});}catch(err){console.error('1080P error:',err.message);cleanup();if(!res.headersSent&&!res.destroyed)return res.status(500).send('Gagal memproses video 1080P');}});
/* === END DOWNLOAD 1080P === */

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server jalan di port ${PORT}`);
});
