import sql from "mssql";
import dotenv from "dotenv";

// Carga las variables de entorno para no escribir credenciales directamente en el codigo
dotenv.config();

// Configuracion necesaria para conectarse a SQL Server
const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 1433,

  options: {
    // En local se deja encrypt en false para evitar problemas de certificados
    encrypt: false,

    // Permite confiar en el certificado del servidor local de SQL Server
    trustServerCertificate: true,
  },
};

// Funcion que intenta abrir la conexion con SQL Server
export const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con SQL Server:", error);
  }
};

// Exporto sql para poder usarlo en los controladores y hacer consultas a la base de datos
export default sql;
