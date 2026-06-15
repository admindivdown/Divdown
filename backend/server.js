const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());

// Rute tes
app.get('/', (req, res) => {
  res.send('✅ Backend Divdown AKTIF & BERJALAN');
});

app.get('/test', (req, res) => {
  res.json({ sukses: true, pesan: 'Server siap dipakai' });
});

// API sementara
app.get('/api/facebook', (req, res) => {
  res.json({ sukses: true, pesan: 'API siap nanti' });
});

// ⚠️ PENTING: Baca port dari sistem Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port: ${PORT}`);
});
