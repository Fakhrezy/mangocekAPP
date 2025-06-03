import { useState } from 'react';
import knowledgeBase from '../data/knowledgeBase.json';

export default function PakarPage() {
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [hasil, setHasil] = useState([]);

  const semuaGejala = [...new Set(
    knowledgeBase.penyakit.flatMap(p => p.gejala)
  )];

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedGejala(prev =>
      e.target.checked ? [...prev, id] : prev.filter(g => g !== id)
    );
  };

  const handleDiagnosa = () => {
    const hasilDeteksi = knowledgeBase.penyakit.map(p => {
      const cocok = p.gejala.filter(g => selectedGejala.includes(g.id));
      return { ...p, jumlahCocok: cocok.length };
    }).filter(p => p.jumlahCocok > 0);

    hasilDeteksi.sort((a, b) => b.jumlahCocok - a.jumlahCocok);
    setHasil(hasilDeteksi);
  };

  return (
    <div style={styles.container}>
        <img
      src="/images/ill3.jpg"
      alt="Diagnosa"
      style={styles.gambar}
    />
      <h1 style={styles.title}>Diagnosa Penyakit Tanaman Mangga</h1>

      <div style={styles.grid}>
        {semuaGejala.map(g => (
          <label key={g.id} style={styles.checkboxCard}>
            <input type="checkbox" value={g.id} onChange={handleChange} />
            <span>{g.deskripsi}</span>
          </label>
        ))}
      </div>

      <button onClick={handleDiagnosa} style={styles.button}>🔍 Diagnosa</button>

      {hasil.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={styles.resultTitle}>Hasil Diagnosa:</h2>
          {hasil.map(p => (
            <div key={p.id} style={styles.resultCard}>
              <h3>{p.nama}</h3>
              <p><strong>Jumlah gejala cocok:</strong> {p.jumlahCocok}</p>
              <h4>Pengendalian:</h4>
              <ul>{p.pengendalian.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '26px',
    color: '#2e7d32',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  checkboxCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9fbe7',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
  },
  button: {
    display: 'block',
    margin: '0 auto',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#43a047',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  resultTitle: {
    fontSize: '22px',
    color: '#2e7d32',
  },
  resultCard: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  gambar: {
  width: '100%',
  maxWidth: '200px',
  display: 'block',
  margin: '0 auto 20px',
},
};
