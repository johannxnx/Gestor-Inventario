// useEffect: ejecuta código cuando el componente se monta o cuando cambian sus dependencias
// useState: guarda valores que cuando cambian hacen que el componente se vuelva a renderizar
import { useEffect, useState } from "react";

// Importo la página de login que se muestra cuando no hay sesión
import { LoginPage } from "./pages/LoginPage";

// Importo la página principal con el gestor de inventario
import { ProductsPage } from "./pages/ProductsPage";

// Importo las funciones para verificar la sesión y cerrar sesión
import { getMe, logout } from "./services/authService";

// Estilos globales de la app (navbar, login, etc.)
import "./App.css";

function App() {
  // usuario guarda el nombre del usuario logueado
  // null = no hay sesión activa, string = hay sesión y este es el nombre
  const [usuario, setUsuario] = useState<string | null>(null);

  // checking es true mientras verificamos si ya había una sesión antes de abrir la app
  // Sirve para mostrar "Cargando..." en vez de parpadear entre login y app
  const [checking, setChecking] = useState(true);

  // useEffect con [] vacío se ejecuta UNA sola vez cuando el componente se monta
  // Lo uso para preguntarle al backend si ya hay sesión activa (por ejemplo, si el usuario
  // ya había iniciado sesión antes y recarga la página)
  useEffect(() => {
    getMe().then((data) => {
      // Si getMe devuelve un usuario, lo guardo en el estado
      // Si devuelve null (no hay sesión), el estado queda en null
      // El ?? null es para que TypeScript no se queje si data es undefined
      setUsuario(data?.usuario ?? null);

      // Ya terminé de verificar, desactivo la pantalla de carga
      setChecking(false);
    });
  }, []); // el [] vacío significa "solo ejecutar esto una vez, al montar el componente"

  // Esta función la recibe LoginPage como prop
  // Se llama cuando el login es exitoso, pasando el nombre del usuario
  const handleLogin = (nombre: string) => setUsuario(nombre);

  // Esta función cierra la sesión: primero destruye la sesión en el servidor
  // y luego limpia el estado local para que App vuelva a mostrar el login
  const handleLogout = async () => {
    await logout();    // llama al backend para destruir la sesión
    setUsuario(null);  // limpia el estado local, React vuelve a renderizar el login
  };

  // Mientras estamos verificando si hay sesión, muestro una pantalla de carga
  // Sin esto, el login aparecería por un instante aunque el usuario ya estuviera logueado
  if (checking) {
    return <div className="loading-screen">Cargando...</div>;
  }

  // Si no hay usuario en el estado (null), renderizo la página de login
  // Le paso handleLogin como prop para que pueda avisar cuando el login sea exitoso
  if (!usuario) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Si hay usuario logueado, muestro la navbar y la página principal de productos
  return (
    <>
      {/* La navbar aparece en la parte superior de la pantalla */}
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo y nombre de la aplicación */}
          <div className="navbar-brand">
            <span className="brand-mark">G</span>
            <span className="brand-name">Gestor de Inventario</span>
          </div>

          {/* Parte derecha: nombre del usuario y botón de cerrar sesión */}
          <div className="navbar-right">
            {/* Muestro el nombre del usuario logueado */}
            <span className="navbar-user">{usuario}</span>

            {/* Al hacer click llamo a handleLogout que cierra la sesión */}
            <button className="logout-button" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Página principal con el formulario y la tabla de productos */}
      <ProductsPage />
    </>
  );
}

export default App;
