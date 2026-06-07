import axios from "axios";

// Instancia de axios configurada para enviar y recibir cookies de sesión en cada request
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export default api;
