const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

// Rute tes
app.get('/', (req, res) => res.send('Backend Divdown aktif ✅'));
app.get('/test', (req, res) => res.json({ sukses: true, status: 'Online' }));

// API Facebook - Inti utama untuk menarik data
app.get('/api/facebook', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ success: false, message: 'URL Facebook tidak ditemukan' });
  }

  // Menggunakan yt-dlp untuk mendapatkan data video
  const cmd = `python3 -m yt_dlp --dump-single-json --no-warnings --skip-download "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution Error:', stderr || error.message);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }
    
    try {
      const data = JSON.parse(stdout);
      const hd720 = data.formats?.find(f => f.format_id === 'hd');

      res.json({
        success: true,
        thumbnail: data.thumbnail,
        hd720: hd720?.url || null
      });
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      res.status(500).json({ success: false, message: 'Gagal memproses data video' });
    }
  });
});

// Wajib untuk Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Divdown berjalan di port: ${PORT}`));
