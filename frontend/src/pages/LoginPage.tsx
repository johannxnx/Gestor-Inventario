// FormEvent es el tipo que React usa para los eventos del formulario (submit, change, etc.)
import { FormEvent, useState } from "react";

// Importo la función que llama al backend para iniciar sesión
import { login } from "../services/authService";

// Defino las props que recibe este componente
// onLogin es una función que el componente padre (App.tsx) le pasa
// Se llama cuando el login es exitoso, pasando el nombre del usuario
interface LoginPageProps {
  onLogin: (usuario: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  // Estado para el campo de texto del usuario
  const [usuario, setUsuario] = useState("");

  // Estado para el campo de contraseña
  const [password, setPassword] = useState("");

  // Estado para mostrar mensajes de error (credenciales incorrectas, error de red, etc.)
  const [error, setError] = useState("");

  // Estado para saber si estamos esperando respuesta del servidor
  // Lo uso para deshabilitar el botón y mostrar "Verificando..." mientras carga
  const [isLoading, setIsLoading] = useState(false);

  // Esta función se ejecuta cuando el usuario hace submit del formulario
  const handleSubmit = async (e: FormEvent) => {
    // e.preventDefault() evita que el formulario recargue la página (comportamiento por defecto)
    e.preventDefault();

    // Limpio el error anterior antes de intentar el login
    setError("");
    setIsLoading(true);

    try {
      // Llamo al servicio de autenticación con los datos del formulario
      const data = await login(usuario, password);

      // Si el login fue exitoso, aviso al componente padre con el nombre del usuario
      // App.tsx guarda el usuario en su estado y muestra la app en vez del login
      onLogin(data.usuario);
    } catch (err: unknown) {
      // Si el login falló, el backend devuelve un error con su mensaje
      // Hago casting del error para poder acceder a la respuesta del servidor
      const axiosError = err as { response?: { data?: { error?: string } } };

      // Intento mostrar el mensaje del backend; si no hay, muestro un mensaje genérico
      const msg =
        axiosError?.response?.data?.error || "No se pudo conectar al servidor";
      setError(msg);
    } finally {
      // finally se ejecuta siempre, tanto si tuvo éxito como si falló
      // Vuelvo a activar el botón de submit
      setIsLoading(false);
    }
  };

  return (
    // Contenedor principal de la pantalla de login con el fondo verde degradado
    <div className="login-shell">

      {/* Tarjeta central con el formulario */}
      <div className="login-card">

        {/* Logo y nombre de la app */}
        <div className="login-brand">
          <span className="brand-mark">G</span>
          <span className="login-brand-name">Gestor de Inventario</span>
        </div>

        {/* Encabezado del formulario */}
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        {/* Muestro el mensaje de error solo si hay uno (string no vacío) */}
        {error && <div className="alert error">{error}</div>}

        {/* Formulario de login: al hacer submit llama a handleSubmit */}
        <form className="login-form" onSubmit={handleSubmit}>

          {/* Campo de usuario */}
          <label>
            Usuario
            <input
              autoComplete="username"     // ayuda al gestor de contraseñas del navegador
              placeholder="Ingresa tu usuario"
              required                    // el navegador valida que no esté vacío
              type="text"
              value={usuario}             // el valor viene del estado
              onChange={(e) => setUsuario(e.target.value)} // actualizo el estado al escribir
            />
          </label>

          {/* Campo de contraseña */}
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              required
              type="password"             // type="password" oculta los caracteres
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* Botón de submit: se deshabilita mientras espera respuesta del servidor */}
          <button
            className="primary-button login-submit"
            disabled={isLoading}          // no se puede hacer click mientras carga
            type="submit"
          >
            {/* Cambio el texto del botón según si estamos cargando o no */}
            {isLoading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};
