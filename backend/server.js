const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
/* === YT-DLP RUNNER === */
function runYtDlp(cmd){
return new Promise((resolve,reject)=>{
exec(cmd,{maxBuffer:1024*5000},(error,stdout)=>{
if(error)return reject(error);
resolve(stdout);
});
});
}
/* === END YT-DLP RUNNER === */

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
  res.send('Backend Divdown aktif ✅');
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

/* === JALANKAN YT-DLP + RETRY 1X === */
(async()=>{
try{
let stdout;
try{
stdout=await runYtDlp(cmd);

}catch(e){
console.log("Retry yt-dlp after 1 second...");
await new Promise(r=>setTimeout(r,1000));
stdout=await runYtDlp(cmd);
}

const data=JSON.parse(stdout);
const formats=data.formats||[];
const standard=formats.find(f=>f.height&&f.height<720&&f.url)||data.url||null;
const hd720=formats.find(f=>(f.format_id==="hd"||f.height===720)&&f.url&&f.acodec!=="none")||
formats.find(f=>(f.format_id==="hd"||f.height===720)&&f.url)||
formats.find(f=>f.height<720&&f.url)||
data.url||null;

res.json({
success:true,
thumbnail:data.thumbnail||null,
standard:standard?.url||standard||null,
hd720:hd720?.url||hd720||null
});
}catch(e){
if(e instanceof SyntaxError){
console.error("Error parse:",e.message);
return res.status(500).json({success:false,message:"Error parsing data"});
}
console.error("Error yt-dlp:",e.message);
return res.status(500).json({success:false,message:"Gagal memproses"});
}
})();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});
