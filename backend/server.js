const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Divdown aktif ✅');
});

app.get('/api/facebook', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ success: false, message: 'URL tidak ada' });
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

 const standard = formats.find(f =>
  f.height &&
  f.height <= 480 &&
  f.url
) || formats.find(f => f.url) || data.url || null;

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});
