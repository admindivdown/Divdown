const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend Divdown aktif ✅'));

app.get('/api/facebook', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ success: false, message: 'URL tidak ada' });

  // Menambahkan --format "bestvideo" agar yt-dlp lebih cepat menentukan kualitas terbaik
  const cmd = `python3 -m yt_dlp --dump-single-json --no-warnings --skip-download "${videoUrl}"`;

  exec(cmd, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ success: false, message: 'Gagal memproses' });
    
    try {
      const data = JSON.parse(stdout);
      // Mencari format berdasarkan tinggi resolusi (height) untuk performa lebih stabil
      const formats = data.formats || [];
      const hd1080 = formats.find(f => f.height >= 1080);
      const hd720 = formats.find(f => f.height >= 720 && f.height < 1080) || formats.find(f => f.format_id === 'hd');

      res.json({
        success: true,
        thumbnail: data.thumbnail,
        hd720: hd720?.url || null,
        hd1080: hd1080?.url || hd720?.url || null // Fallback ke 720 jika 1080 tidak ada
      });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Error parsing data' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server jalan di port: ${PORT}`));
