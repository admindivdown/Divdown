const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
app.use(cors());
app.use(express.json({verify:(req,res,buf)=>{req.rawBody=buf;}}));
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
  const cmd = `yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best" --merge-output-format mp4 --dump-single-json --no-warnings --no-check-certificate --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36" "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout) => {
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
app.get('/api/download1080',limitRequest,async(req,res)=>{const videoUrl=req.query.url;if(!videoUrl)return res.status(400).send('URL tidak ada');const tempDir='/tmp/divdown1080';const jobId=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const outputFile=path.join(tempDir,`video-${jobId}.mp4`);try{fs.mkdirSync(tempDir,{recursive:true});const cmd=`yt-dlp -f "bestvideo[height>=1080]+bestaudio/bestvideo[height<=1080]+bestaudio/best" --merge-output-format mp4 --no-warnings --no-check-certificate --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36" -o "${outputFile}" "${videoUrl}"`;exec(cmd,{maxBuffer:1024*5000},(error)=>{if(error||!fs.existsSync(outputFile)){console.error('1080P yt-dlp error:',error?.message||'File tidak dibuat');return res.status(500).send('Gagal memproses video 1080P');}const fileName = `Divdown_Video_${Math.floor(100000 + Math.random() * 900000)}.mp4`;res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
res.setHeader('Content-Type','video/mp4');const stream=fs.createReadStream(outputFile);const cleanup=()=>{if(fs.existsSync(outputFile))fs.unlink(outputFile,()=>{});};stream.on('error',()=>{cleanup();if(!res.headersSent)res.status(500).send('Download gagal');});stream.on('close',cleanup);req.on('close',()=>{if(!res.writableFinished)cleanup();});stream.pipe(res);});}catch(err){console.error('1080P error:',err.message);if(fs.existsSync(outputFile))fs.unlink(outputFile,()=>{});return res.status(500).send('Gagal memproses video 1080P');}});
/* === END DOWNLOAD 1080P === */

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});
