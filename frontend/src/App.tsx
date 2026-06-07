import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { getMe, logout } from "./services/authService";
import "./App.css";

function App() {
  const [usuario, setUsuario] = useState<string | null>(null);
  // checking evita mostrar el login un instante antes de saber si hay sesión activa
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMe().then((data) => {
      setUsuario(data?.usuario ?? null);
      setChecking(false);
    });
  }, []);

  const handleLogin = (nombre: string) => setUsuario(nombre);

  const handleLogout = async () => {
    await logout();
    setUsuario(null);
  };

  if (checking) {
    return <div className="loading-screen">Cargando...</div>;
  }

  if (!usuario) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-mark">G</span>
            <span className="brand-name">Gestor de Inventario</span>
          </div>
          <div className="navbar-right">
            <span className="navbar-user">{usuario}</span>
            <button className="logout-button" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
      <ProductsPage />
    </>
  );
}

export default App;
