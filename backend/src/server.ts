import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { connectDB } from "./database/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import { requireAuth } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

// Permite que el frontend (Vite en puerto 5173) envíe y reciba cookies de sesión
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Configura el sistema de sesiones con cookie httpOnly para mayor seguridad
app.use(session({
  secret: process.env.SESSION_SECRET || "disagro-secret-dev",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,     // Cambiar a true cuando se use HTTPS en producción
    maxAge: 1000 * 60 * 60 * 8, // 8 horas
  },
}));

connectDB();

// Rutas públicas: login, logout y verificación de sesión
app.use("/api/auth", authRoutes);

// Rutas protegidas: solo accesibles con sesión activa
app.use("/api", requireAuth, productRoutes);

app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
