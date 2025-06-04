const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { execFile } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi koneksi database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // ganti dengan password MySQL kamu
  database: 'mangocek_db' // ganti dengan nama database kamu
};

// Upload konfigurasi dengan multer
const upload = multer({ dest: 'uploads/' });

/**
 * Endpoint registrasi user baru
 */
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi (username, email, password).' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    await conn.end();
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email sudah terdaftar' });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  }
});

/**
 * Endpoint login
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email dan password diperlukan.' });

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    await conn.end();

    if (rows.length > 0) {
      const { id, username, email } = rows[0];
      res.json({ message: 'Login berhasil', user: { id, username, email } });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
});

/**
 * Endpoint prediksi gambar (menggunakan Python child_process)
 */
app.post('/predict', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Gambar tidak ditemukan.' });

  const imagePath = path.resolve(req.file.path);

  execFile('python3', ['predict.py', imagePath], (error, stdout, stderr) => {
    if (error) {
      console.error('Gagal menjalankan script Python:', error);
      return res.status(500).json({ error: 'Error saat prediksi gambar' });
    }

    const lines = stdout.trim().split('\n');
    const resultLine = lines[lines.length - 1]; // Ambil baris terakhir
    const [label, confidence] = resultLine.trim().split(',');

    if (!label || isNaN(confidence)) {
      return res.status(500).json({ error: 'Output dari model tidak valid.' });
    }

    res.json({ label, confidence: parseFloat(confidence) * 100 });
  });
});

app.listen(5000, () => {
  console.log('✅ Server berjalan di http://localhost:5000');
});
