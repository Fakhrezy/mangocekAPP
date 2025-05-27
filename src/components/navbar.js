import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/">
        <img src="/images/navlogo.png" alt="Mangocek Logo" style={styles.logoImg} />
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Informasi</Link>
        <Link to="/deteksi" style={styles.link}>Deteksi</Link>
        <Link to="/pakar" style={styles.link}>Pakar</Link>
        {!isLoggedIn ? (
          <Link to="/login" style={styles.login}>Login</Link>
        ) : (
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#2e7d32',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoImg: {
    height: '90px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  login: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: '#43a047',
    border: '1px solid white',
    transition: 'background-color 0.3s',
  },
  logout: {
    backgroundColor: 'white',
    color: 'green',
    fontWeight: '600',
    border: '1px solid white',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};
