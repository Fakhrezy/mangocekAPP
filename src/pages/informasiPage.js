// pages/InformasiPage.js
import knowledgeBase from '../data/knowledgeBase.json';

export default function InformasiPage() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/images/info.png" alt="Mangga" style={styles.image} />
        <h1 style={styles.title}>Informasi Penyakit Mangga</h1>
      </div>

      <div style={styles.grid}>
        {knowledgeBase.penyakit.map((p) => (
          <div key={p.id} style={styles.card}>
            <h2 style={styles.diseaseName}>{p.nama}</h2>

            <h4 style={styles.sectionTitle}>Gejala:</h4>
            <ul style={styles.list}>
              {p.gejala.map((g) => (
                <li key={g.id} style={styles.listItem}>{g.deskripsi}</li>
              ))}
            </ul>

            <h4 style={styles.sectionTitle}>Pengendalian:</h4>
            <ul style={styles.list}>
              {p.pengendalian.map((item, i) => (
                <li key={i} style={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '15px',
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'contain',
  },
  title: {
    fontSize: '28px',
    color: '#2e7d32',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: '#f9fbe7',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  diseaseName: {
    color: '#33691e',
    marginBottom: '10px',
  },
  sectionTitle: {
    marginTop: '10px',
    color: '#558b2f',
  },
  list: {
    paddingLeft: '20px',
    marginTop: '5px',
  },
  listItem: {
    marginBottom: '5px',
  },
};
