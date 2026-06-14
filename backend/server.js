const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Rute tes
app.get('/', (req, res) => res.send('Backend Divdown aktif ✅'));
app.get('/test', (req, res) => res.json({ sukses: true }));

// API Facebook (sudah siap, aman)
app.get('/api/facebook', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ sukses: false, pesan: 'URL kosong' });

  const cmd = `python3 -m yt_dlp --dump-single-json --no-warnings --skip-download "${videoUrl}"`;
  exec(cmd, { maxBuffer: 1024*5000 }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ sukses: false, error: stderr||err.message });
    try {
      const data = JSON.parse(stdout);
      const hd720 = data.formats?.find(f => f.format_id === 'hd');
      res.json({ sukses: true, thumbnail: data.thumbnail, hd720: hd720?.url||null });
    } catch (e) {
      res.status(500).json({ sukses: false, pesan: e.message });
    }
  });
});

// Wajib untuk Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Jalan di port ${PORT}`));
