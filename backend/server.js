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

  if (!videoUrl) {
    return res.status(400).json({
      success: false,
      message: 'URL Facebook tidak ditemukan'
    });
  }

  // sementara disable yt-dlp biar server hidup dulu
  res.json({
    success: true,
    message: "API hidup 🔥",
    url: videoUrl
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});