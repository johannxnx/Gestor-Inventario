import { FormEvent, useState } from "react";
import { login } from "../services/authService";

interface LoginPageProps {
  onLogin: (usuario: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(usuario, password);
      onLogin(data.usuario);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const msg =
        axiosError?.response?.data?.error || "No se pudo conectar al servidor";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">G</span>
          <span className="login-brand-name">Gestor de Inventario</span>
        </div>

        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        {error && <div className="alert error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              required
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </label>

          <label>
            Contraseña
            <input
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="primary-button login-submit"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};
