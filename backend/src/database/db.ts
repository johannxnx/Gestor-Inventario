import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 1433,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con SQL Server:", error);
  }
};

export default sql;