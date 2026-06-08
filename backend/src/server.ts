// Importo express, que es el framework que me permite crear el servidor web
// Express facilita mucho el manejo de rutas y peticiones HTTP
import express from "express";

// cors me permite controlar desde qué sitios web se puede hablar con este servidor
// Sin cors configurado, el navegador bloquea las peticiones del frontend por seguridad
import cors from "cors";

// express-session es el paquete que maneja las sesiones de usuario
// Una sesión es básicamente la "memoria" que el servidor tiene de cada usuario conectado
// Funciona con una cookie que le da al navegador para identificarlo en cada petición
import session from "express-session";

// dotenv me permite leer el archivo .env donde guardo las variables de entorno
// Así no tengo que escribir contraseñas o claves secretas directamente en el código
import dotenv from "dotenv";

// Importo la función que abre la conexión con la base de datos SQL Server
import { connectDB } from "./database/db";

// Importo el archivo de rutas de productos (CRUD)
import productRoutes from "./routes/productRoutes";

// Importo el archivo de rutas de autenticación (login, logout, etc.)
import authRoutes from "./routes/authRoutes";

// Importo el middleware que protege las rutas que necesitan sesión activa
import { requireAuth } from "./middleware/authMiddleware";

// Ejecuto dotenv para que lea el .env y cargue las variables de entorno
dotenv.config();

// Creo la aplicación de Express. Esto es básicamente el servidor
const app = express();

// Configuro CORS para que solo el frontend pueda comunicarse con el backend
// origin: es la URL del frontend (Vite corre por defecto en el puerto 5173)
// credentials: true es OBLIGATORIO para que las cookies de sesión funcionen
// Si esto queda en false, el navegador no manda ni recibe cookies entre frontend y backend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Este middleware le dice a Express que lea el body de las peticiones como JSON
// Sin esto, si el frontend manda datos en formato JSON, req.body estaría siempre vacío
app.use(express.json());

// Configuro el sistema de sesiones con express-session
// La sesión guarda datos del usuario en el servidor y le da una cookie al navegador
app.use(session({
  // secret es la clave secreta con la que se firma la cookie
  // Si alguien intenta modificar la cookie, la firma no va a coincidir y se rechaza
  secret: process.env.SESSION_SECRET || "disagro-secret-dev",

  // resave: false evita que la sesión se vuelva a guardar si no hubo cambios
  // Esto mejora el rendimiento porque no hace escrituras innecesarias
  resave: false,

  // saveUninitialized: false evita crear sesiones vacías para usuarios que no iniciaron sesión
  // Buena práctica para no llenar el almacenamiento con sesiones inútiles
  saveUninitialized: false,

  cookie: {
    // httpOnly: true es una medida de seguridad importante
    // Evita que JavaScript del navegador pueda leer la cookie (protege contra XSS)
    httpOnly: true,

    // secure: false porque estamos en desarrollo local sin HTTPS
    // En producción esto DEBE ser true para que la cookie solo viaje por HTTPS
    secure: false,

    // Cuánto tiempo dura la sesión: 1000ms * 60s * 60min * 8h = 8 horas
    maxAge: 1000 * 60 * 60 * 8,
  },
}));

// Conecto a la base de datos cuando arranca el servidor
connectDB();

// Rutas de autenticación: son PÚBLICAS, no necesitan sesión para acceder
// Tiene sentido porque /api/auth/login es justamente donde se crea la sesión
app.use("/api/auth", authRoutes);

// Rutas de productos: están PROTEGIDAS por el middleware requireAuth
// requireAuth revisa que haya una sesión activa antes de dejar pasar la petición
// Si no hay sesión, devuelve 401 y la petición nunca llega al controlador
app.use("/api", requireAuth, productRoutes);

// Ruta de prueba para confirmar que el servidor está corriendo
app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

// Uso el puerto del .env o el 3001 por defecto
const PORT = process.env.PORT || 3001;

// Arranco el servidor y muestro en consola en qué dirección está disponible
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
