const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('✅ Backend Divdown AKTIF'));
app.get('/test', (req, res) => res.json({ok: true}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server jalan di port ${PORT}`));
