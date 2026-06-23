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

  const cmd = `yt-dlp --format "bestvideo[height<=1080]+bestaudio/best" --dump-single-json --no-warnings --skip-download --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" --force-generic-extractor "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Gagal memproses' });
    }

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats || [];

      const hd720 = formats.find(f => f.format_id === 'hd' || f.height === 720);
      const hd1080 = formats.find(f => f.height === 1080);

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
