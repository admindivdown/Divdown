const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Divdown aktif');
});

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Backend Divdown berjalan' });
});

app.get('/api/facebook', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ success: false, message: 'URL Facebook tidak ditemukan' });

  const cmd = `python3 -m yt_dlp --dump-single-json --no-warnings --prefer-free-formats --skip-download "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr || error.message);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        uploader: data.uploader,
        webpage_url: data.webpage_url,
        formats: data.formats
      });
    } catch (parseError) {
      console.error(parseError);
      res.status(500).json({ success: false, message: parseError.message });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));