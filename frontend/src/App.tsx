import { ProductsPage } from "./pages/ProductsPage";
import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-mark">G</span>
            <span className="brand-name">Gestor de Inventario</span>
          </div>
          <span className="navbar-pill">Gestor de Inventario</span>
        </div>
      </nav>
      <ProductsPage />
    </>
  );
}

export default App;
