import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InformasiPage from "./pages/informasiPage";
import DeteksiPage from "./pages/deteksiPage";
import PakarPage from "./pages/pakarPage";
import LoginPage from './pages/loginPage';
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/protectedRoute"; // <== Tambahkan ini

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InformasiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deteksi"
          element={
            <ProtectedRoute>
              <DeteksiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pakar"
          element={
            <ProtectedRoute>
              <PakarPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
