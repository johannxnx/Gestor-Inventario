// Importo la instancia de axios ya configurada con la URL base y withCredentials
import api from "./axiosInstance";

// Función para iniciar sesión
// Manda usuario y contraseña al backend, que verifica y crea la sesión
// Si las credenciales son incorrectas, axios lanza un error que el componente debe capturar
export const login = async (
  usuario: string,
  password: string
): Promise<{ usuario: string }> => {
  // POST /api/auth/login con los datos del formulario en el body
  const response = await api.post("/auth/login", { usuario, password });

  // El backend devuelve { usuario: "nombre" } si el login fue exitoso
  return response.data;
};

// Función para cerrar sesión
// Le avisa al servidor que destruya la sesión y borre la cookie
export const logout = async (): Promise<void> => {
  // POST /api/auth/logout (no necesita body, el servidor identifica la sesión por la cookie)
  await api.post("/auth/logout");
};

// Función para verificar si hay una sesión activa
// Se llama al cargar la app para saber si el usuario ya estaba logueado
// Devuelve el usuario si hay sesión, o null si no hay (o si el servidor responde con error)
export const getMe = async (): Promise<{ usuario: string } | null> => {
  try {
    // GET /api/auth/me: el servidor revisa si la cookie de sesión es válida
    const response = await api.get("/auth/me");
    return response.data; // devuelve { usuario: "nombre" } si hay sesión
  } catch {
    // Si el servidor responde con 401 (no hay sesión), axios lanza un error
    // Lo capturo aquí y devuelvo null en vez de dejar que explote
    return null;
  }
};
