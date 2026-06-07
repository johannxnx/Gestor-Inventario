import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController";

const router = Router();

// Inicia sesión con usuario y contraseña
router.post("/login", login);

// Cierra la sesión activa
router.post("/logout", logout);

// Devuelve el usuario autenticado actualmente (para verificar sesión al cargar la app)
router.get("/me", getMe);

export default router;
