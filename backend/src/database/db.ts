// mssql es el driver (conector) para SQL Server en Node.js
// Me permite hacer consultas a la base de datos desde el código
import sql from "mssql";

// dotenv carga las variables del archivo .env para no escribir credenciales en el código
import dotenv from "dotenv";

// Ejecuto dotenv para que lea el archivo .env antes de leer las variables
dotenv.config();

// Objeto de configuración con los datos necesarios para conectarse a SQL Server
// Todos los valores sensibles (usuario, contraseña) vienen del archivo .env
const dbConfig: sql.config = {
  user: process.env.DB_USER,           // usuario de la base de datos
  password: process.env.DB_PASSWORD,   // contraseña del usuario
  server: process.env.DB_SERVER || "localhost", // dirección del servidor SQL Server
  database: process.env.DB_NAME,       // nombre de la base de datos
  port: Number(process.env.DB_PORT) || 1433, // puerto de SQL Server (1433 es el default)

  options: {
    // En desarrollo local desactivo el cifrado porque no tenemos certificado SSL configurado
    // En producción esto debería ser true
    encrypt: false,

    // Le digo que confíe en el certificado del servidor local sin validarlo externamente
    // Necesario para conexiones locales sin certificado firmado por una autoridad
    trustServerCertificate: true,
  },
};

// Función asíncrona que abre la conexión con SQL Server
// La llamo una sola vez al arrancar el servidor (en server.ts)
export const connectDB = async () => {
  try {
    // sql.connect() establece el pool de conexiones con la base de datos
    await sql.connect(dbConfig);
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    // Si la conexión falla, muestro el error pero NO detengo el servidor
    // Podría mejorar esto haciendo process.exit(1) para detenerlo si la BD es crítica
    console.error("Error al conectar con SQL Server:", error);
  }
};

// Exporto la instancia de sql para usarla en los controladores
// Con esta instancia puedo hacer consultas: sql.query(), new sql.Request(), etc.
export default sql;
