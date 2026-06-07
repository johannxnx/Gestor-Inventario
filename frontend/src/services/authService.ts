import api from "./axiosInstance";

// Envía las credenciales al backend; si son correctas el servidor crea la sesión
export const login = async (
  usuario: string,
  password: string
): Promise<{ usuario: string }> => {
  const response = await api.post("/auth/login", { usuario, password });
  return response.data;
};

// Destruye la sesión en el servidor
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

// Verifica si hay una sesión activa al cargar la app
export const getMe = async (): Promise<{ usuario: string } | null> => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch {
    return null;
  }
};
