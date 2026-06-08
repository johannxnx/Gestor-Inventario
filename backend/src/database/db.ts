// pg es el driver (conector) para PostgreSQL en Node.js
import { Pool } from "pg";

// dotenv carga las variables del archivo .env
import dotenv from "dotenv";

dotenv.config();

// Pool mantiene un conjunto de conexiones reutilizables a la base de datos
// Es más eficiente que abrir y cerrar una conexión por cada consulta
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432, // 5432 es el puerto default de PostgreSQL
});

// Función que verifica la conexión al arrancar el servidor
export const connectDB = async () => {
  try {
    // Hago una consulta simple para confirmar que la conexión funciona
    await pool.query("SELECT 1");
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);
  }
};

// Exporto el pool para usarlo en los controladores
export default pool;
