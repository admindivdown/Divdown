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

  // Menambahkan --user-agent agar Facebook tidak memblokir request
  const cmd = `python3 -m yt_dlp --dump-single-json --no-warnings --skip-download --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Gagal memproses' });
    }

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats || [];

      // Filter untuk 720p
      const hd720 = formats
        .filter(f => f.height === 720 && f.url && f.vcodec !== 'none' && f.acodec !== 'none')
        .sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0];

      // Filter untuk 1080p
      const hd1080 = formats
        .filter(f => f.height === 1080 && f.url && f.vcodec !== 'none' && f.acodec !== 'none')
        .sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0];

      res.json({
        success: true,
        thumbnail: data.thumbnail,
        hd720: hd720?.url || null,
        hd1080: hd1080?.url || null
      });

    } catch (e) {
      return res.status(500).json({ success: false, message: 'Error parsing data' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});
