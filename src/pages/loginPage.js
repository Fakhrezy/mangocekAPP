import { useState } from 'react';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/";
  };

  return (
    <div>
      {/* Main Container */}
      <div style={styles.container}>
        {/* Landing Content */}
        <div style={styles.content}>
          <div style={styles.imageBox}>
            <img
              src="images/ill3.jpg"
              alt="Illustrasi"
              style={styles.image}
            />
          </div>
          <div style={styles.textContent}>
            <h1 style={styles.heading}>Selamat Datang di Aplikasi Mangocek</h1>
            <p style={styles.description}>Aplikasi sistem pakar untuk mendeteksi penyakit tumbuhan mangga</p>
            <button style={styles.loginButton} onClick={() => setShowLogin(true)}>Login</button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tentang Aplikasi</h2>
        <p style={styles.sectionText}>
          Mangocek adalah sistem pakar yang dirancang untuk membantu petani dan pengguna dalam mendiagnosis penyakit pada tanaman mangga secara cepat dan akurat. 
          Aplikasi ini menggunakan metode forward chaining untuk mencocokkan gejala dan memberikan diagnosis serta solusi penanganan.
        </p>
      </div>

      {/* Team Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tim Pengembang</h2>
        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
            <img src="images/esme.jpg" alt="Anggota Tim" style={styles.teamImage} />
            <h3 style={styles.teamName}>Tri</h3>
            <p style={styles.teamRole}>Pengembang Front-End</p>
          </div>
          <div style={styles.teamCard}>
            <img src="images/linda.jpg" alt="Anggota Tim" style={styles.teamImage} />
            <h3 style={styles.teamName}>Irna</h3>
            <p style={styles.teamRole}>Analis Sistem</p>
          </div>
          <div style={styles.teamCard}>
            <img src="images/cillian.png" alt="Anggota Tim" style={styles.teamImage} />
            <h3 style={styles.teamName}>Deden</h3>
            <p style={styles.teamRole}>Pengembang Back-End</p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Login</button>
            </form>
            <button onClick={() => setShowLogin(false)} style={styles.closeButton}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '1000px',
    flexWrap: 'wrap',
  },
  imageBox: {
    flex: '1 1 400px',
    textAlign: 'center',
  },
  image: {
    width: '500px',
    height: '400px',
  },
  textContent: {
    flex: '1 1 400px',
    textAlign: 'left',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#2e7d32',
    marginBottom: '20px',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    color: '#555',
  },
  loginButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#43a047',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  section: {
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#2e7d32',
    marginBottom: '20px',
  },
  sectionText: {
    fontSize: '1.1rem',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#444',
  },
  teamGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '30px',
    gap: '20px',
  },
  teamCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '250px',
    textAlign: 'center',
  },
  teamImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  teamName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  teamRole: {
    fontSize: '1rem',
    color: '#555',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    marginBottom: '20px',
    color: '#2e7d32',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#43a047',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  closeButton: {
    marginTop: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};
