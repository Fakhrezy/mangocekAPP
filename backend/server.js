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
      const { id, username, email, role } = rows[0];
      res.json({ message: 'Login berhasil', user: { id, username, email, role } });
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

app.post('/simpan-diagnosa', async (req, res) => {
  const { nama_penyakit, skor, gejala } = req.body;
  const waktu = new Date();

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'INSERT INTO hasil_diagnosa (nama_penyakit, skor, gejala_terpilih, waktu) VALUES (?, ?, ?, ?)',
      [nama_penyakit, skor, JSON.stringify(gejala), waktu]
    );
    await conn.end();
    res.status(200).json({ message: 'Diagnosa berhasil disimpan.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan diagnosa', error: err.message });
  }
});

app.post('/penyakit', async (req, res) => {
  const { nama, gejala, pengendalian } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);

    const [result] = await conn.execute('INSERT INTO penyakit (nama) VALUES (?)', [nama]);
    const idPenyakit = result.insertId;

    for (let g of gejala) {
      await conn.execute('INSERT INTO gejala (id_penyakit, deskripsi) VALUES (?, ?)', [idPenyakit, g]);
    }

    for (let p of pengendalian) {
      await conn.execute('INSERT INTO pengendalian (id_penyakit, tindakan) VALUES (?, ?)', [idPenyakit, p]);
    }

    await conn.end();
    res.status(201).json({ message: 'Penyakit berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan penyakit', error: err.message });
  }
});



app.get('/users', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT id, username, email FROM users');
    await conn.end();
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

// Ambil semua users
app.get('/users', async (req, res) => {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT id, username, email FROM users');
  await conn.end();
  res.json({ users: rows });
});

app.get('/hasil-diagnosa', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM hasil_diagnosa ORDER BY waktu DESC');
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data diagnosa', error: err.message });
  }
});

app.get('/knowledge-base', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);

    const [penyakit] = await conn.execute('SELECT * FROM penyakit');
    for (let p of penyakit) {
      const [gejala] = await conn.execute('SELECT * FROM gejala WHERE id_penyakit = ?', [p.id]);
      const [pengendalian] = await conn.execute('SELECT * FROM pengendalian WHERE id_penyakit = ?', [p.id]);
      p.gejala = gejala;
      p.pengendalian = pengendalian.map(p => p.tindakan);
    }

    await conn.end();
    res.json(penyakit);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data knowledge base', error: err.message });
  }
});

app.delete('/penyakit/:id', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('DELETE FROM penyakit WHERE id = ?', [req.params.id]);
    await conn.end();
    res.json({ message: 'Penyakit dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus', error: err.message });
  }
});

app.put('/penyakit/:id', async (req, res) => {
  const { nama, gejala, pengendalian } = req.body;
  const id = req.params.id;

  try {
    const conn = await mysql.createConnection(dbConfig);

    await conn.execute('UPDATE penyakit SET nama = ? WHERE id = ?', [nama, id]);
    await conn.execute('DELETE FROM gejala WHERE id_penyakit = ?', [id]);
    await conn.execute('DELETE FROM pengendalian WHERE id_penyakit = ?', [id]);

    for (let g of gejala) {
      await conn.execute('INSERT INTO gejala (id_penyakit, deskripsi) VALUES (?, ?)', [id, g]);
    }

    for (let p of pengendalian) {
      await conn.execute('INSERT INTO pengendalian (id_penyakit, tindakan) VALUES (?, ?)', [id, p]);
    }

    await conn.end();
    res.json({ message: 'Penyakit diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui', error: err.message });
  }
});


// Update user
app.put('/users/:id', async (req, res) => {
  const { username, email } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, req.params.id]);
  await conn.end();
  res.json({ message: 'User diperbarui' });
});

// Hapus user
app.delete('/users/:id', async (req, res) => {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
  await conn.end();
  res.json({ message: 'User dihapus' });
});


app.listen(5000, () => {
  console.log('✅ Server berjalan di http://localhost:5000');
});

