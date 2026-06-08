// Router de Express me permite agrupar rutas relacionadas en un archivo separado
// Así no tengo que poner todas las rutas directamente en server.ts
import { Router } from "express";

// Importo los controladores que van a manejar cada ruta
import { login, logout, getMe } from "../controllers/authController";

// Creo una instancia del router para registrar las rutas de autenticación
const router = Router();

// POST /api/auth/login
// El usuario manda usuario y contraseña, el controlador verifica y crea la sesión
router.post("/login", login);

// POST /api/auth/logout
// El usuario cierra sesión: destruye la sesión en el servidor y borra la cookie
router.post("/logout", logout);

// GET /api/auth/me
// El frontend llama a esto cuando carga para saber si ya hay sesión activa
// Si hay sesión devuelve el usuario, si no devuelve 401
router.get("/me", getMe);

// Exporto el router para usarlo en server.ts con app.use("/api/auth", authRoutes)
export default router;
