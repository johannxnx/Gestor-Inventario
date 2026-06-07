import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db";
import productRoutes from "./routes/productRoutes";

// Carga las variables del archivo .env para poder usar datos como PORT y credenciales de BD
dotenv.config();

// Se crea la aplicacion principal de Express
const app = express();

// Permite que el frontend pueda hacer peticiones al backend
app.use(cors());

// Permite recibir datos en formato JSON desde Postman o desde el frontend
app.use(express.json());

// Se conecta a SQL Server antes de usar las rutas de la API
connectDB();

// Todas las rutas de productos van a empezar con /api
app.use("/api", productRoutes);

// Ruta simple para comprobar que el servidor esta funcionando
app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

// Si no existe PORT en el .env, se usa el puerto 3001
const PORT = process.env.PORT || 3001;

// Levanta el servidor y muestra en consola la URL donde esta corriendo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
