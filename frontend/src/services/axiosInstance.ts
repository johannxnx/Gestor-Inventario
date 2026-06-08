// Importo axios para crear la instancia configurada
import axios from "axios";

// Creo una instancia personalizada de axios con configuración compartida
// Así no tengo que repetir la URL base y las credenciales en cada llamada
const api = axios.create({
  // URL relativa: en desarrollo Vite hace proxy de /api → localhost:3001
  // En producción Nginx hace proxy de /api → localhost:3001
  // Así el mismo código funciona en ambos entornos sin cambios
  baseURL: "/api",

  // withCredentials: true es CRÍTICO para que las cookies de sesión funcionen
  // Sin esto, el navegador no manda la cookie "connect.sid" en las peticiones
  // y el servidor no puede identificar al usuario logueado
  withCredentials: true,
});

// Exporto la instancia para usarla en todos los servicios (authService, productService)
export default api;
